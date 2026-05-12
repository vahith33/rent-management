'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { createServiceRoleClient } from '@/lib/supabase/service'

async function getAuthenticatedOwnerId() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  // Create a service role client for the database lookup to bypass RLS
  const adminSupabase = createServiceRoleClient()

  // If we have a real authenticated user
  if (user?.email) {
    const { data: ownerData, error: lookupError } = await adminSupabase
      .from('owners')
      .select('id')
      .eq('email', user.email)
      .single()
      
    if (!lookupError && ownerData) return ownerData.id
  }

  // Fallback for mock/dev sessions
  const cookieStore = await cookies()
  const mockEmail = cookieStore.get('mock_session_email')?.value
  
  if (mockEmail) {
    const { data, error: lookupError } = await adminSupabase
      .from('owners')
      .select('id')
      .eq('email', mockEmail)
      .single()
      
    if (!lookupError && data) return data.id
  }
  
  // Final fallback for local development (only if above fails)
  console.warn('Authentication/Owner lookup failed, using dev fallback ID')
  return 'e3bdf815-ffc0-4a7c-aa35-fa9647fa7d4e' 
}

export async function getOwnerInfo() {
  const ownerId = await getAuthenticatedOwnerId()
  const supabase = createServiceRoleClient()
  
  const { data: owner } = await supabase
    .from('owners')
    .select('name, phone, email, properties(id, name)')
    .eq('id', ownerId)
    .single()

  return {
    id: ownerId,
    name: owner?.name || "Owner",
    phone: owner?.phone || "",
    email: owner?.email || "",
    pg_name: owner?.properties?.[0]?.name || "My PG",
    propertyId: owner?.properties?.[0]?.id
  }
}

export async function updateOwnerProfile(data) {
  const supabase = createServiceRoleClient()
  
  // Try to get owner ID. Note: If email just changed, lookup might fail by email.
  // We'll pass the owner ID from the client if we're syncing after email change.
  let ownerId = data.ownerId
  if (!ownerId) {
    ownerId = await getAuthenticatedOwnerId()
  }

  try {
    // Build update object
    const updateData = {}
    if (data.name) updateData.name = data.name
    if (data.phone) updateData.phone = data.phone
    if (data.email) updateData.email = data.email

    // 1. Update Owner Basic Info
    const { error: ownerError } = await supabase
      .from('owners')
      .update(updateData)
      .eq('id', ownerId)

    if (ownerError) throw ownerError

    // 2. Update Property Name if provided
    if (data.propertyId && data.pg_name) {
      const { error: propError } = await supabase
        .from('properties')
        .update({ name: data.pg_name })
        .eq('id', data.propertyId)
      
      if (propError) throw propError
    }

    return { success: true }
  } catch (err) {
    console.error("Update failed:", err)
    return { success: false, error: err.message }
  }
}

export async function getOwnerDashboardData() {
  const ownerId = await getAuthenticatedOwnerId()
  const supabase = createServiceRoleClient()

  // 1. Fetch Owner and Active Tenants first
  const [ownerRes, tenantsListRes] = await Promise.all([
    supabase.from('owners').select('name, phone, properties(id, name)').eq('id', ownerId).single(),
    supabase.from('tenants').select('id').eq('owner_id', ownerId).eq('status', 'ACTIVE')
  ])

  const owner = ownerRes.data
  const propertyIds = owner?.properties?.map(p => p.id) || []
  const pg_name = owner?.properties?.[0]?.name || "My PG"
  const activeTenantIds = tenantsListRes.data?.map(t => t.id) || []

  if (propertyIds.length === 0) {
    return {
      owner: { name: owner?.name, phone: owner?.phone, pg_name },
      stats: { totalTenants: 0, vacantBeds: 0, pendingRentCount: 0, monthlyIncome: "0", occupancyRate: 0 },
      recentRent: []
    }
  }

  // 2. Fetch all other data in parallel
  const currentMonthStart = new Date()
  currentMonthStart.setDate(1)
  currentMonthStart.setHours(0,0,0,0)

  const [roomsRes, rentRes, incomeRes] = await Promise.all([
    // Room Stats
    supabase.from('rooms').select('id, capacity, tenant_assignments(id, status)').in('property_id', propertyIds),
    
    // Recent Rent (filtered by active tenants)
    supabase.from('rent_payments')
      .select('id, amount, status, due_date, tenants(name, phone)')
      .in('tenant_id', activeTenantIds)
      .order('due_date', { ascending: false })
      .limit(10),

    // Monthly Income
    supabase.from('rent_records')
      .select('amount')
      .eq('status', 'PAID')
      .gte('paid_at', currentMonthStart.toISOString())
      .in('tenant_id', activeTenantIds)
  ])

  // 3. Process the results
  let totalBeds = 0
  let occupiedBeds = 0
  if (roomsRes.data) {
    roomsRes.data.forEach(room => {
      totalBeds += room.capacity
      occupiedBeds += room.tenant_assignments?.filter(ta => 
        String(ta.status).toUpperCase() === 'ACTIVE'
      ).length || 0
    })
  }

  const monthlyIncome = incomeRes.data?.reduce((sum, record) => sum + (record.amount || 0), 0) || 0
  const pendingRentCount = rentRes.data?.filter(r => r.status === 'UNPAID').length || 0
  
  return {
    owner: {
      name: owner?.name,
      phone: owner?.phone,
      pg_name: pg_name
    },
    stats: {
      totalTenants: activeTenantIds.length,
      vacantBeds: totalBeds - occupiedBeds,
      pendingRentCount,
      monthlyIncome: monthlyIncome.toLocaleString('en-IN'),
      occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0
    },
    recentRent: rentRes.data || []
  }
}

export async function createTenant(tenantData) {
  const ownerId = await getAuthenticatedOwnerId()
  const supabase = createServiceRoleClient()
  
  // 1. Create the tenant record
  const { roomId, bedId, ...profileData } = tenantData
  
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .insert([{
      ...profileData,
      owner_id: ownerId,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (tenantError) {
    console.error('Error creating tenant:', tenantError)
    return { success: false, error: tenantError.message }
  }

  // 2. If a room was selected, create the assignment
  if (roomId) {
    const { error: assignmentError } = await supabase
      .from('tenant_assignments')
      .insert([{
        tenant_id: tenant.id,
        room_id: roomId,
        bed_index: bedId, // Using bedId as a label or index
        status: 'active',
        assigned_at: new Date().toISOString()
      }])

    if (assignmentError) {
      console.error('Error creating assignment:', assignmentError)
      return { 
        success: false, 
        error: `Tenant created but room assignment failed: ${assignmentError.message}.` 
      }
    }
  }

  // 3. Create initial rent payment record
  if (tenantData.rent && tenantData.due_day) {
    const moveInDate = new Date(tenantData.move_in_date);
    const dueDay = parseInt(tenantData.due_day);
    
    // Calculate first due date
    let dueDate = new Date(moveInDate.getFullYear(), moveInDate.getMonth(), dueDay);
    
    // If the due day is before or on move-in, it might be for the current month 
    // or next month depending on the business logic. 
    // Usually, rent is due for the upcoming period.
    if (dueDate < moveInDate) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }

    await supabase
      .from('rent_payments')
      .insert([{
        tenant_id: tenant.id,
        amount: tenantData.rent,
        status: 'UNPAID',
        due_date: dueDate.toISOString().split('T')[0],
        created_at: new Date().toISOString()
      }])
  }

  return { success: true, data: tenant }
}

export async function getTenants() {
  const ownerId = await getAuthenticatedOwnerId()
  const supabase = createServiceRoleClient()
  
  const { data, error } = await supabase
    .from('tenants')
    .select(`
      *,
      tenant_assignments(
        status,
        room_id,
        bed_index,
        rooms(room_number)
      )
    `)
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tenants:', error)
    return []
  }

  // Flatten and normalize data for the UI
  const formattedData = data?.map(tenant => {
    // Get the active assignment
    const activeAssignment = tenant.tenant_assignments?.find(ta => ta.status === 'ACTIVE') || tenant.tenant_assignments?.[0];
    const roomNumber = activeAssignment?.rooms?.room_number;

    return {
      ...tenant,
      room: roomNumber ? `Room ${roomNumber}` : "Unassigned",
      initials: tenant.name?.substring(0, 1).toUpperCase() || "?",
      rent: tenant.rent ? `₹${Number(tenant.rent).toLocaleString('en-IN')}` : "₹0",
      deposit: tenant.deposit ? `₹${Number(tenant.deposit).toLocaleString('en-IN')}` : "₹0",
      moveIn: tenant.move_in_date ? new Date(tenant.move_in_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A",
      period: tenant.agreement_period || "N/A",
      govId: tenant.id_type || "N/A"
    }
  })

  return formattedData || []
}

export async function updateTenant(tenantId, tenantData) {
  const ownerId = await getAuthenticatedOwnerId()
  const supabase = createServiceRoleClient()
  
  const { roomId, bedId, ...profileData } = tenantData
  
  // 1. Update the main tenant profile
  const { error: tenantError } = await supabase
    .from('tenants')
    .update({
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .eq('id', tenantId)
    .eq('owner_id', ownerId)

  if (tenantError) {
    console.error('Error updating tenant:', tenantError)
    return { success: false, error: tenantError.message }
  }

  // 2. Handle room assignment updates if changed
  if (roomId) {
    // Check for existing active assignment
    const { data: existing } = await supabase
      .from('tenant_assignments')
      .select('id, room_id, bed_index')
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .single()

    if (!existing || existing.room_id !== roomId || existing.bed_index !== bedId) {
      // Deactivate old assignments
      await supabase
        .from('tenant_assignments')
        .update({ status: 'inactive', deactivated_at: new Date().toISOString() })
        .eq('tenant_id', tenantId)
        .eq('status', 'active')

      // Create new assignment
      const { error: assignmentError } = await supabase
        .from('tenant_assignments')
        .insert([{
          tenant_id: tenantId,
          room_id: roomId,
          bed_index: bedId,
          status: 'active',
          assigned_at: new Date().toISOString()
        }])

      if (assignmentError) {
        console.error('Error updating assignment:', assignmentError)
      }
    }
  }

  return { success: true }
}

export async function removeTenant(tenantId) {
  const ownerId = await getAuthenticatedOwnerId()
  const supabase = createServiceRoleClient()
  
  // 1. Delete related records first to avoid foreign key violations
  await supabase.from('rent_records').delete().eq('tenant_id', tenantId)
  await supabase.from('rent_payments').delete().eq('tenant_id', tenantId)
  await supabase.from('tenant_assignments').delete().eq('tenant_id', tenantId)

  // 2. Delete the tenant
  const { error } = await supabase
    .from('tenants')
    .delete()
    .eq('id', tenantId)
    .eq('owner_id', ownerId)

  if (error) {
    console.error('Error removing tenant:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function createRoom(roomData) {
  const ownerId = await getAuthenticatedOwnerId()
  const supabase = createServiceRoleClient()
  
  // Fetch the owner's first property ID
  const { data: owner } = await supabase
    .from('owners')
    .select('properties(id)')
    .eq('id', ownerId)
    .single()
    
  const propertyId = owner?.properties?.[0]?.id
  if (!propertyId) return { success: false, error: "No property found for this owner" }

  const { data, error } = await supabase
    .from('rooms')
    .insert([{
      ...roomData,
      rent_per_bed: roomData.price,
      property_id: propertyId,
      status: 'available',
      image_url: roomData.image_url || null
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating room:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getRooms() {
  const ownerId = await getAuthenticatedOwnerId()
  const supabase = createServiceRoleClient()
  
  // 1. Fetch Owner's property first
  const { data: owner } = await supabase
    .from('owners')
    .select('properties(id)')
    .eq('id', ownerId)
    .single()
    
  const propertyId = owner?.properties?.[0]?.id
  if (!propertyId) return []

  // 2. Fetch all rooms for this property
  const { data, error } = await supabase
    .from('rooms')
    .select('*, tenant_assignments(id, status, bed_index)')
    .eq('property_id', propertyId)
    .order('room_number', { ascending: true })

  if (error) {
    console.error('Error fetching rooms:', error)
    return []
  }

  // 3. Format data for UI
  const formattedRooms = data.map(room => {
    const activeTenants = room.tenant_assignments?.filter(ta => 
      String(ta.status).toUpperCase() === 'ACTIVE'
    ).length || 0
    const available = room.capacity - activeTenants
    
    let status = "VACANT"
    if (activeTenants > 0) {
      status = activeTenants >= room.capacity ? "OCCUPIED" : "PARTIAL"
    }

    return {
      id: room.id,
      name: `Room ${room.room_number}`,
      room_number: room.room_number,
      building: room.building_number || "Main",
      floor: room.floor,
      status,
      price: `₹${Number(room.rent_per_bed).toLocaleString('en-IN')}`,
      rawPrice: room.rent_per_bed,
      type: `${room.sharing_type} - ${room.room_type}`,
      sharing_type: room.sharing_type,
      beds: room.capacity,
      available,
      assignments: room.tenant_assignments || [],
      amenities: room.amenities || [],
      desc: room.description || `Spacious ${room.sharing_type} room located in Building ${room.building_number || 'Main'} on the ${room.floor}.`
    }
  })

  return formattedRooms
}

export async function removeRoom(roomId) {
  const ownerId = await getAuthenticatedOwnerId()
  const supabase = createServiceRoleClient()
  
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId)

  if (error) {
    console.error('Error removing room:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateRoom(roomId, roomData) {
  const ownerId = await getAuthenticatedOwnerId()
  const supabase = createServiceRoleClient()
  
  const { data, error } = await supabase
    .from('rooms')
    .update({
      ...roomData,
      rent_per_bed: roomData.price, // Map UI price to DB column
      updated_at: new Date().toISOString()
    })
    .eq('id', roomId)
    .select()
    .single()

  if (error) {
    console.error('Error updating room:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function uploadRoomPhoto(formData) {
  const file = formData.get('file')
  if (!file) return { success: false, error: "No file provided" }

  const supabase = createServiceRoleClient()
  
  // 1. Ensure bucket exists
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.find(b => b.name === 'room-photos')
  
  if (!bucketExists) {
    const { error: createError } = await supabase.storage.createBucket('room-photos', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg']
    })
    if (createError) {
      console.error('Bucket creation failed:', createError)
      return { success: false, error: "Storage not configured. Please create a bucket named 'room-photos' manually." }
    }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = `rooms/${fileName}`

  const { data, error } = await supabase.storage
    .from('room-photos')
    .upload(filePath, file)

  if (error) {
    console.error('Upload error:', error)
    return { success: false, error: error.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('room-photos')
    .getPublicUrl(filePath)

  return { success: true, url: publicUrl }
}

export async function getRentPayments(status) {
  const ownerId = await getAuthenticatedOwnerId()
  const supabase = createServiceRoleClient()
  
  // First get all tenants for this owner to filter payments
  const { data: tenants } = await supabase
    .from('tenants')
    .select('id')
    .eq('owner_id', ownerId)
    
  const tenantIds = tenants?.map(t => t.id) || []
  if (tenantIds.length === 0) return []

  const { data, error } = await supabase
    .from('rent_payments')
    .select(`
      *,
      tenants(
        id,
        name,
        tenant_assignments(
          status,
          rooms(room_number)
        )
      )
    `)
    .in('tenant_id', tenantIds)
    .eq('status', status)
    .order('due_date', { ascending: status === 'UNPAID' })

  if (error) {
    console.error('Error fetching rent payments:', error)
    return []
  }

  return data.map(p => {
    const activeAssignment = p.tenants?.tenant_assignments?.find(ta => ta.status === 'ACTIVE') || p.tenants?.tenant_assignments?.[0];
    const roomNum = activeAssignment?.rooms?.room_number;

    return {
      id: p.id,
      tenantId: p.tenants?.id,
      name: p.tenants?.name || 'Unknown',
      room: roomNum ? `Room ${roomNum}` : 'Unassigned',
      rent: `₹${Number(p.amount).toLocaleString('en-IN')}`,
      rawRent: p.amount,
      status: p.status,
      date: p.due_date,
      displayDate: p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : p.due_date,
      mode: p.payment_mode
    }
  })
}

// Fast count-only query for the rent menu page.
// Instead of fetching ALL paid + ALL unpaid records with joins (6-8 DB calls),
// this does 1 auth lookup + 1 tenant query + 2 lightweight count queries in parallel.
export async function getRentCounts() {
  const ownerId = await getAuthenticatedOwnerId()
  const supabase = createServiceRoleClient()

  const { data: tenants } = await supabase
    .from('tenants')
    .select('id')
    .eq('owner_id', ownerId)

  const tenantIds = tenants?.map(t => t.id) || []
  if (tenantIds.length === 0) return { paid: 0, unpaid: 0 }

  // Use count queries — these return a number, NOT all rows
  const [paidRes, unpaidRes] = await Promise.all([
    supabase
      .from('rent_payments')
      .select('id', { count: 'exact', head: true })
      .in('tenant_id', tenantIds)
      .eq('status', 'PAID'),
    supabase
      .from('rent_payments')
      .select('id', { count: 'exact', head: true })
      .in('tenant_id', tenantIds)
      .eq('status', 'UNPAID')
  ])

  return {
    paid: paidRes.count || 0,
    unpaid: unpaidRes.count || 0
  }
}

export async function updateRentPayment(paymentId, details) {
  const supabase = createServiceRoleClient()
  
  const { data, error } = await supabase
    .from('rent_payments')
    .update({
      amount: details.amount,
      status: details.status || 'PAID',
      payment_mode: details.paymentMode,
      paid_at: details.paidAt || new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', paymentId)
    .select()
    .single()

  if (error) {
    console.error('Error updating rent payment:', error)
    return { success: false, error: error.message }
  }

  // Also create a record in rent_records if it's being marked as PAID
  if (details.status === 'PAID') {
    await supabase
      .from('rent_records')
      .insert([{
        tenant_id: data.tenant_id,
        amount: details.amount,
        status: 'PAID',
        payment_mode: details.paymentMode,
        paid_at: details.paidAt || new Date().toISOString()
      }])
  }

  return { success: true, data }
}

export async function getRentAnalytics() {
  const ownerId = await getAuthenticatedOwnerId()
  const supabase = createServiceRoleClient()
  
  // 1. Parallel fetch for base data
  const [ownerRes, recordsRes] = await Promise.all([
    supabase.from('owners').select('properties(id)').eq('id', ownerId).single(),
    supabase.from('rent_records')
      .select('amount, paid_at')
      .eq('status', 'PAID')
      .gte('paid_at', new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString())
  ])

  const propertyIds = ownerRes.data?.properties?.map(p => p.id) || []
  const allPaidRecords = recordsRes.data || []

  // 2. Calculate Target
  let target = 0
  if (propertyIds.length > 0) {
    const { data: allRooms } = await supabase
      .from('rooms')
      .select('rent_per_bed, capacity')
      .in('property_id', propertyIds)

    target = allRooms?.reduce((sum, r) => sum + ((Number(r.rent_per_bed) || 0) * (r.capacity || 1)), 0) || 0
  }

  // 3. Process Achieved and Trend in memory
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const achieved = allPaidRecords
    .filter(r => new Date(r.paid_at) >= currentMonthStart)
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0)

  const trend = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = months[d.getMonth()]
    
    const monthTotal = allPaidRecords
      .filter(r => {
        const pDate = new Date(r.paid_at)
        return pDate.getMonth() === d.getMonth() && pDate.getFullYear() === d.getFullYear()
      })
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0)

    trend.push({ label, value: monthTotal, height: 0 })
  }

  const maxVal = Math.max(...trend.map(t => t.value), target, 1)
  trend.forEach(t => t.height = (t.value / maxVal) * 100)

  return { target, achieved, trend }
}

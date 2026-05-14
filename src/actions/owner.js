'use server'

import { cache } from 'react'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { unstable_cache, revalidateTag } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/service'

// Cache the authentication lookup for the duration of a single request.
// This prevents multiple getUser() calls when multiple actions are triggered.
export const getAuthenticatedOwnerId = cache(async function getAuthenticatedOwnerId() {
  const supabase = await createClient()
  
  // 1. Get session (faster than getUser as it doesn't verify with server every time)
  const { data } = await supabase.auth.getSession()
  const user = data.session?.user

  if (user?.id) {
    return user.id
  }

  return null
})

export async function getOwnerInfo() {
  const ownerId = await getAuthenticatedOwnerId()
  
  const fetchOwnerInfo = unstable_cache(
    async (id) => {
      const supabase = await createClient()
      const { data: owner } = await supabase
        .from('owners')
        .select('name, phone, email, properties(id, name)')
        .eq('id', id)
        .single()

      return {
        id,
        name: owner?.name || "Owner",
        phone: owner?.phone || "",
        email: owner?.email || "",
        pg_name: owner?.properties?.[0]?.name || "My PG",
        propertyId: owner?.properties?.[0]?.id
      }
    },
    ['owner-info', ownerId],
    { tags: ['owner', `owner-${ownerId}`], revalidate: 300 }
  )

  return fetchOwnerInfo(ownerId)
}

export async function updateOwnerProfile(data) {
  const supabase = await createClient()
  
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

    revalidateTag('owner')
    revalidateTag('dashboard')

    return { success: true }
  } catch (err) {
    console.error("Update failed:", err)
    return { success: false, error: err.message }
  }
}

export async function getOwnerDashboardData() {
  const ownerId = await getAuthenticatedOwnerId()
  
  const fetchData = unstable_cache(
    async (id) => {
      const supabase = await createClient()
      
      const currentMonthStart = new Date()
      currentMonthStart.setDate(1)
      currentMonthStart.setHours(0,0,0,0)

      // Parallelize lookups with minimal payload
      const [ownerRes, activeTenantsCount, roomsRes, rentRes, incomeRes] = await Promise.all([
        supabase.from('owners').select('name, phone, properties(id, name)').eq('id', id).single(),
        supabase.from('tenants').select('id', { count: 'exact', head: true }).eq('owner_id', id).eq('status', 'ACTIVE'),
        supabase.from('rooms').select('capacity, tenant_assignments(status), properties!inner(owner_id)').eq('properties.owner_id', id),
        supabase.from('rent_payments')
          .select('id, amount, status, due_date, tenants!inner(name, phone, owner_id)')
          .eq('tenants.owner_id', id)
          .order('due_date', { ascending: false })
          .limit(10),
        supabase.from('rent_records')
          .select('amount, eb_charges, tenants!inner(owner_id)')
          .eq('status', 'PAID')
          .gte('paid_at', currentMonthStart.toISOString())
          .eq('tenants.owner_id', id)
      ])

      const owner = ownerRes.data
      const pg_name = owner?.properties?.[0]?.name || "My PG"
      const totalTenants = activeTenantsCount.count || 0

      // Process room and occupancy stats
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

      // Calculate financials
      const monthlyIncome = incomeRes.data?.reduce((sum, record) => sum + (record.amount || 0), 0) || 0
      const totalEB = incomeRes.data?.reduce((sum, record) => sum + (record.eb_charges || 0), 0) || 0
      const pendingRentCount = rentRes.data?.filter(r => r.status === 'UNPAID').length || 0
      
      return {
        owner: {
          name: owner?.name,
          phone: owner?.phone,
          pg_name: pg_name
        },
        stats: {
          totalTenants,
          vacantBeds: totalBeds - occupiedBeds,
          pendingRentCount,
          monthlyIncome: monthlyIncome.toLocaleString('en-IN'),
          ebCollected: totalEB.toLocaleString('en-IN'),
          occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0
        },
        recentRent: rentRes.data || []
      }
    },
    ['owner-dashboard', ownerId],
    { tags: ['dashboard', `dashboard-${ownerId}`], revalidate: 300 } // 5 minute cache
  )

  return fetchData(ownerId)
}

export async function createTenant(tenantData) {
  const ownerId = await getAuthenticatedOwnerId()
  if (!ownerId) return { success: false, error: "Unauthorized" }
  const supabase = await createClient()
  
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
    if (tenantError.code === '23505') {
      return { success: false, error: "This mobile number is already registered" }
    }
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

  revalidateTag('tenants')
  revalidateTag('dashboard')
  revalidateTag('rooms')
  revalidateTag('rent')

  return { success: true, data: tenant }
}

export async function getTenants() {
  const ownerId = await getAuthenticatedOwnerId()
  
  const fetchTenants = unstable_cache(
    async (id) => {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('tenants')
        .select(`
          *,
          tenant_assignments(
            status,
            room_id,
            bed_index,
            rooms(room_number)
          ),
          rent_records(
             amount,
             eb_charges
          )
        `)
        .eq('owner_id', id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching tenants:', error)
        return []
      }

      return data?.map(tenant => {
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
          govId: tenant.id_type || "N/A",
          totalEB: tenant.rent_records?.reduce((sum, r) => sum + (Number(r.eb_charges) || 0), 0) || 0
        }
      }) || []
    },
    ['tenants', ownerId],
    { tags: ['tenants', `tenants-${ownerId}`], revalidate: 60 }
  )

  return fetchTenants(ownerId)
}

export async function updateTenant(tenantId, tenantData) {
  const ownerId = await getAuthenticatedOwnerId()
  if (!ownerId) return { success: false, error: "Unauthorized" }
  const supabase = await createClient()
  
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
    if (tenantError.code === '23505') {
      return { success: false, error: "This mobile number is already registered" }
    }
    return { success: false, error: tenantError.message }
  }

  // 1.5 Update unpaid rent payments if rent amount changed
  if (profileData.rent) {
    await supabase
      .from('rent_payments')
      .update({ amount: profileData.rent })
      .eq('tenant_id', tenantId)
      .eq('status', 'UNPAID')
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

  revalidateTag('tenants')
  revalidateTag('dashboard')
  revalidateTag('rooms')
  revalidateTag('rent')

  return { success: true }
}

export async function removeTenant(tenantId) {
  const ownerId = await getAuthenticatedOwnerId()
  if (!ownerId) return { success: false, error: "Unauthorized" }
  const supabase = await createClient()
  
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

  revalidateTag('tenants')
  revalidateTag('dashboard')
  revalidateTag('rooms')
  revalidateTag('rent')

  return { success: true }
}

export async function createRoom(roomData) {
  const ownerId = await getAuthenticatedOwnerId()
  if (!ownerId) return { success: false, error: "Unauthorized" }
  const supabase = await createClient()
  
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

  revalidateTag('rooms')
  revalidateTag('dashboard')

  return { success: true, data }
}

export async function getRooms() {
  const ownerId = await getAuthenticatedOwnerId()
  
  const fetchRooms = unstable_cache(
    async (id) => {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          properties!inner(owner_id),
          tenant_assignments(id, status, bed_index)
        `)
        .eq('properties.owner_id', id)
        .order('room_number', { ascending: true })

      if (error) {
        console.error('Error fetching rooms:', error)
        return []
      }

      return data?.map(room => {
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
          floor:  room.floor,
          status,
          price: `₹${Number(room.rent_per_bed).toLocaleString('en-IN')}`,
          rawPrice: room.rent_per_bed,
          type: `${room.sharing_type} - ${room.room_type}`,
          sharing_type: room.sharing_type,
          beds: room.capacity,
          available,
          assignments: room.tenant_assignments || [],
          amenities: room.amenities || [],
          image_url: room.image_url,
          desc: room.description || `Spacious ${room.sharing_type} room located in Building ${room.building_number || 'Main'} on the ${room.floor}.`
        }
      }) || []
    },
    ['rooms', ownerId],
    { tags: ['rooms', `rooms-${ownerId}`], revalidate: 60 }
  )

  return fetchRooms(ownerId)
}

export async function removeRoom(roomId) {
  const ownerId = await getAuthenticatedOwnerId()
  if (!ownerId) return { success: false, error: "Unauthorized" }
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId)

  if (error) {
    console.error('Error removing room:', error)
    return { success: false, error: error.message }
  }

  revalidateTag('rooms')
  revalidateTag('dashboard')

  return { success: true }
}

export async function updateRoom(roomId, roomData) {
  const ownerId = await getAuthenticatedOwnerId()
  if (!ownerId) return { success: false, error: "Unauthorized" }
  const supabase = await createClient()
  
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

  revalidateTag('rooms')
  revalidateTag('dashboard')

  return { success: true, data }
}

export async function uploadRoomPhoto(formData) {
  const file = formData.get('file')
  if (!file) return { success: false, error: "No file provided" }

  const supabase = await createClient()
  
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
  
  const fetchPayments = unstable_cache(
    async (id, pStatus) => {
      const supabase = await createClient()
      
      const { data: tenants } = await supabase
        .from('tenants')
        .select('id')
        .eq('owner_id', id)
        
      const tenantIds = tenants?.map(t => t.id) || []
      if (tenantIds.length === 0) return []

      const { data, error } = await supabase
        .from('rent_payments')
        .select(`
          *,
          tenants(
            id,
            name,
            rent,
            tenant_assignments(
              status,
              rooms(room_number)
            )
          )
        `)
        .in('tenant_id', tenantIds)
        .eq('status', pStatus)
        .order('due_date', { ascending: pStatus === 'UNPAID' })

      if (error) {
        console.error('Error fetching rent payments:', error)
        return []
      }

      // Fetch all PAID payments for these tenants to check for already paid EB
      const { data: allPaid } = await supabase
        .from('rent_payments')
        .select('tenant_id, eb_charges, due_date')
        .in('tenant_id', tenantIds)
        .eq('status', 'PAID')

      return data.map(p => {
        const activeAssignment = p.tenants?.tenant_assignments?.find(ta => ta.status === 'ACTIVE') || p.tenants?.tenant_assignments?.[0];
        const roomNum = activeAssignment?.rooms?.room_number;
        
        // Find if this tenant already paid EB for the same month/year as this due_date
        const pDate = new Date(p.due_date);
        const alreadyPaidEB = allPaid
          ?.filter(ap => {
            const apDate = new Date(ap.due_date);
            return ap.tenant_id === p.tenant_id && 
                   apDate.getMonth() === pDate.getMonth() && 
                   apDate.getFullYear() === pDate.getFullYear();
          })
          .reduce((sum, ap) => sum + (Number(ap.eb_charges) || 0), 0) || 0;

        return {
          id: p.id,
          tenantId: p.tenants?.id,
          name: p.tenants?.name || 'Unknown',
          room: roomNum ? `Room ${roomNum}` : 'Unassigned',
          rent: `₹${Number(p.amount).toLocaleString('en-IN')}`,
          rawRent: p.amount,
          status: p.status,
          date: p.due_date,
          paidAt: p.paid_at,
          displayDate: p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : p.due_date,
          mode: p.payment_mode,
          ebCharges: p.eb_charges || 0,
          totalEbPaid: alreadyPaidEB,
          baseRent: p.tenants?.rent || 0
        }
      })
    },
    ['rent-payments', ownerId, status],
    { tags: ['rent', `rent-${ownerId}`], revalidate: 60 }
  )

  return fetchPayments(ownerId, status)
}

// Fast count-only query for the rent menu page.
// Instead of fetching ALL paid + ALL unpaid records with joins (6-8 DB calls),
// this does 1 auth lookup + 1 tenant query + 2 lightweight count queries in parallel.
export async function getRentCounts() {
  const ownerId = await getAuthenticatedOwnerId()
  
  const fetchCounts = unstable_cache(
    async (id) => {
      const supabase = await createClient()

      const { data: tenants } = await supabase
        .from('tenants')
        .select('id')
        .eq('owner_id', id)

      const tenantIds = tenants?.map(t => t.id) || []
      if (tenantIds.length === 0) return { paid: 0, unpaid: 0 }

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
    },
    ['rent-counts', ownerId],
    { tags: ['rent', `rent-${ownerId}`], revalidate: 60 }
  )

  return fetchCounts(ownerId)
}

export async function updateRentPayment(paymentId, details) {
  const ownerId = await getAuthenticatedOwnerId()
  if (!ownerId) return { success: false, error: "Unauthorized" }
  const supabase = await createClient()
  
  // 1. Fetch existing payment to check for partial payment
  const { data: existing, error: fetchError } = await supabase
    .from('rent_payments')
    .select('*')
    .eq('id', paymentId)
    .single()

  if (fetchError) {
    console.error('Error fetching rent payment:', fetchError)
    return { success: false, error: fetchError.message }
  }

  // Handle Partial Payment: If paying less than owed and marking as PAID
  if (details.status === 'PAID' && existing.status === 'UNPAID' && details.amount < existing.amount) {
    const remainingBalance = existing.amount - details.amount;
    
    // Create new UNPAID record for the balance
    const { error: splitError } = await supabase
      .from('rent_payments')
      .insert([{
        tenant_id: existing.tenant_id,
        amount: remainingBalance,
        status: 'UNPAID',
        due_date: existing.due_date,
        created_at: new Date().toISOString()
      }])

    if (splitError) {
      console.error('Error creating partial payment balance:', splitError)
      return { success: false, error: "Failed to create balance record for partial payment." }
    }
  }

  // 2. Update the current record
  const { data, error } = await supabase
    .from('rent_payments')
    .update({
      amount: details.amount,
      eb_charges: details.ebCharges || 0,
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

    // Also create or update a record in rent_records if it's being marked as PAID
  if (details.status === 'PAID') {
    if (existing.status === 'PAID') {
      await supabase
        .from('rent_records')
        .update({
          amount: details.amount,
          eb_charges: details.ebCharges || 0,
          payment_mode: details.paymentMode,
          paid_at: details.paidAt || existing.paid_at
        })
        .eq('tenant_id', existing.tenant_id)
        .eq('paid_at', existing.paid_at)
    } else {
      await supabase
        .from('rent_records')
        .insert([{
          tenant_id: data.tenant_id,
          amount: details.amount,
          eb_charges: details.ebCharges || 0,
          status: 'PAID',
          payment_mode: details.paymentMode,
          paid_at: details.paidAt || new Date().toISOString()
        }])
    }
  }

  revalidateTag('rent')
  revalidateTag('dashboard')

  return { success: true, data }
}

export async function getRentAnalytics() {
  const ownerId = await getAuthenticatedOwnerId()
  
  const fetchAnalytics = unstable_cache(
    async (id) => {
      const supabase = await createClient()
      const now = new Date()
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      
      // Parallelize ALL data fetching
      const [ownerRes, recordsRes, roomsRes] = await Promise.all([
        supabase.from('owners').select('name, properties(id, name)').eq('id', id).single(),
        supabase.from('rent_records')
          .select('amount, eb_charges, paid_at, tenants!inner(owner_id)')
          .eq('tenants.owner_id', id)
          .eq('status', 'PAID')
          .gte('paid_at', sixMonthsAgo.toISOString()),
        supabase.from('rooms')
          .select('rent_per_bed, capacity, properties!inner(owner_id)')
          .eq('properties.owner_id', id)
      ])

      const allPaidRecords = recordsRes.data || []
      const allRooms = roomsRes.data || []

      // Calculate Target (Total potential rent)
      const target = allRooms.reduce((sum, r) => 
        sum + ((Number(r.rent_per_bed) || 0) * (Number(r.capacity) || 1)), 0) || 0

      // Calculate Current Month Achieved
      const achieved = allPaidRecords
        .filter(r => new Date(r.paid_at) >= currentMonthStart)
        .reduce((sum, r) => sum + (Number(r.amount) || 0), 0)

      const ebAchieved = allPaidRecords
        .filter(r => new Date(r.paid_at) >= currentMonthStart)
        .reduce((sum, r) => sum + (Number(r.eb_charges) || 0), 0)

      // Calculate Trend (Last 4 months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const trend = []
      
      for (let i = 3; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const label = months[d.getMonth()]
        const monthRent = allPaidRecords
          .filter(r => {
            const pDate = new Date(r.paid_at)
            return pDate.getMonth() === d.getMonth() && pDate.getFullYear() === d.getFullYear()
          })
          .reduce((sum, r) => sum + (Number(r.amount) || 0), 0)

        trend.push({ label, value: monthRent, rent: monthRent, height: 0 })
      }

      // Calculate relative heights for bar chart
      const maxVal = Math.max(...trend.map(t => t.value), target, 1)
      trend.forEach(t => t.height = (t.value / maxVal) * 100)

      return { target, achieved, ebAchieved, trend }
    },
    ['rent-analytics', ownerId],
    { tags: ['rent', 'dashboard', `rent-${ownerId}`], revalidate: 300 } // 5 minute cache
  )

  return fetchAnalytics(ownerId)
}

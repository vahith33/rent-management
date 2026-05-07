'use server'

import { createServiceRoleClient } from '../lib/supabase/service'
import { cookies } from 'next/headers'

async function getAuthenticatedOwnerId() {
  const cookieStore = await cookies()
  const phone = cookieStore.get('mock_session_phone')?.value
  
  if (!phone) {
    console.warn('No phone found in cookies, using fallback for dev')
    return 'e3bdf815-ffc0-4a7c-aa35-fa9647fa7d4e' 
  }

  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('owners')
    .select('id')
    .eq('phone', phone)
    .single()
    
  if (error || !data) {
    console.warn('Owner lookup failed for phone:', phone, 'using fallback')
    return 'e3bdf815-ffc0-4a7c-aa35-fa9647fa7d4e'
  }
  return data.id
}

export async function getOwnerInfo() {
  const ownerId = await getAuthenticatedOwnerId()
  if (!ownerId) return null
  const supabase = createServiceRoleClient()
  const { data: owner } = await supabase
    .from('owners')
    .select('name, phone, properties(name)')
    .eq('id', ownerId)
    .single()
  return {
    name: owner?.name || "Owner",
    phone: owner?.phone || "",
    pg_name: owner?.properties?.[0]?.name || "My PG"
  }
}

export async function getOwnerDashboardData() {
  const ownerId = await getAuthenticatedOwnerId()
  if (!ownerId) return null

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
      occupiedBeds += room.tenant_assignments?.filter(ta => ta.status === 'active').length || 0
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
  if (!ownerId) return { success: false, error: "Unauthorized" }

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
        status: 'ACTIVE',
        assigned_at: new Date().toISOString()
      }])

    if (assignmentError) {
      console.error('Error creating assignment:', assignmentError)
      // We don't fail the whole thing, but maybe log it
    }
  }

  return { success: true, data: tenant }
}

export async function getTenants() {
  const ownerId = await getAuthenticatedOwnerId()
  if (!ownerId) return []

  const supabase = createServiceRoleClient()
  
  const { data, error } = await supabase
    .from('tenants')
    .select('*, rooms(room_number)')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tenants:', error)
    return []
  }

  // Flatten and normalize data for the UI
  const formattedData = data?.map(tenant => ({
    ...tenant,
    room: tenant.rooms?.room_number || "Unassigned",
    initials: tenant.name?.substring(0, 1).toUpperCase() || "?",
    rent: tenant.rent ? `₹${Number(tenant.rent).toLocaleString('en-IN')}` : "₹0",
    deposit: tenant.deposit ? `₹${Number(tenant.deposit).toLocaleString('en-IN')}` : "₹0",
    moveIn: tenant.move_in_date ? new Date(tenant.move_in_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A",
    period: tenant.agreement_period || "N/A",
    govId: tenant.id_type || "N/A"
  }))

  return formattedData || []
}

export async function removeTenant(tenantId) {
  const ownerId = await getAuthenticatedOwnerId()
  if (!ownerId) return { success: false, error: "Unauthorized" }

  const supabase = createServiceRoleClient()
  
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
  if (!ownerId) return { success: false, error: "Unauthorized" }

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
      status: 'available'
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
  if (!ownerId) return []

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
    .select('*, tenant_assignments(id, status)')
    .eq('property_id', propertyId)
    .order('room_number', { ascending: true })

  if (error) {
    console.error('Error fetching rooms:', error)
    return []
  }

  // 3. Format data for UI
  const formattedRooms = data.map(room => {
    const activeTenants = room.tenant_assignments?.filter(ta => ta.status === 'ACTIVE').length || 0
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
      type: `${room.sharing_type} - ${room.room_type}`,
      beds: room.capacity,
      available,
      amenities: room.amenities || [],
      desc: room.description || `Spacious ${room.sharing_type} room located in Building ${room.building_number || 'Main'} on the ${room.floor}.`
    }
  })

  return formattedRooms
}

export async function removeRoom(roomId) {
  const ownerId = await getAuthenticatedOwnerId()
  if (!ownerId) return { success: false, error: "Unauthorized" }

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

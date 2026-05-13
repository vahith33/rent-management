'use server'

import { createServiceRoleClient } from '../lib/supabase/service'
import { revalidatePath } from 'next/cache'

export async function getAllPGs() {
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('owners')
    .select(`
      id, name, email, phone, status, plan_rupee, admin_notes, created_at,
      properties ( name, address ),
      tenants ( id, status )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching PGs:', error)
    return []
  }

  // Transform data to match requested format
  const formattedData = data.map((owner) => {
    const property = owner.properties && owner.properties.length > 0 ? owner.properties[0] : owner.properties || {}
    const activeTenants = owner.tenants ? owner.tenants.filter((t) => t.status === 'ACTIVE').length : 0

    return {
      id: owner.id,
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      status: owner.status,
      plan_rupee: owner.plan_rupee,
      admin_notes: owner.admin_notes,
      created_at: owner.created_at,
      property_name: property?.name || '',
      address: property?.address || '',
      tenant_count: activeTenants
    }
  })

  return formattedData
}

export async function addPG(formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const phone = formData.get('phone')
  const property_name = formData.get('property_name')
  const address = formData.get('address')
  const plan_rupee_str = formData.get('plan_rupee')
  const admin_notes = formData.get('admin_notes')

  if (!name || name.trim() === '') return { error: 'validation', fields: { name: 'Name is required' } }
  if (!email || !email.includes('@')) return { error: 'validation', fields: { email: 'Enter a valid email' } }
  if (!phone || !/^\d{10}$/.test(phone)) return { error: 'validation', fields: { phone: 'Enter a valid 10-digit mobile number' } }
  if (!property_name || property_name.trim() === '') return { error: 'validation', fields: { property_name: 'Property name is required' } }
  
  let plan_rupee = null
  if (plan_rupee_str) {
    plan_rupee = parseFloat(plan_rupee_str)
    if (isNaN(plan_rupee) || plan_rupee < 0) return { error: 'validation', fields: { plan_rupee: 'Must be a positive number' } }
  }

  const supabase = createServiceRoleClient()

  // a. Check if email already exists
  const { data: existingEmail } = await supabase.from('owners').select('id').eq('email', email).single()
  if (existingEmail) return { error: 'email_exists', message: 'This email is already registered.' }

  // b. Create Supabase Auth user (Email based since we use Email OTP)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    email_confirm: true,
    user_metadata: { name, phone }
  })
  if (authError) return { error: 'auth_failed', message: authError.message }

  const userId = authData.user.id

  // c. Insert into owners
  const { data: newOwner, error: ownerError } = await supabase.from('owners').insert({
    id: userId,
    supabase_user_id: userId,
    name,
    email,
    phone,
    plan_rupee,
    admin_notes,
    status: 'active'
  }).select().single()

  if (ownerError) {
     // Rollback auth user
     await supabase.auth.admin.deleteUser(userId)
     return { error: 'db_error', message: ownerError.message }
  }

  // d. Insert into properties
  const { error: propError } = await supabase.from('properties').insert({
    owner_id: newOwner.id,
    name: property_name,
    address: address || null
  })

  if (propError) {
    return { error: 'db_error', message: propError.message }
  }

  return { success: true, owner: newOwner }
}

export async function togglePGStatus(ownerId, currentStatus) {
  const supabase = createServiceRoleClient()
  
  // Get supabase_user_id
  const { data: owner } = await supabase.from('owners').select('supabase_user_id').eq('id', ownerId).single()
  if (!owner || !owner.supabase_user_id) return { error: 'not_found' }

  if (currentStatus === 'active') {
    await supabase.from('owners').update({ status: 'disabled' }).eq('id', ownerId)
    await supabase.auth.admin.updateUserById(owner.supabase_user_id, { ban_duration: '87600h' })
    // Force sign out from all sessions immediately
    await supabase.auth.admin.signOut(owner.supabase_user_id)
  } else {
    await supabase.from('owners').update({ status: 'active' }).eq('id', ownerId)
    await supabase.auth.admin.updateUserById(owner.supabase_user_id, { ban_duration: 'none' })
  }

  revalidatePath('/admin/dashboard')
  revalidatePath(`/admin/pg/${ownerId}`)
  
  return { success: true }
}

export async function deletePG(ownerId) {
  const supabase = createServiceRoleClient()
  
  // a. Get supabase_user_id
  const { data: owner } = await supabase.from('owners').select('supabase_user_id').eq('id', ownerId).single()
  if (!owner) return { error: 'not_found' }

  // b. Delete from owners
  await supabase.from('owners').delete().eq('id', ownerId)

  // c. Delete auth user
  if (owner.supabase_user_id) {
    await supabase.auth.admin.deleteUser(owner.supabase_user_id)
  }

  return { success: true }
}

export async function updatePG(ownerId, formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const property_name = formData.get('property_name')
  const address = formData.get('address')
  const plan_rupee_str = formData.get('plan_rupee')
  const admin_notes = formData.get('admin_notes')

  let plan_rupee = null
  if (plan_rupee_str) {
    plan_rupee = parseFloat(plan_rupee_str)
  }

  const supabase = createServiceRoleClient()
  
  // 1. Get current owner to find supabase_user_id
  const { data: owner } = await supabase.from('owners').select('supabase_user_id, email').eq('id', ownerId).single()
  
  // 2. Update Auth Email if changed
  if (email && email !== owner.email && owner.supabase_user_id) {
    const { error: authError } = await supabase.auth.admin.updateUserById(owner.supabase_user_id, {
      email: email
    })
    if (authError) return { error: authError.message }
  }

  // 3. Update Database
  await supabase.from('owners').update({
    name,
    email,
    plan_rupee,
    admin_notes
  }).eq('id', ownerId)

  await supabase.from('properties').update({
    name: property_name,
    address
  }).eq('owner_id', ownerId)

  return { success: true }
}

export async function getPGById(ownerId) {
  const supabase = createServiceRoleClient()

  const { data: owner, error } = await supabase
    .from('owners')
    .select(`
      id, name, email, phone, status, plan_rupee, admin_notes, created_at,
      properties ( name, address ),
      tenants ( id, status )
    `)
    .eq('id', ownerId)
    .single()

  if (error || !owner) {
    console.error('Error fetching PG:', error)
    return null
  }

  const property = owner.properties && owner.properties.length > 0 ? owner.properties[0] : owner.properties || {}
  const activeTenants = owner.tenants ? owner.tenants.filter((t) => t.status === 'ACTIVE').length : 0

  return {
    id: owner.id,
    name: owner.name,
    email: owner.email,
    phone: owner.phone,
    status: owner.status,
    plan_rupee: owner.plan_rupee,
    admin_notes: owner.admin_notes,
    created_at: owner.created_at,
    property_name: property?.name || '',
    address: property?.address || '',
    tenant_count: activeTenants
  }
}

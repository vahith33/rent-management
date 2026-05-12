'use server'

import { createServiceRoleClient } from '@/lib/supabase/service'

export async function checkUserRegistration(email) {
  // Use Service Role to bypass RLS for the registration check
  const supabase = createServiceRoleClient()

  // 1. Check if it's the Admin
  if (email === process.env.ADMIN_EMAIL) {
    return { registered: true, role: 'admin' }
  }

  // 2. Check the Owners table
  const { data: owner } = await supabase
    .from('owners')
    .select('id')
    .eq('email', email)
    .single()

  if (owner) return { registered: true, role: 'owner' }

  // 3. Check the Tenants table
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('email', email)
    .single()

  if (tenant) return { registered: true, role: 'tenant' }

  // Not found anywhere
  return { registered: false }
}

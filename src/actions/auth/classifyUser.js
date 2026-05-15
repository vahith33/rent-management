'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'
import { createServiceRoleClient } from '../../lib/supabase/service'

export async function classifyUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return '/login'
  }

  const email = user.email
  
  // 1. Check Admin
  if (email === process.env.ADMIN_EMAIL) {
    return '/admin/dashboard'
  }

  // Use Service Role for these checks to ensure we can identify the user
  // even if RLS policies on these tables are restrictive for the initial lookup.
  const serviceSupabase = createServiceRoleClient()

  // 2. Check Owners table
  const { data: owner } = await serviceSupabase
    .from('owners')
    .select('id')
    .eq('email', email)
    .single()
    
  if (owner) {
    return '/dashboard'
  }

  // 3. Check Tenants table
  const { data: tenant } = await serviceSupabase
    .from('tenants')
    .select('id')
    .eq('email', email)
    .single()

  if (tenant) {
    return '/welcome-tenant'
  }

  // 4. Fallback for new users or unrecognized emails
  return '/dashboard'
}

'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

export async function classifyUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const email = user.email
  
  // 1. Check Admin
  if (email === process.env.ADMIN_EMAIL) {
    redirect('/admin/dashboard')
  }

  // 2. Check Owners table
  const { data: owner } = await supabase
    .from('owners')
    .select('id')
    .eq('email', email)
    .single()
    
  if (owner) {
    redirect('/dashboard')
  }

  // 3. Check Tenants table
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('email', email)
    .single()

  if (tenant) {
    redirect('/welcome-tenant')
  }

  // 4. Fallback for new users or unrecognized emails
  redirect('/dashboard')
}

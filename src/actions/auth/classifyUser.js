'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

export async function classifyUser() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const phone = session.user.phone
  let digits = phone
  if (phone && phone.startsWith('+91')) {
    digits = phone.slice(3)
  } else if (phone && phone.startsWith('91')) {
     digits = phone.slice(2)
  }

  // Admin redirect
  if (digits === process.env.ADMIN_PHONE) {
    redirect('/admin/dashboard')
  }

  // Basic fallback if not admin
  redirect('/welcome-owner')
}

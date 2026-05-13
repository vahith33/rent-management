import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const email = user.email
  const adminEmail = process.env.ADMIN_EMAIL

  if (email !== adminEmail) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {children}
    </div>
  )
}

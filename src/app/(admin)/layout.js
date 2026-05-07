import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  // Get mock cookie if it exists
  const cookieStore = await cookies()
  const mockPhone = cookieStore.get('mock_session_phone')?.value

  if (!session && !mockPhone) {
    redirect('/login')
  }

  const phone = session?.user?.phone || mockPhone
  let digits = phone ? String(phone).trim() : ''
  if (digits.startsWith('+91')) {
    digits = digits.slice(3)
  } else if (digits.startsWith('91')) {
     digits = digits.slice(2)
  }

  const adminPhone = process.env.ADMIN_PHONE ? String(process.env.ADMIN_PHONE).trim() : ''

  if (digits !== adminPhone) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {children}
    </div>
  )
}

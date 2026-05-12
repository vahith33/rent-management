import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  // Get mock cookie if it exists
  const cookieStore = await cookies()
  const mockEmail = cookieStore.get('mock_session_email')?.value

  if (!session && !mockEmail) {
    redirect('/login')
  }

  const email = session?.user?.email || mockEmail
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

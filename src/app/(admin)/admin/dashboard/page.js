import { getAllPGs } from '@/actions/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const cookieStore = await cookies()
  const mockEmail = cookieStore.get('mock_session_email')?.value

  if (!session && !mockEmail) {
    redirect('/login')
  }

  const pgs = await getAllPGs()

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-body">
      <AdminDashboardClient initialData={pgs} adminEmail={process.env.ADMIN_EMAIL || ''} />
    </div>
  )
}

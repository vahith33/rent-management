import { getPGById } from '@/actions/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import ManagePGClient from '@/components/admin/ManagePGClient'

export default async function ManagePGPage({ params }) {
  const { id } = await params
  
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  const cookieStore = await cookies()
  const mockPhone = cookieStore.get('mock_session_phone')?.value

  if (!session && !mockPhone) {
    redirect('/login')
  }

  const pg = await getPGById(id)
  if (!pg) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-body">
      <ManagePGClient pg={pg} />
    </div>
  )
}

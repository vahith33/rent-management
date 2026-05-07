import { getOwnerDashboardData } from '@/actions/owner'
import OwnerDashboardClient from '@/components/owner/OwnerDashboardClient'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const data = await getOwnerDashboardData()

  if (!data) {
    redirect('/login')
  }

  return <OwnerDashboardClient initialData={data} />
}

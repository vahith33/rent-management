'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import ViewAllPGs from './ViewAllPGs'
import AddNewPG from './AddNewPG'
import DeletePG from './DeletePG'
import { toast } from 'react-hot-toast'

export default function AdminDashboardClient({ initialData, adminEmail }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const currentTab = searchParams.get('tab') || 'view'

  const handleTabChange = (tab) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', tab)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleLogout = async () => {
    try {
        const { createClient } = await import('@/utils/supabase/client')
        const supabase = createClient()
        await supabase.auth.signOut()
        toast.success("Logged out successfully")
        router.push('/login')
        router.refresh()
    } catch(e) {
        console.error(e)
        toast.error("Failed to logout. Please try again.")
        router.push('/login')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10 sticky top-0">
        <div className="font-black text-[#1A2B28] text-xl">Pg Manager Admin</div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-[#718096]">{adminEmail}</span>
          <button 
            onClick={handleLogout}
            className="text-sm font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-full transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#1A2B28]">Admin Dashboard</h1>
        </div>

        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => handleTabChange('view')}
            className={`pb-4 px-4 text-sm font-bold transition-all border-b-2 ${currentTab === 'view' ? 'border-[#00685F] text-[#00685F]' : 'border-transparent text-[#718096] hover:text-[#1A2B28]'}`}
          >
            View All PGs
          </button>
          <button 
            onClick={() => handleTabChange('add')}
            className={`pb-4 px-4 text-sm font-bold transition-all border-b-2 ${currentTab === 'add' ? 'border-[#00685F] text-[#00685F]' : 'border-transparent text-[#718096] hover:text-[#1A2B28]'}`}
          >
            Add New PG
          </button>
          <button 
            onClick={() => handleTabChange('delete')}
            className={`pb-4 px-4 text-sm font-bold transition-all border-b-2 ${currentTab === 'delete' ? 'border-red-600 text-red-600' : 'border-transparent text-[#718096] hover:text-red-600'}`}
          >
            Delete PG
          </button>
        </div>

        <div className="animate-in fade-in duration-300">
          {currentTab === 'view' && <ViewAllPGs initialData={initialData} />}
          {currentTab === 'add' && <AddNewPG />}
          {currentTab === 'delete' && <DeletePG initialData={initialData} />}
        </div>
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import BottomNav from "@/components/BottomNav"

export default function OwnerLayoutClient({ children, ownerInfo }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Dynamic Title Logic
  const getPageTitle = () => {
    const view = searchParams.get('view');

    if (pathname === '/dashboard') return ownerInfo.pg_name;
    if (pathname === '/settings') return 'Settings';
    if (pathname === '/support') return 'Help & Support';
    
    // Tenants Sub-pages
    if (pathname === '/tenants/add') return 'Add New Resident';
    if (pathname === '/tenants/remove') return 'Remove Resident';
    if (pathname.includes('/tenants')) {
      if (view === 'detail') return 'Resident Profile';
      if (view === 'list') return 'Resident List';
      return 'Tenant Directory';
    }
    
    // Rooms Sub-pages
    if (pathname === '/rooms/add') return 'Add New Room';
    if (pathname === '/rooms/remove') return 'Remove Room';
    if (pathname.includes('/rooms')) {
      if (view === 'detail') return 'Room Details';
      if (view === 'list') return 'Room List';
      return 'Property & Rooms';
    }
    
    if (pathname.includes('/rent')) return 'Financial Console';
    if (pathname.includes('/notices')) return 'Broadcast Notice';
    if (pathname.includes('/notifications')) return 'Notifications';
    
    return ownerInfo.pg_name;
  };

  const isDashboard = pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24 font-sans">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-100 flex animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative bg-white w-[300px] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 ease-out">
             
             {/* Profile Header */}
             <div className="p-8 pt-10 flex items-center gap-4">
                <div className="relative">
                   <div className="w-14 h-14 bg-[#008075] rounded-[18px] flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-teal-900/20">
                      {ownerInfo.name.substring(0, 2).toUpperCase()}
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <div className="bg-[#00D1FF] w-4 h-4 rounded-full flex items-center justify-center">
                         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                   </div>
                </div>
                <div className="flex flex-col">
                   <h2 className="text-[19px] font-bold text-[#00685F] leading-tight">{ownerInfo.pg_name}</h2>
                   <p className="text-[12px] font-bold text-[#718096] mt-0.5">Admin Account</p>
                </div>
             </div>

             {/* Menu Items */}
             <div className="flex-1 px-4 space-y-2 mt-6">
                <button 
                  onClick={() => { router.push('/settings'); setIsSidebarOpen(false); }}
                  className="w-full flex items-center gap-5 px-5 py-4 rounded-[20px] text-[#4A5568] hover:bg-[#F7FAFC] hover:text-[#008075] transition-all group"
                >
                  <div className="text-[#008075] bg-[#E6F4F3] p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  </div>
                  <span className="text-[15px] font-bold">Profile Settings</span>
                </button>

                <button 
                  onClick={() => { router.push('/support'); setIsSidebarOpen(false); }}
                  className="w-full flex items-center gap-5 px-5 py-4 rounded-[20px] text-[#4A5568] hover:bg-[#F7FAFC] hover:text-[#008075] transition-all group"
                >
                  <div className="bg-[#EDF2F7] p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <span className="text-[15px] font-bold">Help & Support</span>
                </button>
             </div>

             {/* Footer */}
             <div className="p-8 border-t border-slate-50">
                <button 
                  onClick={() => router.push('/login')}
                  className="flex items-center gap-4 text-red-500 font-bold text-[16px] hover:translate-x-1 transition-transform"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Logout
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {isDashboard ? (
            <div 
              onClick={() => setIsSidebarOpen(true)}
              className="w-9 h-9 bg-[#00685F] rounded-full flex items-center justify-center text-white text-[12px] font-bold shadow-md cursor-pointer border-2 border-white"
            >
              {ownerInfo.name.substring(0, 2).toUpperCase()}
            </div>
          ) : (
            <button onClick={() => router.back()} className="p-1 text-[#00685F]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
          )}
          <h1 className={`${isDashboard ? 'text-[16px]' : 'text-[20px]'} font-bold text-[#1A2B28]`}>{getPageTitle()}</h1>
        </div>
        
        {isDashboard && (
          <div 
            onClick={() => router.push('/notifications')}
            className="relative cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A2B28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
          </div>
        )}
      </header>

      <main>
        {children}
      </main>

      <BottomNav />
    </div>
  )
}

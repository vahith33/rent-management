'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsClient({ initialData }) {
  const router = useRouter()
  const [name, setName] = useState(initialData.name || "")
  const [phone, setPhone] = useState(initialData.phone || "")
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="min-h-screen font-sans pb-32">
      <main className="px-6 pt-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Profile Avatar */}
        <div className="relative mb-4">
           <div className="w-32 h-32 bg-[#00685F] rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl">
              {name.substring(0, 2).toUpperCase()}
           </div>
           <button className="absolute bottom-1 right-1 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
           </button>
        </div>
        <button className="text-[14px] font-bold text-[#00685F] mb-12">Change Photo</button>

        {/* Profile Details Form */}
        <div className="w-full space-y-10">
           <div className="space-y-6">
              <h3 className="text-[18px] font-bold text-[#1A2B28]">Profile Details</h3>
              
              {/* Full Name */}
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-[#4A5568] uppercase tracking-wider ml-1">Full Name</label>
                 <div className="relative">
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#F0F4FF] rounded-[18px] py-5 px-6 text-[15px] font-bold text-[#1A2B28] outline-none focus:ring-2 focus:ring-[#00685F]/20 transition-all"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                 </div>
              </div>



              {/* Mobile */}
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-[#4A5568] uppercase tracking-wider ml-1">Mobile Number</label>
                 <div className="bg-[#F0F4FF] rounded-[18px] py-5 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="text-[#008075]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                       </div>
                       <span className="text-[15px] font-bold text-[#1A2B28]">+91 {phone}</span>
                    </div>
                    <button 
                      onClick={() => router.push('/settings/change-mobile')}
                      className="text-[14px] font-black text-[#00685F]"
                    >
                      Change
                    </button>
                 </div>
              </div>
           </div>

           <div className="h-px bg-slate-100 w-full"></div>

           {/* Notifications Toggle */}
           <div className="flex items-center justify-between bg-white/50 p-1">
              <div className="flex items-center gap-5">
                 <div className="w-12 h-12 bg-[#E6F4F3] rounded-2xl flex items-center justify-center text-[#008075]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                 </div>
                 <div>
                    <h4 className="text-[15px] font-bold text-[#1A2B28]">Push Notifications</h4>
                    <p className="text-[12px] font-medium text-[#718096]">Rental alerts and updates</p>
                 </div>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-8 rounded-full transition-all relative ${notifications ? 'bg-[#00685F]' : 'bg-slate-200'}`}
              >
                 <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${notifications ? 'right-1' : 'left-1'}`}></div>
              </button>
           </div>

           {/* Save Button */}
           <button 
             onClick={() => router.back()}
             className="w-full bg-[#00685F] py-5 rounded-[20px] text-white font-bold text-[17px] shadow-xl shadow-teal-900/20 active:scale-[0.98] transition-all mt-8"
           >
              Save Changes
           </button>
        </div>
      </main>
    </div>
  )
}

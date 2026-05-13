'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateOwnerProfile } from '@/actions/owner'

export default function SettingsClient({ initialData }) {
  const router = useRouter()
  const [name, setName] = useState(initialData.name || "")
  const [phone, setPhone] = useState(initialData.phone || "")
  const [email, setEmail] = useState(initialData.email || "")
  const [pgName, setPgName] = useState(initialData.pg_name || "")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)
    
    const result = await updateOwnerProfile({
      name,
      phone,
      pg_name: pgName,
      propertyId: initialData.propertyId
    })

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      router.refresh()
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
    }
    setIsSaving(false)
  }

  return (
    <div className="min-h-screen font-sans pb-32 bg-white">
      <main className="px-6 pt-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Profile Avatar */}
        <div className="relative mb-4">
           <div className="w-32 h-32 bg-[#00685F] rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl overflow-hidden">
              {name ? name.substring(0, 2).toUpperCase() : 'OW'}
           </div>
           <button className="absolute bottom-1 right-1 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 active:scale-90 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
           </button>
        </div>
        <button className="text-[14px] font-bold text-[#00685F] mb-12">Change Profile Picture</button>

        {message && (
          <div className={`w-full mb-6 p-4 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-600'}`}>
            {message.text}
          </div>
        )}

        {/* Profile Details Form */}
        <div className="w-full space-y-8">
           <div className="space-y-6">
              <h3 className="text-[18px] font-bold text-[#1A2B28]">Personal Information</h3>
              
              {/* Full Name */}
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-[#718096] uppercase tracking-wider ml-1">Full Name</label>
                 <div className="relative">
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#F8FAFB] rounded-[20px] py-5 px-6 text-[15px] font-bold text-[#1A2B28] outline-none focus:ring-2 focus:ring-[#00685F]/10 border border-transparent focus:border-[#00685F]/20 transition-all"
                      placeholder="Your Name"
                    />
                 </div>
              </div>

              {/* Property Name */}
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-[#718096] uppercase tracking-wider ml-1">Property / PG Name</label>
                 <div className="relative">
                    <input 
                      type="text" 
                      value={pgName}
                      onChange={(e) => setPgName(e.target.value)}
                      className="w-full bg-[#F8FAFB] rounded-[20px] py-5 px-6 text-[15px] font-bold text-[#1A2B28] outline-none focus:ring-2 focus:ring-[#00685F]/10 border border-transparent focus:border-[#00685F]/20 transition-all"
                      placeholder="e.g. Pg Manager"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#008075]">
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg>
                    </div>
                 </div>
              </div>

              {/* Email - Requires OTP for Change */}
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-[#718096] uppercase tracking-wider ml-1">Email Address</label>
                 <div className="bg-[#F8FAFB] rounded-[20px] py-5 px-6 flex items-center justify-between border border-transparent">
                    <div className="flex items-center gap-4 overflow-hidden">
                       <div className="text-[#008075] shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                       </div>
                       <span className="text-[15px] font-bold text-[#1A2B28] truncate">{email}</span>
                    </div>
                    <button 
                      onClick={() => router.push('/settings/change-email')}
                      className="text-[14px] font-black text-[#00685F] shrink-0 ml-4 active:scale-95"
                    >
                      Change
                    </button>
                 </div>
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-[#718096] uppercase tracking-wider ml-1">Mobile Number</label>
                 <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1A2B28] font-bold text-[15px]">
                       +91
                    </div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#F8FAFB] rounded-[20px] py-5 pl-16 pr-6 text-[15px] font-bold text-[#1A2B28] outline-none focus:ring-2 focus:ring-[#00685F]/10 border border-transparent focus:border-[#00685F]/20 transition-all"
                      placeholder="Mobile Number"
                    />
                 </div>
              </div>
           </div>

           {/* Save Button */}
           <div className="pt-8">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-[#00685F] py-5 rounded-[24px] text-white font-black text-[17px] shadow-xl shadow-teal-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isSaving ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : "Save Profile Details"}
              </button>
           </div>
        </div>
      </main>
    </div>
  )
}

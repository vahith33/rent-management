"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddTenantPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/tenants');
      }, 1500);
    }, 1200);
  };

  return (
    <div className={`min-h-screen bg-white pb-40 transition-all duration-500 ${showSuccess ? 'blur-md scale-[0.98]' : ''}`}>
      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-6 text-center">
          <div className="bg-white rounded-[40px] p-10 flex flex-col items-center gap-6 shadow-2xl border border-[#006E65]/5 animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-[#EBFBF8] rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[#006E65]/5 rounded-full animate-ping"></div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#006E65" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><polyline points="20 6 9 17 4 12"/></svg>
             </div>
             <div>
                <h3 className="text-2xl font-black text-[#1A2B28]">Tenant Added!</h3>
                <p className="text-sm font-medium text-[#718096] mt-2">New resident successfully onboarded.</p>
             </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-6 sticky top-0 bg-white z-50">
        <button onClick={() => router.back()} className="text-[#00685F] active:scale-90 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className="text-xl font-black text-[#1A2B28]">Add New Tenant</h1>
      </header>

      <main className="px-4 space-y-4">
        {/* PERSONAL DETAILS SECTION */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 space-y-5 border border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Personal Details</h2>
          </div>
          
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-[#718096] uppercase tracking-widest ml-1 opacity-70 font-body">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Alexander Mitchell"
              className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] placeholder-[#ADB5BD] outline-none"
            />
          </div>

          <div className="flex gap-4">
             <div className="flex-1 space-y-2">
                <label className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-1 opacity-70">Phone</label>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none" 
                />
             </div>
             <div className="flex-1 space-y-2">
                <label className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-1 opacity-70">Gender</label>
                <div className="relative">
                  <select className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none font-medium appearance-none text-[14px] font-body">
                      <option>Select</option>
                      <option>Male</option>
                      <option>Female</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#718096]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* ROOM ASSIGNMENT SECTION */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 space-y-5 border border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Room Assignment</h2>
          </div>
          
          <div className="pt-2">
             <button 
               onClick={() => router.push('/tenants/add/select-room')}
               className="w-full bg-white p-5 rounded-[26px] flex items-center justify-between border-2 border-[#EBFBF8] hover:border-[#00685F]/30 transition-all group active:scale-[0.98]"
             >
                <div className="flex items-center gap-5">
                   <div className="bg-[#EBFBF8] p-3.5 rounded-2xl text-[#00685F] shadow-sm transform group-hover:scale-105 transition-transform">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18"/>
                        <path d="M5 21V7l7-4 7 4v14"/>
                        <path d="M9 21v-6h6v6"/>
                      </svg>
                   </div>
                   <div className="flex flex-col text-left">
                      <span className="text-[15px] font-black text-[#1A2B28]">Select Suite</span>
                      <span className="text-[9px] font-black text-[#00685F] uppercase tracking-[0.2em] mt-1.5 leading-none">ROOM ALLOCATION TOOL</span>
                   </div>
                </div>
                <div className="text-[#ADB5BD] group-hover:text-[#00685F] group-hover:translate-x-1 transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
             </button>
          </div>
        </section>

        {/* VERIFICATION SECTION */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 space-y-5 border border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Identity Verification</h2>
          </div>
          <div className="flex gap-4">
             <div className="flex-1 space-y-2">
                <label className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-1 opacity-70">ID Type</label>
                <div className="relative">
                  <select className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none appearance-none">
                    <option>Passport</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#718096]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
             </div>
             <div className="flex-1 space-y-2">
                <label className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-1 opacity-70">ID Number</label>
                <input type="text" placeholder="E1234567" className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none" />
             </div>
          </div>
          <div className="w-full border-2 border-dashed border-[#DEE3E8] rounded-[24px] py-8 flex flex-col items-center gap-3 bg-white hover:bg-[#EEF2F8] transition-all cursor-pointer group">
             <div className="text-[#00685F] group-hover:scale-110 transition-transform">
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                 <polyline points="17 8 12 3 7 8"/>
                 <line x1="12" y1="3" x2="12" y2="15"/>
               </svg>
             </div>
             <div className="text-center font-bold">
                <p className="text-[15px]! text-[#1A2B28] font-bold">Successfully Added!</p>
                <p className="text-[9px] text-[#ABB3B8] uppercase tracking-widest mt-1">PDF, JPG or PNG</p>
             </div>
          </div>
        </section>

        {/* EMERGENCY CONTACT */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 space-y-5 border border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Emergency Contact</h2>
          </div>
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-1 opacity-70">Contact Name</label>
                <input type="text" placeholder="Full name of contact" className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-1 opacity-70">Phone Number</label>
                <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none" />
             </div>
          </div>
        </section>
      </main>

      <footer className="px-4 pt-10 pb-20 flex gap-4">
        <button 
          onClick={() => router.back()} 
          className="flex-1 bg-[#EEF2F8] p-5 rounded-[20px] text-[#1A2B28] font-bold hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className={`flex-[1.2] bg-[#00685F] p-5 rounded-[20px] text-white font-black shadow-xl shadow-teal-900/10 flex items-center justify-center gap-3 ${isSaving ? 'opacity-80' : ''}`}
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            'Save Tenant'
          )}
        </button>
      </footer>
    </div>
  );
}

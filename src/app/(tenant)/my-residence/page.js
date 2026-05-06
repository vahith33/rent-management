"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function TenantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const roomInfo = {
    name: "Premium Studio B-402",
    floor: "4th Floor",
    rent: "₹18,500",
    status: "PAID",
    dueDate: "05 April 2026",
    amenities: ["Wi-Fi", "AC", "Laundry", "Cleaning"],
    owner: {
      name: "Suresh Kumar",
      phone: "+91 98765 43210"
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24 font-sans">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-1 group cursor-pointer" onClick={() => router.push('/welcome-tenant')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A2B28" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          <h1 className="text-lg font-bold text-[#1A2B28]">StayEase</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A2B28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="w-10 h-10 bg-[#00685F] rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer">
            RK
          </div>
        </div>
      </header>

      <main className="px-6 pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-50 flex items-center gap-5">
          <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center">
             <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" alt="Ravi" width={64} height={64} className="rounded-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1A2B28]">Ravi Kumar</h2>
            <p className="text-[12px] font-bold text-[#ABB3B8] uppercase tracking-widest mt-0.5">{roomInfo.name}</p>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[28px] border-l-4 border-[#008075] shadow-sm">
            <p className="text-[10px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-1">Rent Status</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#1A2B28]">{roomInfo.status}</span>
              <div className="w-2 h-2 bg-[#008075] rounded-full"></div>
            </div>
            <p className="text-[10px] font-medium text-[#718096] mt-1">Paid for March 2026</p>
          </div>
          <div className="bg-white p-5 rounded-[28px] border-l-4 border-amber-500 shadow-sm">
            <p className="text-[10px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-1">Next Due</p>
            <span className="text-xl font-black text-[#1A2B28]">{roomInfo.rent}</span>
            <p className="text-[10px] font-medium text-[#718096] mt-1">Due on {roomInfo.dueDate}</p>
          </div>
        </div>

        {/* Quick Tabs */}
        <div className="flex bg-[#F1F4F8] p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'overview' ? 'bg-white text-[#008075] shadow-sm' : 'text-slate-400'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'requests' ? 'bg-white text-[#008075] shadow-sm' : 'text-slate-400'}`}
          >
            Service
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'docs' ? 'bg-white text-[#008075] shadow-sm' : 'text-slate-400'}`}
          >
            Files
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Room Details */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 space-y-4">
              <h3 className="text-sm font-bold text-[#1A2B28] uppercase tracking-widest">Residence Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8FAFB] p-4 rounded-2xl">
                  <p className="text-[9px] font-bold text-[#ABB3B8] uppercase mb-1">Type</p>
                  <p className="text-sm font-bold text-[#1A2B28]">Luxury Studio</p>
                </div>
                <div className="bg-[#F8FAFB] p-4 rounded-2xl">
                  <p className="text-[9px] font-bold text-[#ABB3B8] uppercase mb-1">Deposit</p>
                  <p className="text-sm font-bold text-[#1A2B28]">₹40,000</p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-[9px] font-bold text-[#ABB3B8] uppercase mb-3">Amenities Included</p>
                <div className="flex flex-wrap gap-2">
                  {roomInfo.amenities.map((item, i) => (
                    <span key={i} className="bg-[#EBFBF8] px-3 py-1.5 rounded-full text-[10px] font-bold text-[#008075]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Owner Contact */}
            <div className="bg-[#00685F] p-6 rounded-[32px] shadow-lg shadow-teal-900/20 text-white flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Property Owner</p>
                <h3 className="text-xl font-bold mt-1">{roomInfo.owner.name}</h3>
                <p className="text-sm opacity-90 mt-0.5">{roomInfo.owner.phone}</p>
              </div>
              <a href={`tel:${roomInfo.owner.phone}`} className="bg-white/20 p-4 rounded-2xl backdrop-blur-md active:scale-90 transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6 animate-in fade-in duration-500 text-center py-10">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#008075" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <h3 className="text-xl font-bold text-[#1A2B28]">Need help?</h3>
            <p className="text-sm text-[#718096] max-w-[240px] mx-auto">Raise a maintenance request and we'll fix it right away.</p>
            <button className="bg-[#008075] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-teal-900/10 active:scale-95 transition-all mt-4">
              New Service Request
            </button>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-4 animate-in fade-in duration-500">
             {[
               { name: "Rental Agreement", size: "1.2 MB", type: "PDF" },
               { name: "Rent Receipt - Mar 2026", size: "450 KB", type: "PDF" },
               { name: "Room Inventory Checklist", size: "890 KB", type: "PDF" }
             ].map((doc, i) => (
               <div key={i} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-50 shadow-sm">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-[#F1F4F8] rounded-xl flex items-center justify-center text-[#718096]">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                   </div>
                   <div>
                     <p className="text-sm font-bold text-[#1A2B28]">{doc.name}</p>
                     <p className="text-[10px] font-bold text-[#ABB3B8] uppercase">{doc.type} • {doc.size}</p>
                   </div>
                 </div>
                 <button className="text-[#008075] p-2">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                 </button>
               </div>
             ))}
          </div>
        )}
      </main>

      {/* Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-slate-50 z-50 flex justify-around items-center">
         <button className="text-[#008075] flex flex-col items-center gap-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
         </button>
         <button className="text-[#ADB5BD] flex flex-col items-center gap-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">Access</span>
         </button>
         <button className="text-[#ADB5BD] flex flex-col items-center gap-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
         </button>
      </div>
    </div>
  );
}

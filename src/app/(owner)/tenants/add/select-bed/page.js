"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function SelectBedPage() {
  const router = useRouter();
  const [selectedBed, setSelectedBed] = useState("204-C");

  const beds = [
    { id: "204-A", status: "occupied", name: "Arun" },
    { id: "204-B", status: "available" },
    { id: "204-C", status: "selected" },
    { id: "204-D", status: "available" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-44">
      {/* Header */}
      <header className="bg-white px-6 py-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#004D40" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-[#004D40]">Select Bed</h1>
        </div>
        <div className="relative w-11 h-11 avatar-ring">
          <Image 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
            alt="Avatar" 
            fill 
            className="rounded-full object-cover border-2 border-white shadow-sm" 
          />
        </div>
      </header>

      <main className="px-6 pt-10 space-y-12">
        {/* Legend */}
        <div className="flex justify-around items-center px-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm border-2 border-slate-200"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ADB5BD]">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-[#ADB5BD]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ADB5BD]">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-[#006E65]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1A2B28]">Selected</span>
          </div>
        </div>

        <div className="text-center space-y-2">
           <h2 className="text-3xl font-black text-[#1A2B28]">Suite 204</h2>
           <p className="text-sm font-medium text-[#ADB5BD]">Premium Quadruple Sharing</p>
        </div>

        {/* Room Illustration Container */}
        <div className="relative mx-auto mt-12 bg-slate-100/30 rounded-[64px] p-8 pt-12 pb-16 border border-white flex flex-col gap-12">
            {/* Design Labels */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white/50 px-6 py-1.5 rounded-b-2xl border-x border-b border-white text-[9px] font-black uppercase tracking-[0.3em] text-[#ADB5BD]">
               Entrance
            </div>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center opacity-40">
               <span className="rotate-90 text-[10px] font-black uppercase tracking-widest text-[#1A2B28] whitespace-nowrap">Washroom</span>
            </div>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-20 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A2B28]">
                Window
            </div>

            {/* Top Row BEDS */}
            <div className="flex justify-between gap-8 relative z-10">
               {beds.slice(0, 2).map((bed) => (
                  <button 
                    key={bed.id}
                    onClick={() => bed.status !== 'occupied' && setSelectedBed(bed.id)}
                    className="flex-1 flex flex-col items-center gap-4 group"
                  >
                     <div className={`w-full aspect-[0.7/1] rounded-[32px] flex items-center justify-center relative transition-all duration-500 ${
                        selectedBed === bed.id 
                        ? "bg-[#006E65] shadow-2xl shadow-teal-900/40 -translate-y-2 scale-[1.05]" 
                        : bed.status === 'occupied' 
                        ? "bg-[#E2E8F0] opacity-80" 
                        : "bg-white border-2 border-dashed border-slate-200 group-hover:border-[#006E65]/30 group-hover:-translate-y-1"
                     }`}>
                        {bed.status === 'occupied' ? (
                           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        ) : selectedBed === bed.id ? (
                           <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center animate-pulse">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                           </div>
                        ) : (
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-20 transition-all group-hover:scale-125 group-hover:opacity-100"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        )}
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-tight whitespace-nowrap shadow-sm border transition-all ${
                        selectedBed === bed.id ? "bg-[#EEF2FF] text-[#006E65] border-[#006E65]/10 font-black scale-110" : "bg-white text-slate-400 border-slate-100"
                     }`}>
                        {bed.status === 'occupied' ? `${bed.name} (204-A)` : bed.id.split('-').pop() === 'B' ? '204-B' : bed.id}
                     </span>
                  </button>
               ))}
            </div>

            {/* Bottom Row BEDS */}
            <div className="flex justify-between gap-8 relative z-10">
               {beds.slice(2).map((bed) => (
                  <button 
                  key={bed.id}
                  onClick={() => bed.status !== 'occupied' && setSelectedBed(bed.id)}
                  className="flex-1 flex flex-col items-center gap-4 group"
                >
                   <div className={`w-full aspect-[0.7/1] rounded-[32px] flex items-center justify-center relative transition-all duration-500 ${
                      selectedBed === bed.id 
                      ? "bg-[#006E65] shadow-2xl shadow-teal-900/40 -translate-y-2 scale-[1.05]" 
                      : bed.status === 'occupied' 
                      ? "bg-[#E2E8F0] opacity-80" 
                      : "bg-white border-2 border-dashed border-slate-200 group-hover:border-[#006E65]/30 group-hover:-translate-y-1"
                   }`}>
                      {bed.status === 'occupied' ? (
                         <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      ) : selectedBed === bed.id ? (
                         <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center shadow-inner">
                            <div className="bg-white p-1 rounded-full">
                               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006E65" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                         </div>
                      ) : (
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-20 group-hover:scale-125 group-hover:opacity-100 transition-all"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      )}
                   </div>
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-tight whitespace-nowrap shadow-sm border transition-all ${
                        selectedBed === bed.id ? "bg-[#006E65] text-white border-transparent font-black scale-110" : "bg-white text-slate-400 border-slate-100"
                     }`}>
                        {selectedBed === bed.id ? `Selected (204-C)` : '204-D'}
                   </span>
                </button>
               ))}
            </div>
        </div>
      </main>

      {/* FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-8 pb-12 pt-6 border-t border-slate-100 z-50 rounded-t-[48px] shadow-[0_-20px_50px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col gap-10">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                 <div className="bg-[#006E65] p-3 rounded-xl text-white shadow-xl shadow-teal-900/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8"/><path d="M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M3 18h18"/></svg>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ADB5BD] mb-0.5">Assigned Bed</span>
                    <span className="text-2xl font-black text-[#1A2B28]">Bed {selectedBed}</span>
                 </div>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-[9px] font-black uppercase tracking-widest text-[#718096] mb-1">Monthly Rent</span>
                 <p className="text-3xl font-black text-[#1A2B28]">₹12,000<span className="text-base font-medium text-[#ADB5BD]">/mo</span></p>
              </div>
           </div>

           <button 
              onClick={() => router.push('/tenants/add')}
              className="w-full bg-[#006E65] py-5.5 rounded-[24px] text-white font-black text-lg flex items-center justify-center gap-3 group hover:bg-[#004D40] transition-all shadow-[0_20px_50px_rgba(0,110,101,0.25)] active:scale-[0.98] mt-2"
           >
              Confirm Assignment
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1.5 transition-transform"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
           </button>
        </div>
      </div>
    </div>
  );
}

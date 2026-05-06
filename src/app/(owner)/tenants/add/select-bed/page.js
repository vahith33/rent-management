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
      <header className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-50 shadow-sm">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-[#004D40]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className="text-xl font-black text-[#1A2B28]">Select Bed</h1>
      </header>

      <main className="px-6 pt-8 space-y-10">
        {/* Legend */}
        <div className="flex justify-center gap-8 items-center px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm border-2 border-slate-200"></div>
            <span className="text-[12px] font-bold text-[#718096]">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#ADB5BD]"></div>
            <span className="text-[12px] font-bold text-[#718096]">Full</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#006E65]"></div>
            <span className="text-[12px] font-bold text-[#1A2B28]">Selected</span>
          </div>
        </div>

        <div className="text-center space-y-1">
           <h2 className="text-xl font-black text-[#1A2B28]">Suite 204</h2>
           <p className="text-[13px] font-medium text-[#ADB5BD]">Premium Quadruple</p>
        </div>

        {/* Room Illustration Container */}
        <div className="relative mx-auto mt-6 bg-slate-50 rounded-[40px] p-5 pt-8 pb-10 border border-white flex flex-col gap-8 max-w-[300px]">
            {/* Design Labels */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white/50 px-3 py-1 rounded-b-lg border-x border-b border-white text-[10px] font-black text-[#ADB5BD]">
               Entrance
            </div>
            
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col items-center opacity-30">
               <span className="rotate-90 text-[10px] font-black text-[#1A2B28] whitespace-nowrap">Washroom</span>
            </div>
            
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-20 text-[10px] font-black text-[#1A2B28]">
                Window
            </div>

            {/* Top Row BEDS */}
            <div className="flex justify-between gap-4 relative z-10">
               {beds.slice(0, 2).map((bed) => (
                  <button 
                    key={bed.id}
                    onClick={() => bed.status !== 'occupied' && setSelectedBed(bed.id)}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                     <div className={`w-full aspect-square rounded-[16px] flex items-center justify-center relative transition-all duration-500 ${
                        selectedBed === bed.id 
                        ? "bg-[#006E65] shadow-lg shadow-teal-900/30 -translate-y-0.5 scale-[1.02]" 
                        : bed.status === 'occupied' 
                        ? "bg-[#E2E8F0] opacity-80" 
                        : "bg-white border border-dashed border-slate-200 group-hover:border-[#006E65]/30"
                     }`}>
                        {bed.status === 'occupied' ? (
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        ) : selectedBed === bed.id ? (
                           <div className="bg-white/10 w-7 h-7 rounded-full flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                           </div>
                        ) : (
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-20 transition-all group-hover:scale-110 group-hover:opacity-100"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        )}
                     </div>
                     <span className={`px-2 py-0.5 rounded-full text-[7px] font-black tracking-tight whitespace-nowrap shadow-sm border transition-all ${
                        selectedBed === bed.id ? "bg-[#EEF2FF] text-[#006E65] border-[#006E65]/10" : "bg-white text-slate-400 border-slate-100"
                     }`}>
                        {bed.status === 'occupied' ? `${bed.name}` : bed.id.split('-').pop()}
                     </span>
                  </button>
               ))}
            </div>

            {/* Bottom Row BEDS */}
            <div className="flex justify-between gap-4 relative z-10">
               {beds.slice(2).map((bed) => (
                  <button 
                  key={bed.id}
                  onClick={() => bed.status !== 'occupied' && setSelectedBed(bed.id)}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                   <div className={`w-full aspect-square rounded-[16px] flex items-center justify-center relative transition-all duration-500 ${
                      selectedBed === bed.id 
                      ? "bg-[#006E65] shadow-lg shadow-teal-900/30 -translate-y-0.5 scale-[1.02]" 
                      : bed.status === 'occupied' 
                      ? "bg-[#E2E8F0] opacity-80" 
                      : "bg-white border border-dashed border-slate-200 group-hover:border-[#006E65]/30"
                   }`}>
                      {bed.status === 'occupied' ? (
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      ) : selectedBed === bed.id ? (
                         <div className="bg-white/20 w-7 h-7 rounded-full flex items-center justify-center shadow-inner">
                            <div className="bg-white p-0.5 rounded-full">
                               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006E65" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                         </div>
                      ) : (
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-20 group-hover:scale-110 group-hover:opacity-100 transition-all"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      )}
                   </div>
                   <span className={`px-2 py-0.5 rounded-full text-[7px] font-black tracking-tight whitespace-nowrap shadow-sm border transition-all ${
                        selectedBed === bed.id ? "bg-[#006E65] text-white border-transparent" : "bg-white text-slate-400 border-slate-100"
                     }`}>
                        {selectedBed === bed.id ? `Selected` : bed.id.split('-').pop()}
                   </span>
                </button>
               ))}
            </div>
        </div>
      </main>

      {/* FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md px-6 pb-10 pt-4 border-t border-slate-100 z-50 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="bg-white rounded-[32px] p-6 border border-slate-50 space-y-6">
            <div className="flex items-center justify-between px-1">
               <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] font-black text-[#008075]">Assigned Bed</span>
                  <span className="text-[17px] font-black text-[#1A2B28]">Bed {selectedBed}</span>
                  <span className="text-[11px] font-medium text-[#718096] opacity-60">Primary Occupant</span>
               </div>
               <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[12px] font-bold text-[#718096]">Monthly Rent</span>
                  <p className="text-[20px] font-black text-[#1A2B28]">₹12,000<span className="text-sm font-medium text-[#ADB5BD]">/mo</span></p>
               </div>
            </div>

            <button 
               onClick={() => router.push('/tenants/add')}
               className="w-full bg-[#006E65] py-5 rounded-[22px] text-white font-black text-[17px] flex items-center justify-center gap-3 group hover:bg-[#004D40] transition-all shadow-2xl shadow-teal-900/10 active:scale-[0.98]"
            >
               Confirm Assignment
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1.5 transition-transform"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
        </div>
      </div>
    </div>
  );
}

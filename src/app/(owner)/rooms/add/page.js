"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddRoomPage() {
  const router = useRouter();
  const [roomType, setRoomType] = useState("AC");
  const [sharingType, setSharingType] = useState("2-Sharing");
  const [bedCount, setBedCount] = useState(2);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
 
  useEffect(() => {
    setMounted(true);
  }, []);
 
  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white pb-40 font-body">
      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-6 sticky top-0 bg-white z-50 border-b border-slate-50">
        <button onClick={() => router.back()} className="text-[#00685F] active:scale-90 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className="text-xl font-black text-[#1A2B28]">Add Room</h1>
      </header>

      <main className="px-4 py-8 space-y-6">
        {/* ROOM INFORMATION */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 border border-slate-50 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Room Information</h2>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-1 opacity-70">Room Number</label>
              <input 
                type="text" 
                placeholder="e.g. 102, 204B"
                className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] placeholder-[#ADB5BD] outline-none text-[14px] font-medium"
              />
            </div>
 
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-1 opacity-70">Floor</label>
              <div className="relative">
                <select className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none appearance-none font-medium text-[14px]">
                  <option>Ground Floor</option>
                  <option>First Floor</option>
                  <option>Second Floor</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#718096]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
            </div>
 
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-1 opacity-70">Room Type</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setRoomType("AC")}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all ${roomType === "AC" ? 'bg-white text-[#00685F] border-2 border-[#00685F]/20 shadow-sm' : 'bg-[#EEF2F8] text-[#718096]'}`}
                >
                  AC
                </button>
                <button 
                  onClick={() => setRoomType("Non-AC")}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all ${roomType === "Non-AC" ? 'bg-white text-[#00685F] border-2 border-[#00685F]/20 shadow-sm' : 'bg-[#EEF2F8] text-[#718096]'}`}
                >
                  Non-AC
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* BED CAPACITY */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 border border-slate-50 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Bed Capacity</h2>
          </div>
 
          <div className="space-y-5">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-1 opacity-70">Sharing Type</label>
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {["2-Sharing", "3-Sharing", "4-Sharing"].map(type => (
                  <button 
                    key={type}
                    onClick={() => setSharingType(type)}
                    className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all border-2 ${sharingType === type ? 'bg-[#00685F] text-white border-[#00685F]' : 'bg-white text-[#718096] border-slate-100 shadow-sm'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
 
            <div className="bg-white p-5 rounded-[26px] border-2 border-[#EBFBF8] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#1A2B28]">Total Beds</span>
                <span className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest mt-1">Available per room</span>
              </div>
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => setBedCount(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 bg-[#EEF2F8] rounded-xl flex items-center justify-center text-[#1A2B28] active:scale-90 transition-transform"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <span className="text-xl font-bold text-[#1A2B28]">{bedCount}</span>
                <button 
                  onClick={() => setBedCount(prev => prev + 1)}
                  className="w-10 h-10 bg-[#EBFBF8] rounded-xl flex items-center justify-center text-[#00685F] active:scale-90 transition-transform"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </div>
 
            <div className="space-y-3 pt-2">
              <label className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-1 opacity-70">Bed Identification</label>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: bedCount }).map((_, i) => (
                   <div key={i} className="bg-white p-4 rounded-[22px] border border-slate-50 flex items-center gap-4 shadow-sm">
                      <div className="bg-[#EBFBF8] p-2 rounded-lg text-[#00685F]">
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 20v-2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"/>
                            <rect x="7" y="4" width="10" height="14" rx="3"/>
                            <path d="M2 11h20"/>
                         </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-[#ABB3B8] uppercase">Bed {i+1}</span>
                        <span className="text-sm font-bold text-[#1A2B28]">102-{String.fromCharCode(65 + i)}</span>
                      </div>
                   </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 border border-slate-50 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Pricing</h2>
          </div>
 
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#00685F] font-bold">₹</div>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full bg-[#EEF2F8] border-none rounded-2xl pl-12 pr-24 py-5 text-[#1A2B28] font-bold text-[18px] outline-none"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#ABB3B8] text-[12px] font-bold uppercase">/ Month</div>
          </div>
        </section>
 
        {/* AMENITIES */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 border border-slate-50 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Amenities</h2>
          </div>
 
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'wifi', name: 'Wi-Fi', icon: 'M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01' },
              { id: 'house', name: 'Housekeeping', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10' },
              { id: 'laundry', name: 'Laundry', icon: 'M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z' },
              { id: 'backup', name: 'Backup', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
              { id: 'tv', name: 'TV', icon: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM12 18h.01' }
            ].map(amenity => (
              <div key={amenity.id} className="flex items-center gap-2 bg-white px-5 py-3 rounded-full border border-slate-50 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00685F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                   <path d={amenity.icon} />
                </svg>
                <span className="text-[13px] font-bold text-[#1A2B28]">{amenity.name}</span>
              </div>
            ))}
            <button className="flex items-center gap-2 px-5 py-3 rounded-full border border-dashed border-[#ADB5BD] bg-white hover:bg-slate-50 transition-colors">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
               <span className="text-[13px] font-bold text-[#718096]">Add more</span>
            </button>
          </div>
        </section>

        {/* ROOM PHOTOS */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 border border-slate-50 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Room Photos</h2>
          </div>
 
          <div className="w-full h-56 border-2 border-dashed border-[#DEE3E8] rounded-[24px] bg-white flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-[#EEF2F8] transition-all">
             <div className="bg-[#EBFBF8] p-5 rounded-full text-[#00685F] shadow-sm transform group-hover:scale-110 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                   <circle cx="12" cy="13" r="4"/>
                </svg>
             </div>
             <div className="text-center">
                <p className="text-[16px] font-bold text-[#1A2B28]">Upload Images</p>
                <p className="text-[11px] font-bold text-[#ABB3B8] uppercase tracking-widest mt-1">PNG, JPG up to 10MB</p>
             </div>
          </div>
        </section>
      </main>

      {/* Footer Action */}
      <footer className="px-4 pt-10 pb-20 flex gap-4">
        <button 
          onClick={() => router.back()}
          className="flex-1 bg-[#EEF2F8] py-5 rounded-[20px] text-[#1A2B28] font-bold text-[16px] hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={() => { setIsSaving(true); setTimeout(() => router.back(), 1500); }}
          className="flex-2 bg-[#00685F] py-5 rounded-[20px] text-white font-black text-[16px] shadow-xl shadow-teal-900/10 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          {isSaving ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving Room...
            </>
          ) : (
            "Save Room"
          )}
        </button>
      </footer>
    </div>
  );
}

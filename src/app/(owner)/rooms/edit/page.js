"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditRoomPage() {
  const router = useRouter();
  const [roomType, setRoomType] = useState("AC");
  const [sharingType, setSharingType] = useState("2-Sharing");
  const [bedCount, setBedCount] = useState(2);
  const [isSaving, setIsSaving] = useState(false);

  // Mock initial state for "editing"
  const initialData = {
    roomNumber: "302-B",
    floor: "Second Floor",
    price: "18500"
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24 font-sans">
      {/* Header */}
      <header className="bg-white px-6 py-6 flex items-center justify-between sticky top-0 z-50 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-[#008075]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h1 className="text-[20px] font-bold text-[#1A2B28]">Edit Room</h1>
        </div>
        <div className="bg-[#EBFBF8] px-3 py-1 rounded-lg">
            <span className="text-[12px] font-black text-[#008075]">Room {initialData.roomNumber}</span>
        </div>
      </header>

      <main className="px-6 py-8 space-y-10">
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#008075] rounded-full"></div>
            <h2 className="text-[15px] font-bold text-[#1A2B28]">Room Information</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Room Number</label>
              <input 
                type="text" 
                defaultValue={initialData.roomNumber}
                className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none text-[14px] font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Floor</label>
              <div className="relative">
                <select defaultValue={initialData.floor} className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none appearance-none font-medium text-[14px]">
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
              <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Room Type</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setRoomType("AC")}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all ${roomType === "AC" ? 'bg-[#008075] text-white' : 'bg-[#EEF2F8] text-[#718096]'}`}
                >
                  AC
                </button>
                <button 
                  onClick={() => setRoomType("Non-AC")}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all ${roomType === "Non-AC" ? 'bg-[#008075] text-white' : 'bg-[#EEF2F8] text-[#718096]'}`}
                >
                  Non-AC
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#008075] rounded-full"></div>
            <h2 className="text-[15px] font-bold text-[#1A2B28]">Pricing</h2>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#008075] font-bold">₹</div>
            <input 
              type="number" 
              defaultValue={initialData.price}
              className="w-full bg-[#EEF2F8] border-none rounded-2xl pl-12 pr-24 py-5 text-[#1A2B28] font-bold text-[18px] outline-none"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#ABB3B8] text-[14px] font-bold">/ Month</div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-50 z-50">
        <button 
          onClick={() => { setIsSaving(true); setTimeout(() => router.back(), 1500); }}
          className="w-full bg-[#008075] py-5 rounded-[22px] text-white font-bold text-[16px] shadow-xl shadow-teal-900/10 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          {isSaving ? "Updating Room..." : "Update Room"}
        </button>
      </footer>
    </div>
  );
}

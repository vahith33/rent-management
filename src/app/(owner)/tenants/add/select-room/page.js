"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SelectRoomPage() {
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const rooms = [
    { id: "101", status: "occupied", sharing: "2 Sharing", type: "AC", vacancies: 0 },
    { id: "102", status: "available", sharing: "3 Sharing", type: "Non-AC", vacancies: 1 },
    { id: "103", status: "available", sharing: "2 Sharing", type: "AC", vacancies: 2 },
    { id: "104", status: "available", sharing: "4 Sharing", type: "Non-AC", vacancies: 2 },
    { id: "105", status: "occupied", sharing: "2 Sharing", type: "AC", vacancies: 0 },
    { id: "106", status: "available", sharing: "3 Sharing", type: "AC", vacancies: 1 },
  ];

  const filteredRooms = showAvailableOnly ? rooms.filter(r => r.status === 'available') : rooms;
  const selectedRoomData = rooms.find(r => r.id === selectedRoom);

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-40">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-50 shadow-sm">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-[#00624E]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className="text-xl font-black text-[#1A2B28]">Select Room</h1>
      </header>

      <main className="px-6 pt-8 space-y-8">
        {/* Filter Section */}
        <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-slate-50">
           <div className="flex flex-col">
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#718096]">Room Availability</span>
              <span className="text-[11px] font-medium text-[#ADB5BD]">Show vacant rooms only</span>
           </div>
           <button 
             onClick={() => setShowAvailableOnly(!showAvailableOnly)}
             className={`w-12 h-6.5 rounded-full transition-all duration-300 relative ${showAvailableOnly ? 'bg-[#006E65]' : 'bg-slate-200'}`}
           >
              <div className={`absolute top-1 w-4.5 h-4.5 bg-white rounded-full transition-all duration-300 shadow-sm ${showAvailableOnly ? 'left-6.5' : 'left-1'}`}></div>
           </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm border-2 border-[#006E65]"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#718096]">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#E2E8F0]"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#718096]">Full</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#006E65]"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A2B28]">Selected</span>
          </div>
        </div>

        {/* Room Grid Area */}
        <div className="relative py-2">
          <div className="grid grid-cols-3 gap-3 relative z-10">
            {filteredRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => room.status !== 'occupied' && setSelectedRoom(room.id)}
                className={`min-h-[120px] rounded-[24px] flex flex-col items-center justify-between transition-all duration-500 p-4 border-2 relative overflow-hidden group ${
                  room.id === selectedRoom
                    ? "bg-[#006E65] text-white shadow-[0_15px_30px_rgba(0,110,101,0.2)] border-[#006E65] scale-[1.02]"
                    : room.status === "occupied"
                    ? "bg-slate-100 text-[#718096] border-transparent cursor-not-allowed"
                    : "bg-white text-[#1A2B28] border-slate-50 hover:border-[#006E65]/30 shadow-sm"
                }`}
              >
                {/* Vacancy Badge */}
                {room.status !== 'occupied' && (
                  <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-tighter ${
                    room.id === selectedRoom ? 'bg-white/20 text-white' : 'bg-[#EBFBF8] text-[#006E65]'
                  }`}>
                    {room.vacancies} Left
                  </div>
                )}

                <div className="flex flex-col items-center mt-1">
                  <span className="text-xl font-black">{room.id}</span>
                  <span className={`text-[7px] font-black uppercase tracking-widest mt-1 ${room.id === selectedRoom ? 'text-white/70' : 'text-[#A0AEC0]'}`}>
                    {room.sharing.split(' ')[0]} SH
                  </span>
                </div>

                <div className="w-full flex flex-col gap-1.5 items-center">
                  <div className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${
                    room.id === selectedRoom 
                      ? 'bg-white/20 text-white' 
                      : room.type === 'AC' 
                        ? 'bg-[#008075]/10 text-[#008075]' 
                        : 'bg-orange-50 text-orange-700'
                  }`}>
                    {room.type}
                  </div>
                  {room.status === 'occupied' ? (
                     <div className="flex items-center gap-1 opacity-30">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span className="text-[7px] font-black uppercase tracking-widest">Full</span>
                     </div>
                  ) : room.id === selectedRoom ? (
                    <div className="flex gap-0.5">
                      <div className="w-0.5 h-0.5 rounded-full bg-white/60 animate-bounce"></div>
                      <div className="w-0.5 h-0.5 rounded-full bg-white animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-0.5 h-0.5 rounded-full bg-white/60 animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  ) : (
                    <div className="h-0.5" /> /* Spacer */
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Floor Details Header */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-lg font-bold text-[#1A2B28] mb-6">Floor Amenities</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-50 space-y-3">
               <div className="bg-[#EBFBF8] w-10 h-10 rounded-xl flex items-center justify-center text-[#008075]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
               </div>
               <div>
                  <p className="text-[11px] font-black text-[#1A2B28] uppercase tracking-wider">Wi-Fi 6</p>
                  <p className="text-[9px] font-medium text-[#718096]">Gigabit Fiber</p>
               </div>
            </div>
            <div className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-50 space-y-3">
               <div className="bg-[#EBFBF8] w-10 h-10 rounded-xl flex items-center justify-center text-[#008075]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/><polyline points="20 4 13 4 13 11 16 8 20 11 20 4"/></svg>
               </div>
               <div>
                  <p className="text-[11px] font-black text-[#1A2B28] uppercase tracking-wider">AC Unit</p>
                  <p className="text-[9px] font-medium text-[#718096]">Inverter Tech</p>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER SUMMARY */}
      {selectedRoomData && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md px-6 pb-10 pt-4 border-t border-slate-100 z-50">
          <div className="bg-white rounded-[32px] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.02),0_20px_60px_rgba(0,0,0,0.05)] border border-slate-50 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#008075]">Selected Room</span>
                 <h4 className="text-[17px] font-black text-[#1A2B28]">Room {selectedRoomData.id} — 1st Floor</h4>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] font-bold text-[#718096]">{selectedRoomData.sharing}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[12px] font-bold text-[#718096]">{selectedRoomData.vacancies} Left</span>
                 </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-[#718096] uppercase tracking-wider mb-0.5">Starting at</p>
                <p className="text-[18px] font-black text-[#1A2B28]">₹12,000<span className="text-sm font-medium text-[#ADB5BD]">/mo</span></p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/tenants/add/select-bed')}
              className="w-full bg-[#006E65] py-5 rounded-[22px] text-white font-black text-[16px] flex items-center justify-center gap-3 hover:bg-[#005A52] shadow-2xl shadow-teal-900/20 active:scale-[0.98] transition-all group"
            >
              Continue to Bed Selection
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1.5 transition-transform"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getRooms } from '@/actions/owner';

export default function SelectRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    const data = await getRooms();
    setRooms(data);
    setIsLoading(false);
  };

  if (!mounted) return <div className="min-h-screen bg-white" />;

  const filteredRooms = showAvailableOnly ? rooms.filter(r => r.available > 0) : rooms;
  const selectedRoomData = rooms.find(r => r.id === selectedRoomId);

  const handleContinue = () => {
    if (!selectedRoomId) return;
    const params = new URLSearchParams(searchParams);
    params.set('roomId', selectedRoomId);
    router.push(`/tenants/add/select-bed?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-40 font-body">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md px-6 py-5 flex items-center gap-4 sticky top-0 z-50 border-b border-slate-50">
        <button 
          onClick={() => router.replace(`/tenants/add?${searchParams.toString()}`)} 
          className="p-2 -ml-2 text-[#00685F] bg-[#EBFBF8] rounded-xl active:scale-90 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className="text-[18px] font-black text-[#1A2B28]">Select Room</h1>
      </header>

      <main className="px-6 pt-8 space-y-8 animate-in fade-in duration-500">
        {/* Filter Section */}
        <div className="flex items-center justify-between bg-white p-5 rounded-[32px] shadow-sm border border-slate-50">
           <div className="flex flex-col">
              <span className="text-[14px] font-black text-[#1A2B28]">Vacancy Filter</span>
              <span className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wider mt-0.5">Show vacant rooms only</span>
           </div>
           <button 
             onClick={() => setShowAvailableOnly(!showAvailableOnly)}
             className={`w-12 h-6.5 rounded-full transition-all duration-500 relative ${showAvailableOnly ? 'bg-[#006E65]' : 'bg-slate-200'}`}
           >
              <div className={`absolute top-1 w-4.5 h-4.5 bg-white rounded-full transition-all duration-300 shadow-sm ${showAvailableOnly ? 'left-6.5' : 'left-1'}`}></div>
           </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-8 px-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-[#006E65]"></div>
            <span className="text-[11px] font-black text-[#718096] uppercase tracking-tight">Available</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            <span className="text-[11px] font-black text-[#718096] uppercase tracking-tight">Full</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#006E65]"></div>
            <span className="text-[11px] font-black text-[#1A2B28] uppercase tracking-tight">Selected</span>
          </div>
        </div>

        {/* Room Grid Area */}
        <div className="relative py-2">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="min-h-[120px] bg-white rounded-[28px] animate-pulse border border-slate-50"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 relative z-10">
              {filteredRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => room.available > 0 && setSelectedRoomId(room.id)}
                  className={`min-h-[130px] rounded-[32px] flex flex-col items-center justify-between transition-all duration-500 p-5 border-2 relative overflow-hidden group ${
                    room.id === selectedRoomId
                      ? "bg-[#006E65] text-white shadow-2xl shadow-teal-900/20 border-[#006E65] scale-[1.05]"
                      : room.available === 0
                      ? "bg-slate-50 text-[#718096] border-transparent cursor-not-allowed"
                      : "bg-white text-[#1A2B28] border-slate-50 hover:border-[#006E65]/30 shadow-sm"
                  }`}
                >
                  {/* Vacancy Badge */}
                  {room.available > 0 && (
                    <div className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-black ${
                      room.id === selectedRoomId ? 'bg-white/20 text-white' : 'bg-[#EBFBF8] text-[#006E65]'
                    }`}>
                      {room.available} Free
                    </div>
                  )}

                  <div className="flex flex-col items-center mt-2">
                    <span className="text-xl font-black tracking-tight">{room.building}-{room.room_number}</span>
                    <span className={`text-[9px] font-black mt-1 uppercase tracking-widest ${room.id === selectedRoomId ? 'text-white/70' : 'text-[#ADB5BD]'}`}>
                      {room.floor.split(' ')[0]} FL • {room.building}
                    </span>
                  </div>

                  <div className="w-full flex flex-col gap-2 items-center pb-1">
                    <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                      room.id === selectedRoomId 
                        ? 'bg-white/20 text-white' 
                        : 'bg-[#F8FAFB] text-[#718096]'
                    }`}>
                      {room.type.split(' - ')[1]}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {!isLoading && filteredRooms.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
               <p className="text-sm font-black text-[#718096]">NO VACANT ROOMS FOUND</p>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER SUMMARY */}
      {selectedRoomData && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl px-4 pb-10 pt-6 border-t border-slate-100 z-50 animate-in slide-in-from-bottom duration-500">
          <div className="bg-white rounded-[40px] p-7 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] border border-slate-50 space-y-7">
            <div className="flex flex-col gap-6">
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#008075] rounded-full animate-pulse"></div>
                    <span className="text-[11px] font-black text-[#008075] uppercase tracking-widest">Selection Confirmed</span>
                  </div>
                  <h4 className="text-[24px] font-black text-[#1A2B28] leading-tight">
                    {selectedRoomData.building}-{selectedRoomData.room_number}
                  </h4>
                  <p className="text-[12px] font-bold text-[#718096] uppercase tracking-wider">{selectedRoomData.floor}</p>
                </div>
                
                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-tighter mb-1">Monthly Rent</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[26px] font-black text-[#1A2B28] leading-none">{selectedRoomData.price}</span>
                    <span className="text-[12px] font-medium text-[#ADB5BD]">/mo</span>
                  </div>
                </div>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap gap-3 pt-1">
                <div className="bg-[#F8FAFB] px-4 py-2 rounded-2xl border border-slate-50 flex items-center gap-2 shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-3-3.87"/><path d="M9 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
                  <span className="text-[11px] font-black text-[#718096] uppercase">{selectedRoomData.type}</span>
                </div>
                <div className="bg-[#EBFBF8] px-4 py-2 rounded-2xl border border-[#006E65]/5 flex items-center gap-2 shadow-sm">
                   <div className="w-1.5 h-1.5 bg-[#006E65] rounded-full"></div>
                   <span className="text-[11px] font-black text-[#006E65] uppercase">{selectedRoomData.available} Vacant Beds</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleContinue}
              className="w-full bg-[#006E65] py-5.5 rounded-[28px] text-white font-black text-[17px] flex items-center justify-center gap-4 hover:bg-[#005A52] shadow-2xl shadow-teal-900/20 active:scale-[0.98] transition-all group"
            >
              Confirm & Select Bed
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

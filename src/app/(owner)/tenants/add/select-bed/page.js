"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getRooms } from '@/actions/owner';

export default function SelectBedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  
  const [room, setRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  const fetchRoomDetails = async () => {
    setIsLoading(true);
    const rooms = await getRooms();
    const foundRoom = rooms.find(r => String(r.id) === String(roomId));
    setRoom(foundRoom);
    setIsLoading(false);
  };

  if (!mounted) return <div className="min-h-screen bg-white" />;
  if (!roomId) return <div className="p-10 text-center font-black">Invalid Room Selection</div>;

  // Generate beds based on capacity
  const beds = room ? Array.from({ length: room.beds }, (_, i) => {
    const bedNum = i + 1; // 1, 2, 3...
    const bedId = `${room.building}-${room.room_number}-${bedNum}`;
    
    // Check if this bed is occupied (Simplified logic: first N beds occupied)
    const activeOccupants = room.beds - room.available;
    const isOccupied = i < activeOccupants;

    return {
      id: bedId,
      status: isOccupied ? 'occupied' : 'available',
      label: bedNum
    };
  }) : [];

  const handleConfirm = () => {
    if (!selectedBed) return;
    // Redirect back to Add Tenant with room/bed info
    const params = new URLSearchParams(searchParams);
    params.set('selectedRoomId', roomId);
    params.set('selectedBedId', selectedBed);
    router.push(`/tenants/add?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-44 font-body">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md px-6 py-5 flex items-center gap-4 sticky top-0 z-50 border-b border-slate-50">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-[#00685F] bg-[#EBFBF8] rounded-xl active:scale-90 transition-transform">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className="text-[18px] font-black text-[#1A2B28]">Select Bed</h1>
      </header>

      <main className="px-6 pt-8 space-y-10 animate-in fade-in duration-500">
        {/* Legend */}
        <div className="flex justify-center gap-8 items-center px-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-200"></div>
            <span className="text-[11px] font-black text-[#718096] uppercase tracking-tight">Available</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            <span className="text-[11px] font-black text-[#718096] uppercase tracking-tight">Occupied</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#006E65]"></div>
            <span className="text-[11px] font-black text-[#1A2B28] uppercase tracking-tight">Selected</span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
             <div className="w-10 h-10 border-4 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin mx-auto"></div>
             <p className="mt-4 text-sm font-black text-[#718096] uppercase tracking-widest">Loading Floor Plan...</p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
               <h2 className="text-[28px] font-black text-[#1A2B28] leading-tight tracking-tight">{room?.name}</h2>
               <div className="flex items-center justify-center gap-2">
                  <span className="text-[12px] font-bold text-[#ADB5BD] bg-white px-4 py-1 rounded-full border border-slate-50 shadow-sm">{room?.type}</span>
               </div>
            </div>

            {/* Room Illustration Container */}
            <div className="relative mx-auto mt-6 bg-white rounded-[48px] p-8 pt-12 pb-14 border border-slate-100 flex flex-col gap-10 max-w-[320px] shadow-2xl shadow-slate-200/50">
                {/* Design Labels */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-50 px-4 py-1.5 rounded-b-2xl border-x border-b border-slate-100 text-[10px] font-black text-[#ADB5BD] tracking-widest uppercase">
                   Entrance
                </div>
                
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center opacity-20">
                   <span className="rotate-90 text-[10px] font-black text-[#1A2B28] whitespace-nowrap uppercase tracking-widest">Washroom</span>
                </div>
                
                {/* Grid Layout for BEDS */}
                <div className="grid grid-cols-2 gap-6 relative z-10">
                   {beds.map((bed) => (
                      <button 
                        key={bed.id}
                        disabled={bed.status === 'occupied'}
                        onClick={() => setSelectedBed(bed.id)}
                        className="flex flex-col items-center gap-3 group"
                      >
                         <div className={`w-full aspect-square rounded-[24px] flex items-center justify-center relative transition-all duration-500 ${
                            selectedBed === bed.id 
                            ? "bg-[#006E65] shadow-2xl shadow-teal-900/30 -translate-y-1 scale-[1.05]" 
                            : bed.status === 'occupied' 
                            ? "bg-slate-100 opacity-60 grayscale" 
                            : "bg-[#F8FAFB] border-2 border-dashed border-slate-100 hover:border-[#006E65]/30 group-hover:bg-white"
                         }`}>
                            {bed.status === 'occupied' ? (
                               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            ) : selectedBed === bed.id ? (
                               <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center shadow-inner">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                               </div>
                            ) : (
                               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-20 group-hover:opacity-100 transition-all"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            )}
                         </div>
                         <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase transition-all shadow-sm border ${
                            selectedBed === bed.id ? "bg-[#006E65] text-white border-transparent" : "bg-white text-slate-400 border-slate-100"
                         }`}>
                            Bed {bed.label}
                         </span>
                      </button>
                   ))}
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-10 text-[10px] font-black text-[#1A2B28] tracking-widest uppercase">
                    Balcony / Window
                </div>
            </div>
          </>
        )}
      </main>

      {/* FOOTER ACTIONS */}
      {selectedBed && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md px-6 pb-12 pt-6 border-t border-slate-100 z-50 animate-in slide-in-from-bottom duration-500">
          <div className="bg-white rounded-[40px] p-8 border border-slate-50 space-y-8 shadow-2xl">
              <div className="flex items-center justify-between px-1">
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#008075] rounded-full animate-pulse"></div>
                      <span className="text-[12px] font-black text-[#008075] uppercase tracking-widest">Final Assignment</span>
                    </div>
                    <span className="text-[20px] font-black text-[#1A2B28]">{room?.name} — {selectedBed}</span>
                    <span className="text-[12px] font-bold text-[#718096]">{room?.floor} Floor</span>
                 </div>
                 <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-black text-[#718096] uppercase tracking-tighter">Rent Impact</span>
                    <p className="text-[22px] font-black text-[#1A2B28]">{room?.price}<span className="text-xs font-medium text-[#ADB5BD]">/mo</span></p>
                 </div>
              </div>

              <button 
                 onClick={handleConfirm}
                 className="w-full bg-[#006E65] py-6 rounded-[28px] text-white font-black text-[18px] flex items-center justify-center gap-4 group hover:bg-[#004D40] transition-all shadow-2xl shadow-teal-900/20 active:scale-[0.98]"
              >
                 Confirm Assignment
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
          </div>
        </div>
      )}
    </div>
  );
}

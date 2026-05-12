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
    const bid = searchParams.get('selectedBedId');
    if (bid) setSelectedBed(bid);
  }, [searchParams]);

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
    
    // Check if this specific bed is occupied using real assignment data
    const isOccupied = room.assignments?.some(a => 
      String(a.bed_index) === String(bedId) && 
      (a.status === 'ACTIVE' || a.status === 'active')
    );

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
      <header className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-50 shadow-sm">
        <button 
          onClick={() => router.replace(`/tenants/add/select-room?${searchParams.toString()}`)} 
          className="text-[#00685F] p-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className="text-[20px] font-black text-[#1A2B28]">Select Bed</h1>
      </header>

      <main className="px-6 py-8 space-y-8 animate-in fade-in duration-500">
        {/* Legend */}
        <div className="flex justify-center gap-6 items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full border border-slate-200"></div>
            <span className="text-[10px] font-bold text-[#718096] uppercase">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            <span className="text-[10px] font-bold text-[#718096] uppercase">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#008075]"></div>
            <span className="text-[10px] font-bold text-[#1A2B28] uppercase">Selected</span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
             <div className="w-8 h-8 border-3 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin mx-auto"></div>
             <p className="mt-4 text-[10px] font-bold text-[#718096] uppercase tracking-widest">Loading Floor Plan...</p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-1">
               <h2 className="text-[22px] font-black text-[#1A2B28]">{room?.name}</h2>
               <span className="text-[10px] font-bold text-[#ADB5BD] uppercase tracking-wider">{room?.type}</span>
            </div>

            {/* Room Illustration Container */}
            <div className="relative mx-auto mt-4 bg-white rounded-[40px] p-6 pt-10 pb-12 border border-slate-100 flex flex-col gap-8 max-w-[300px] shadow-xl shadow-slate-200/40">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-50 px-3 py-1 rounded-b-xl border-x border-b border-slate-100 text-[9px] font-bold text-[#ADB5BD] tracking-widest uppercase">
                   Entrance
                </div>
                
                {/* Grid Layout for BEDS */}
                <div className="grid grid-cols-2 gap-5 relative z-10">
                   {beds.map((bed) => (
                      <button 
                        key={bed.id}
                        disabled={bed.status === 'occupied'}
                        onClick={() => setSelectedBed(selectedBed === bed.id ? null : bed.id)}
                        className="flex flex-col items-center gap-2 group"
                      >
                         <div className={`w-full aspect-square rounded-[24px] flex items-center justify-center relative transition-all duration-300 border ${
                            selectedBed === bed.id 
                            ? "bg-[#00685F] border-[#00685F] shadow-lg shadow-teal-900/10 scale-[1.05]" 
                            : bed.status === 'occupied' 
                            ? "bg-slate-100 border-transparent opacity-60 cursor-not-allowed" 
                            : "bg-white border-slate-100 hover:border-[#008075]/30"
                         }`}>
                            {bed.status === 'occupied' ? (
                               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            ) : selectedBed === bed.id ? (
                               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : (
                               <div className="w-1.5 h-1.5 bg-[#008075] rounded-full opacity-20"></div>
                            )}
                         </div>
                         <span className={`text-[10px] font-bold uppercase tracking-wider transition-all ${
                            selectedBed === bed.id ? "text-[#00685F]" : "text-[#718096]"
                         }`}>
                            Bed {bed.label}
                         </span>
                      </button>
                   ))}
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-20 text-[9px] font-bold text-[#ADB5BD] tracking-widest uppercase">
                    Window View
                </div>
            </div>
          </>
        )}
      </main>

      {/* Footer Summary */}
      {selectedBed && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 z-50 animate-in slide-in-from-bottom duration-500">
          <div className="max-w-lg mx-auto px-6 py-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#008075] uppercase tracking-wider">Final Assignment</span>
                <h2 className="text-[22px] font-black text-[#1A2B28]">
                  {room?.name} • Bed {selectedBed.split('-').pop()}
                </h2>
                <span className="text-[12px] font-medium text-[#718096]">{room?.type}</span>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">Monthly Rent</span>
                <p className="text-[20px] font-black text-[#1A2B28]">{room?.price}</p>
              </div>
            </div>

            <button 
              onClick={handleConfirm}
              className="w-full bg-[#00685F] py-4 rounded-[20px] text-white font-bold text-[16px] flex items-center justify-center gap-3 shadow-lg shadow-teal-900/10 active:scale-[0.98] transition-all"
            >
              Confirm Assignment
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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

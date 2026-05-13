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
    const rid = searchParams.get('selectedRoomId');
    if (rid) setSelectedRoomId(rid);
  }, [searchParams]);

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
      <header className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-50 shadow-sm">
        <button 
          onClick={() => router.replace(`/tenants/add?${searchParams.toString()}`)} 
          className="text-[#00685F] p-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className="text-[20px] font-black text-[#1A2B28]">Select Room</h1>
      </header>

      <main className="px-6 py-8 space-y-8 animate-in fade-in duration-500">
        {/* Filter Section */}
        <div className="flex items-center justify-between bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
           <div className="flex flex-col">
              <span className="text-[14px] font-bold text-[#1A2B28]">Vacancy Filter</span>
              <span className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">Show vacant rooms only</span>
           </div>
           <button 
             onClick={() => setShowAvailableOnly(!showAvailableOnly)}
             className={`w-11 h-6 rounded-full transition-all duration-300 relative ${showAvailableOnly ? 'bg-[#008075]' : 'bg-slate-200'}`}
           >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${showAvailableOnly ? 'left-6' : 'left-1'}`}></div>
           </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#EBFBF8] border border-[#008075]"></div>
            <span className="text-[10px] font-bold text-[#718096] uppercase">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-100"></div>
            <span className="text-[10px] font-bold text-[#718096] uppercase">Full</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#008075]"></div>
            <span className="text-[10px] font-bold text-[#1A2B28] uppercase">Selected</span>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-3 gap-3">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square bg-white rounded-[24px] animate-pulse border border-slate-50"></div>
            ))
          ) : (
            filteredRooms.map((room) => {
              const isSelected = room.id === selectedRoomId;
              const isFull = room.available === 0;
              
              return (
                <button
                  key={room.id}
                  onClick={() => !isFull && setSelectedRoomId(isSelected ? null : room.id)}
                  className={`aspect-square rounded-[24px] flex flex-col items-center justify-center gap-0.5 transition-all duration-300 border relative group active:scale-[0.98] ${
                    isSelected
                      ? "bg-[#00685F] text-white border-[#00685F] shadow-lg shadow-teal-900/10 scale-[1.02]"
                      : isFull
                      ? "bg-slate-50 text-[#ADB5BD] border-transparent cursor-not-allowed"
                      : "bg-white text-[#1A2B28] border-slate-100 hover:border-[#008075]/30"
                  }`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[15px] font-black leading-none">Room {room.room_number}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/60' : 'text-[#718096]'}`}>
                      Floor {room.floor.split(' ')[0]}
                    </span>
                  </div>

                  <div className="flex flex-col items-center mt-1">
                    <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase mb-1 ${isSelected ? 'bg-white/10 text-white' : 'bg-slate-50 text-[#718096]'}`}>
                      Building {room.building}
                    </div>
                    <span className={`text-[10px] font-black uppercase ${isSelected ? 'text-white/90' : 'text-[#008075]'}`}>
                      Available: {room.available}
                    </span>
                  </div>
                  
                  {!isFull && !isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#008075] rounded-full"></div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {!isLoading && filteredRooms.length === 0 && (
          <div className="py-12 text-center">
             <p className="text-[12px] font-bold text-[#718096] uppercase tracking-widest">No rooms found</p>
          </div>
        )}
      </main>

      {/* Selection Footer */}
      {selectedRoomData && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 z-50 animate-in slide-in-from-bottom duration-500">
          <div className="max-w-lg mx-auto px-6 py-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#008075] uppercase tracking-wider">Selected Room</span>
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-[18px] font-black text-[#1A2B28] leading-none">Room {selectedRoomData.room_number}</h2>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-[#718096]">Floor {selectedRoomData.floor.split(' ')[0]}</span>
                    <span className="text-[11px] font-medium text-[#718096]/80 uppercase tracking-wider">Building {selectedRoomData.building}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black bg-[#EBFBF8] text-[#008075] px-1.5 py-0.5 rounded uppercase tracking-tighter">{selectedRoomData.type}</span>
                    <span className="text-[11px] font-black text-[#008075]">Available: {selectedRoomData.available}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#718096] uppercase tracking-wider">Monthly Rent</span>
                <p className="text-[20px] font-black text-[#1A2B28]">{selectedRoomData.price}</p>
              </div>
            </div>

            <button 
              onClick={handleContinue}
              className="w-full bg-[#00685F] py-4 rounded-[20px] text-white font-bold text-[16px] flex items-center justify-center gap-3 shadow-lg shadow-teal-900/10 active:scale-[0.98] transition-all"
            >
              Confirm Selection
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

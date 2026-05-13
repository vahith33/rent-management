"use client";

import { useState, useEffect, useTransition, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRooms } from '@/actions/owner';

function RoomsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState(() => searchParams.get('view') || "menu");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const cache = useRef({ rooms: null });

  const fetchRoomsIfNeeded = useCallback(async () => {
    if (cache.current.rooms) return cache.current.rooms;
    setIsLoading(true);
    const data = await getRooms();
    setRooms(data);
    cache.current.rooms = data;
    setIsLoading(false);
    return data;
  }, []);

  useEffect(() => {
    const v = searchParams.get('view') || 'menu';
    const id = searchParams.get('id');
    
    if (v === 'list') {
      setView('list');
      fetchRoomsIfNeeded();
    } else if (v === 'detail' && id) {
      fetchRoomsIfNeeded().then(data => {
        const room = data.find(r => String(r.id) === String(id));
        if (room) {
          setSelectedRoom(room);
          setView('detail');
        }
      });
    } else {
      setView('menu');
      setIsLoading(false);
    }
  }, [searchParams, fetchRoomsIfNeeded]);

  const switchView = useCallback((newView, params = '') => {
    const url = params ? `/rooms?view=${newView}&${params}` : (newView === 'menu' ? '/rooms' : `/rooms?view=${newView}`);
    window.history.pushState(null, '', url);

    if (newView === 'list' || newView === 'detail') {
      fetchRoomsIfNeeded();
    }

    startTransition(() => {
      setView(newView);
    });
  }, [fetchRoomsIfNeeded]);

  // ==========================================
  // ==========================================
  // VIEW: ROOM DETAIL
  // ==========================================
  if (view === "detail") {
     return (
        <div className="bg-[#F8FAFB] animate-in slide-in-from-right duration-500 font-body">
           <main className="px-6 py-6 space-y-5">
              {isLoading && !selectedRoom ? (
                // Detail Skeleton
                <div className="space-y-8 animate-pulse">
                  <div className="h-64 bg-slate-100 rounded-[32px]"></div>
                  <div className="h-28 bg-slate-100 rounded-[32px]"></div>
                  <div className="h-40 bg-slate-100 rounded-[32px]"></div>
                </div>
              ) : selectedRoom && (
                <>
                  {/* Image / Hero */}
                  <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-50 relative">
                     <div className="h-64 bg-slate-50 relative">
                        {selectedRoom.image_url ? (
                          <img src={selectedRoom.image_url} className="w-full h-full object-cover" alt="Room" />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full w-full bg-[#F1F4F8] text-slate-400 gap-5">
                            <div className="w-20 h-20 bg-white rounded-[28px] shadow-xl shadow-slate-200 flex items-center justify-center">
                               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                            </div>
                            <p className="text-[14px] font-black text-[#718096]">No photo added</p>
                          </div>
                        )}
                        <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full shadow-sm border font-black text-[9px] uppercase tracking-wider ${
                             selectedRoom.status === 'OCCUPIED' ? 'bg-[#FEF2F2] text-[#EF4444] border-red-100' : 
                             selectedRoom.status === 'PARTIAL' ? 'bg-[#FFF7ED] text-[#EA580C] border-orange-100' : 
                             'bg-[#EBFBF8] text-[#008075] border-teal-100'
                        }`}>
                           {selectedRoom.status}
                        </div>
                     </div>
                     <div className="p-8 text-center bg-white">
                        <h1 className="text-3xl pb-2 font-black text-[#1A2B28] mb-2">{selectedRoom.name}</h1>
                        <div className="flex items-center justify-center gap-3">
                           <span className="text-[12px] font-bold text-[#718096] bg-[#F1F4F8] px-4 py-1.5 rounded-full">Building {selectedRoom.building}</span>
                           <span className="text-[12px] font-bold text-[#718096] bg-[#F1F4F8] px-4 py-1.5 rounded-full">Floor {selectedRoom.floor}</span>
                           <span className="text-[12px] font-bold text-[#718096] bg-[#F1F4F8] px-4 py-1.5 rounded-full">{selectedRoom.type}</span>
                        </div>
                     </div>
                  </div>

                  {/* Pricing and Availability Card */}
                  <div className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm grid grid-cols-2 gap-6 relative overflow-hidden">
                     <div className="space-y-2">
                        <p className="text-[12px] font-bold text-[#718096] uppercase tracking-wide">Monthly Rent</p>
                        <p className="text-[20px] font-black text-[#1A2B28]">{selectedRoom.price}</p>
                     </div>
                     <div className="space-y-2 border-l border-slate-100 pl-8">
                        <p className="text-[12px] font-bold text-[#718096] uppercase tracking-wide">Availability</p>
                        <p className="text-[20px] font-black text-[#1A2B28]">
                          <span className={selectedRoom.available > 0 ? 'text-[#008075]' : 'text-[#EF4444]'}>{selectedRoom.available}</span>
                          <span className="text-lg text-[#ADB5BD] ml-1">/ {selectedRoom.beds} Beds</span>
                        </p>
                     </div>
                  </div>

                  {/* Description Section if needed or Actions */}
                  <div className="space-y-6">
                     <button 
                       onClick={() => router.push(`/rooms/edit?id=${selectedRoom.id}`)} 
                       className="w-full bg-[#00685F] text-white py-5 rounded-[20px] text-[16px] font-black shadow-xl shadow-[#00685F]/20 active:scale-[0.98] transition-all"
                     >
                       Edit Room Details
                     </button>
                  </div>
                </>
              )}
           </main>
        </div>
     );
  }

  // ==========================================
  // VIEW: ROOM LIST
  // ==========================================
  if (view === "list") {
     const filteredRooms = rooms.filter(room => 
       room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       room.floor.toLowerCase().includes(searchQuery.toLowerCase()) ||
       room.type.toLowerCase().includes(searchQuery.toLowerCase())
     );

     return (
        <div className="min-h-screen bg-[#F8FAFB] animate-in fade-in duration-500 font-body pb-32">
           <main className="px-6 py-8 space-y-8">
              <div className="space-y-2">
                 <h2 className="text-3xl font-black text-[#1A2B28]">Available Rooms</h2>
                 <p className="text-[14px] font-medium text-[#718096]">Manage your property availability</p>
              </div>

              <div className="relative group">
                 <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ADB5BD] group-focus-within:text-[#008075] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                 </div>
                 <input 
                    type="text" 
                    placeholder="Search by name, floor or type..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white pl-14 pr-6 py-5 rounded-[24px] border border-slate-200 outline-none focus:ring-2 focus:ring-[#008075]/20 focus:border-[#008075] transition-all text-[14px] font-medium text-[#1A2B28] shadow-sm"
                 />
              </div>

              <div className="space-y-5">
                 {isLoading && rooms.length === 0 ? (
                   <div className="grid gap-5">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-full h-36 bg-white rounded-[32px] animate-pulse border border-slate-50 shadow-sm"></div>
                      ))}
                   </div>
                 ) : (
                   <div className="grid gap-5">
                      {filteredRooms.map((room) => (
                         <button 
                            key={room.id} 
                            onClick={() => switchView('detail', `id=${room.id}`)} 
                            className="bg-white rounded-[32px] p-6 border border-slate-50 shadow-sm space-y-5 active:scale-[0.98] hover:scale-[1.02] hover:shadow-xl transition-all group w-full text-left"
                         >
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-[#F1F4F8] text-[#00685F] rounded-2xl flex items-center justify-center group-hover:bg-[#00685F] group-hover:text-white transition-colors">
                                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-lg font-black text-[#1A2B28]">{room.name}</span>
                                     <div className="flex flex-col text-[12px] font-bold text-[#718096] mt-1 gap-0.5">
                                        <span>{room.type}</span>
                                        <span>Building {room.building}</span>
                                        <span>Floor {room.floor}</span>
                                     </div>
                                  </div>
                               </div>
                               <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                 room.status === 'OCCUPIED' ? 'bg-[#FEF2F2] text-[#EF4444]' : 
                                 room.status === 'PARTIAL' ? 'bg-[#FFF7ED] text-[#EA580C]' : 
                                 'bg-[#EBFBF8] text-[#008075]'
                               }`}>
                                 {room.status}
                               </div>
                            </div>
                            <div className="grid grid-cols-2 pt-4 border-t border-slate-50 gap-4">
                               <div className="flex flex-col items-start">
                                  <span className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wide mb-1">Rent</span>
                                  <span className="text-lg font-black text-[#1A2B28]">{room.price}</span>
                               </div>
                               <div className="flex flex-col items-end">
                                  <span className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wide mb-1">Vacancy</span>
                                  <span className="text-lg font-black text-[#1A2B28]">
                                     <span className={room.available > 0 ? 'text-[#008075]' : 'text-[#EF4444]'}>{room.available}</span>
                                     <span className="text-[12px] text-[#ADB5BD] ml-1">/ {room.beds} Beds</span>
                                  </span>
                               </div>
                            </div>
                         </button>
                      ))}
                   </div>
                 )}
              </div>
           </main>
        </div>
     );
  }

  // ==========================================
  // VIEW: MENU
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F8FAFB] font-body pb-12">
      <main className="px-6 py-8 space-y-8">
        <div className="space-y-2 text-left">
          <h2 className="text-3xl font-black text-[#1A2B28]">Manage Rooms</h2>
          <p className="text-[14px] font-medium text-[#718096]">Monitor occupancy and room status</p>
        </div>

        <div className="grid gap-5">
          {isLoading && !cache.current.rooms ? (
             [...Array(3)].map((_, i) => (
              <div key={i} className="w-full bg-white p-7 rounded-[32px] border border-slate-50 flex items-center gap-6 animate-pulse shadow-sm">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
                <div className="flex flex-col gap-3">
                  <div className="w-40 h-6 bg-slate-100 rounded-lg"></div>
                  <div className="w-24 h-4 bg-slate-100 rounded-md"></div>
                </div>
              </div>
            ))
          ) : (
            <>
              <button 
                onClick={() => router.push('/rooms/add')} 
                className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl hover:scale-[1.02] transition-all group active:scale-[0.98] text-left"
              >
                <div className="bg-[#008075] text-white p-4.5 rounded-2xl shadow-lg shadow-[#008075]/10 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/><line x1="15" y1="11" x2="21" y2="11"/><line x1="18" y1="8" x2="18" y2="14"/></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-[#1A2B28]">Add New Room</span>
                  <span className="text-[12px] font-bold text-[#718096] mt-1">Expansion</span>
                </div>
              </button>

              <button 
                onClick={() => switchView('list')} 
                className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl hover:scale-[1.02] transition-all group active:scale-[0.98] text-left"
              >
                <div className="bg-[#00685F] text-white p-4.5 rounded-2xl shadow-lg shadow-[#00685F]/10 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-[#1A2B28]">Rooms List</span>
                  <span className="text-[12px] font-bold text-[#718096] mt-1">Management</span>
                </div>
              </button>

              <button 
                onClick={() => router.push('/rooms/remove')} 
                className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl hover:scale-[1.02] transition-all group active:scale-[0.98] text-left"
              >
                <div className="bg-red-500 text-white p-4.5 rounded-2xl shadow-lg shadow-red-500/10 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-[#1A2B28]">Remove Room</span>
                  <span className="text-[12px] font-bold text-[#718096] mt-1">Process Exit</span>
                </div>
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

import { Suspense } from 'react';

export default function RoomsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <RoomsContent />
    </Suspense>
  );
}

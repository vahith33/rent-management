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
  // VIEW: ROOM DETAIL
  // ==========================================
  if (view === "detail") {
     return (
        <div className="min-h-screen bg-white animate-in slide-in-from-right duration-500 font-body pb-32">
           <main className="px-4 py-6 space-y-6">
              {isLoading && !selectedRoom ? (
                // Detail Skeleton
                <div className="space-y-6 animate-pulse">
                  <div className="h-56 bg-slate-100 rounded-[32px]"></div>
                  <div className="h-24 bg-slate-50 rounded-[32px]"></div>
                  <div className="h-32 bg-slate-50 rounded-[32px]"></div>
                </div>
              ) : selectedRoom && (
                <>
                  {/* Image / Hero */}
                  <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-50 relative">
                     <div className="h-56 bg-slate-100 relative">
                        {selectedRoom.image_url ? (
                          <img src={selectedRoom.image_url} className="w-full h-full object-cover" alt="Room" />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full w-full bg-[#F1F4F8] text-slate-400 gap-5">
                            <div className="w-20 h-20 bg-white rounded-[28px] shadow-xl shadow-slate-200 flex items-center justify-center">
                               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                            </div>
                            <p className="text-[14px] font-black text-slate-600">No photo added</p>
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg border border-white/50">
                           <span className={`text-[10px] font-black tracking-widest uppercase ${
                             selectedRoom.status === 'OCCUPIED' ? 'text-red-500' : 
                             selectedRoom.status === 'PARTIAL' ? 'text-orange-500' : 'text-[#008075]'
                           }`}>{selectedRoom.status}</span>
                        </div>
                     </div>
                     <div className="p-8 text-center bg-white">
                        <h1 className="text-[24px] font-black text-[#1A2B28] mb-1">{selectedRoom.name}</h1>
                        <div className="flex items-center justify-center gap-2">
                           <span className="text-[13px] font-bold text-[#718096] bg-slate-100 px-3 py-1 rounded-full">Bldg {selectedRoom.building}</span>
                           <span className="text-[13px] font-bold text-[#718096] bg-slate-100 px-3 py-1 rounded-full">F{selectedRoom.floor}</span>
                           <span className="text-[13px] font-bold text-[#718096] bg-slate-100 px-3 py-1 rounded-full">{selectedRoom.type}</span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#F8FAFB] rounded-[32px] p-6 border border-slate-50 grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <p className="text-[11px] font-black text-[#718096] uppercase">Monthly Rent</p>
                        <p className="text-[24px] font-black text-[#1A2B28]">{selectedRoom.price}</p>
                     </div>
                     <div className="space-y-1 border-l border-slate-200 pl-6">
                        <p className="text-[11px] font-black text-[#718096] uppercase">Availability</p>
                        <p className="text-[24px] font-black text-[#1A2B28]">
                          <span className={selectedRoom.available > 0 ? 'text-[#008075]' : 'text-red-500'}>{selectedRoom.available}</span>/{selectedRoom.beds}
                        </p>
                     </div>
                  </div>

                  <div className="space-y-4 pt-4">
                     <button onClick={() => router.push(`/rooms/edit?id=${selectedRoom.id}`)} className="w-full bg-white border border-slate-200 py-5 rounded-[22px] text-[16px] font-black text-[#1A2B28] active:scale-[0.98] transition-all">Edit Details</button>
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
        <div className="min-h-screen bg-white animate-in fade-in duration-500 font-body pb-32">
           <main className="px-6 py-6 space-y-5">
              <div className="space-y-2">
                 <h2 className="text-[22px] font-black text-[#1A2B28]">Available Rooms</h2>
                 <p className="text-[14px] font-medium text-[#718096]">Manage your property availability</p>
              </div>

              <div className="relative group">
                 <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ADB5BD]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                 </div>
                 <input 
                    type="text" 
                    placeholder="Search rooms..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F8FAFB] pl-14 pr-6 py-5 rounded-[24px] border border-transparent outline-none focus:bg-white focus:ring-4 focus:ring-[#008075]/5 focus:border-[#008075] transition-all text-[14px] font-bold text-[#1A2B28]"
                 />
              </div>

              <div className="space-y-5">
                 {isLoading && rooms.length === 0 ? (
                   <div className="space-y-4">
                     {[1, 2, 3, 4].map(i => (
                       <div key={i} className="w-full h-32 bg-slate-50 rounded-[28px] animate-pulse border border-slate-100/50"></div>
                     ))}
                   </div>
                 ) : (
                   <div className="grid gap-5">
                      {filteredRooms.map((room) => (
                         <button key={room.id} onClick={() => switchView('detail', `id=${room.id}`)} className="bg-white rounded-[32px] p-5 border border-slate-100 shadow-sm space-y-5 active:scale-[0.98] transition-all group w-full hover:shadow-xl">
                            <div className="flex items-center gap-4 text-left">
                               <div className="w-12 h-12 bg-[#EBFBF8] text-[#00685F] rounded-2xl flex items-center justify-center">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[17px] font-black text-[#1A2B28]">{room.name}</span>
                                  <span className="text-[12px] font-bold text-[#718096] mt-0.5">Bldg {room.building} • {room.floor} • {room.type}</span>
                               </div>
                            </div>
                            <div className="grid grid-cols-3 pt-4 border-t border-slate-50">
                               <div className="flex flex-col items-start"><span className="text-[10px] font-black text-[#718096] uppercase mb-1">Rent</span><span className="text-[16px] font-black text-[#1A2B28]">{room.price}</span></div>
                               <div className="flex flex-col items-center border-x border-slate-50"><span className="text-[10px] font-black text-[#718096] uppercase mb-1">Vacancy</span><span className="text-[14px] font-bold text-[#1A2B28]">{room.available}/{room.beds}</span></div>
                               <div className="flex flex-col items-end"><span className="text-[10px] font-black text-[#718096] uppercase mb-1">Status</span><div className={`px-3 py-1 rounded-full text-[9px] font-black ${room.status === 'OCCUPIED' ? 'bg-red-50 text-red-500' : room.status === 'PARTIAL' ? 'bg-orange-50 text-orange-600' : 'bg-[#EBFBF8] text-[#008075]'}`}>{room.status}</div></div>
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
    <div className="min-h-screen bg-white font-body pb-12">
      <main className="px-6 pt-5 space-y-8">
        <div className="space-y-2 text-left">
          <h2 className="text-3xl font-black text-[#1A2B28]">Manage Rooms</h2>
          <p className="text-sm font-medium text-[#718096]">Monitor occupancy and room status</p>
        </div>

        <div className="grid gap-5">
          {isLoading && !cache.current.rooms ? (
             [...Array(3)].map((_, i) => (
              <div key={i} className="w-full bg-white p-7 rounded-[32px] border border-slate-50 flex items-center gap-6 animate-pulse">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
                <div className="flex flex-col gap-2">
                  <div className="w-32 h-5 bg-slate-100 rounded-lg"></div>
                  <div className="w-24 h-3 bg-slate-100 rounded-md"></div>
                </div>
              </div>
            ))
          ) : (
            <>
              <button onClick={() => router.push('/rooms/add')} className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]">
                <div className="bg-[#008075] text-white p-4.5 rounded-2xl shadow-lg shadow-[#008075]/10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/><line x1="15" y1="11" x2="21" y2="11"/><line x1="18" y1="8" x2="18" y2="14"/></svg>
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-xl font-black text-[#1A2B28]">Add New Room</span>
                  <span className="text-[12px] font-bold text-[#718096] mt-1">Expansion</span>
                </div>
              </button>

              <button onClick={() => switchView('list')} className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]">
                <div className="bg-[#00685F] text-white p-4.5 rounded-2xl shadow-lg shadow-[#00685F]/10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12H3"/><path d="M9 6l-6 6 6 6"/><path d="M15 18l6-6-6-6"/></svg>
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-xl font-black text-[#1A2B28]">Rooms List</span>
                  <span className="text-[12px] font-bold text-[#718096] mt-1">Management</span>
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

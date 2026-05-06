"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RoomsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState("menu"); // "menu", "list", "detail"
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const rooms = [
    { 
      id: 1, 
      name: "Room 302-B", 
      floor: "2nd Floor", 
      status: "OCCUPIED", 
      price: "₹18,500", 
      type: "DOUBLE - AC", 
      beds: 2, 
      available: 0,
      amenities: ["Wi-Fi", "AC", "Laundry", "Cleaning"],
      desc: "Premium double sharing room with attached balcony and modern amenities."
    },
    { 
      id: 2, 
      name: "Room 105-A", 
      floor: "1st Floor", 
      status: "PARTIAL", 
      price: "₹16,000", 
      type: "TRIPLE - Non AC", 
      beds: 3, 
      available: 1,
      amenities: ["Wi-Fi", "Laundry", "Backup"],
      desc: "Spacious triple sharing room close to the common dining area."
    },
    { 
      id: 3, 
      name: "Room 201-C", 
      floor: "2nd Floor", 
      status: "VACANT", 
      price: "₹12,000", 
      type: "SINGLE - Non AC", 
      beds: 1, 
      available: 1,
      amenities: ["Wi-Fi", "Cleaning"],
      desc: "Quiet single room perfect for students or working professionals."
    }
  ];

  useEffect(() => {
    setMounted(true);
    const v = searchParams.get('view');
    const id = searchParams.get('id');
    
    if (v === 'list') {
      setView('list');
    } else if (v === 'detail' && id) {
      const room = rooms.find(r => r.id === parseInt(id));
      if (room) {
        setSelectedRoom(room);
        setView('detail');
      }
    } else {
      setView('menu');
    }
  }, [searchParams]);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  // ==========================================
  // VIEW: ROOM DETAIL
  // ==========================================
  if (view === "detail" && selectedRoom) {
     return (
        <div className="min-h-screen bg-white animate-in slide-in-from-right duration-500 font-body pb-32">
           <header className="px-4 py-4 flex items-center gap-6 sticky top-0 bg-white z-50 border-b border-slate-50">
              <button onClick={() => router.push('?view=list')} className="text-[#00685F] active:scale-90 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              </button>
              <h1 className="text-xl font-black text-[#1A2B28]">Room Details</h1>
           </header>

           <main className="px-4 py-6 space-y-6">
              {/* Image / Hero */}
              <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-50 relative">
                 <div className="h-56 bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600" 
                      className="w-full h-full object-cover" 
                      alt="Room"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg">
                       <span className={`text-[10px] font-black tracking-widest uppercase ${
                         selectedRoom.status === 'OCCUPIED' ? 'text-red-500' : 
                         selectedRoom.status === 'PARTIAL' ? 'text-orange-500' : 'text-[#008075]'
                       }`}>{selectedRoom.status}</span>
                    </div>
                 </div>
                 <div className="p-8 text-center bg-white">
                    <h1 className="text-[22px] font-black text-[#1A2B28] mb-1">{selectedRoom.name}</h1>
                    <div className="flex items-center justify-center gap-2 text-[#718096]">
                       <span className="text-[12px] font-bold text-[#718096]">{selectedRoom.floor} • {selectedRoom.type}</span>
                    </div>
                 </div>
              </div>

              {/* Stats Card */}
              <div className="bg-[#F8FAFB] rounded-[32px] p-5 border border-slate-50 grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <p className="text-[12px] font-bold text-[#718096]">Monthly Rent</p>
                    <p className="text-[22px] font-black text-[#1A2B28]">{selectedRoom.price}</p>
                 </div>
                 <div className="space-y-1 border-l border-slate-200 pl-4">
                    <p className="text-[12px] font-bold text-[#718096]">Availability</p>
                    <p className="text-[22px] font-black text-[#1A2B28]">{selectedRoom.available}/{selectedRoom.beds}</p>
                 </div>
              </div>

              {/* Description */}
              <div className="bg-[#F8FAFB] rounded-[32px] p-5 border border-slate-50 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
                    <h3 className="text-[16px] font-black text-[#1A2B28]">Room Info</h3>
                 </div>
                 <p className="text-sm text-[#718096] leading-relaxed font-medium px-1">{selectedRoom.desc}</p>
              </div>

              {/* Amenities */}
              <div className="bg-[#F8FAFB] rounded-[32px] p-5 border border-slate-50 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
                    <h3 className="text-[16px] font-black text-[#1A2B28]">Amenities</h3>
                 </div>
                 <div className="flex flex-wrap gap-2.5">
                    {selectedRoom.amenities.map((item, i) => (
                       <div key={i} className="bg-white px-4 py-2 rounded-full border border-slate-50 shadow-sm text-[12px] font-bold text-[#00685F]">
                          {item}
                       </div>
                    ))}
                 </div>
              </div>
           </main>

           {/* Action Footer */}
           <footer className="px-4 pt-10 pb-20">
              <button 
                onClick={() => router.push('/rooms/edit')}
                className="w-full bg-[#00685F] py-5 rounded-[20px] text-white font-black text-[16px] shadow-xl shadow-teal-900/10 flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit Room Details
              </button>
           </footer>
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
           <header className="px-4 py-4 flex items-center gap-6 sticky top-0 bg-white z-50 border-b border-slate-50">
              <button onClick={() => router.push('/rooms')} className="text-[#00685F] active:scale-90 transition-transform">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              </button>
              <div className="flex flex-col">
                 <h1 className="text-xl font-black text-[#1A2B28]">Room List</h1>
                 <span className="text-[12px] font-bold text-[#008075] mt-0.5">{rooms.length} Total Units</span>
              </div>
           </header>

           <main className="px-6 py-8 space-y-8">
              <div className="space-y-2">
                 <h2 className="text-[22px] font-bold text-[#1A2B28]">Inventory Directory</h2>
                 <p className="text-[14px] font-medium text-[#718096]">Manage and monitor your property availability</p>
              </div>

              {/* Search Bar */}
              <div className="relative group">
                 <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ADB5BD] group-focus-within:text-[#008075] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                 </div>
                 <input 
                    type="text" 
                    placeholder="Search by room name or floor..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white pl-14 pr-6 py-5 rounded-[24px] border border-slate-200 outline-none focus:ring-2 focus:ring-[#008075]/20 focus:border-[#008075] transition-all text-[14px] font-medium text-[#1A2B28] shadow-sm"
                 />
              </div>

              <div className="space-y-5">
                 <h3 className="text-[20px] font-bold text-[#1A2B28]">Active Rooms ({filteredRooms.length})</h3>
                 
                 <div className="grid gap-4">
                    {filteredRooms.map((room) => (
                       <button 
                         key={room.id} 
                         onClick={() => router.push(`?view=detail&id=${room.id}`)}
                         className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm space-y-4 active:scale-[0.98] transition-all group w-full"
                       >
                          <div className="flex items-center gap-4">
                             <div className="w-11 h-11 bg-[#00685F] text-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                             </div>
                             <div className="flex flex-col text-left">
                                <span className="text-[16px] font-black text-[#1A2B28] group-hover:text-[#00685F] transition-colors">{room.name}</span>
                                <span className="text-[12px] font-bold text-[#718096] mt-0.5">{room.floor} • {room.type}</span>
                             </div>
                          </div>

                          <div className="grid grid-cols-3 pt-3 border-t border-slate-50">
                             <div className="flex flex-col items-start">
                                <span className="text-[10px] font-bold text-[#718096] mb-0.5">Rent</span>
                                <span className="text-[15px] font-black text-[#1A2B28]">{room.price}</span>
                             </div>
                             <div className="flex flex-col items-center">
                                <span className="text-[10px] font-bold text-[#718096] mb-0.5">Vacancy</span>
                                <span className="text-[13px] font-bold text-[#1A2B28]">{room.available}/{room.beds} <span className="text-[10px] text-[#718096] font-medium">Free</span></span>
                             </div>
                             <div className="flex flex-col items-end">
                                <div className="flex flex-col items-center min-w-[70px]">
                                   <span className="text-[10px] font-bold text-[#718096] mb-1">Status</span>
                                   <div className={`px-2.5 py-1 rounded-full text-[9px] font-black ${
                                     room.status === 'OCCUPIED' ? 'bg-red-50 text-red-500' : 
                                     room.status === 'PARTIAL' ? 'bg-orange-50 text-orange-600' : 'bg-[#EBFBF8] text-[#008075]'
                                   }`}>
                                      {room.status}
                                   </div>
                                </div>
                             </div>
                          </div>
                       </button>
                    ))}
                 </div>
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
      <header className="px-4 py-4 flex items-center gap-6 sticky top-0 bg-white z-50 border-b border-slate-50">
        <button onClick={() => router.push('/dashboard')} className="text-[#00685F] active:scale-90 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 className="text-xl font-black text-[#1A2B28]">Manage Property</h1>
      </header>

      <main className="px-6 pt-8 space-y-8">
        <div className="space-y-2 text-left">
          <h2 className="text-3xl font-black text-[#1A2B28]">Property Inventory</h2>
          <p className="text-sm font-medium text-[#718096]">Add rooms, view availability, and manage status</p>
        </div>

        <div className="grid gap-5 mt-10">
          <button 
            onClick={() => router.push('/rooms/add')}
            className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"
          >
            <div className={`bg-[#008075] text-white p-4.5 rounded-2xl shadow-lg shadow-[#008075]/10`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/><line x1="15" y1="11" x2="21" y2="11"/><line x1="18" y1="8" x2="18" y2="14"/></svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-black text-[#1A2B28]">Add Room</span>
              <span className="text-[12px] font-bold text-[#ABB3B8] mt-1">Expansion</span>
            </div>
          </button>

          <button 
            onClick={() => router.push("?view=list")}
            className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"
          >
            <div className={`bg-[#00685F] text-white p-4.5 rounded-2xl shadow-lg shadow-[#00685F]/10`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12H3"/><path d="M9 6l-6 6 6 6"/><path d="M15 18l6-6-6-6"/></svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-black text-[#1A2B28]">View Rooms</span>
              <span className="text-[12px] font-bold text-[#718096] mt-1">Occupancy Meta</span>
            </div>
          </button>

          <button 
            onClick={() => router.push('/rooms/remove')}
            className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"
          >
            <div className={`bg-red-500 text-white p-4.5 rounded-2xl shadow-lg shadow-red-500/10`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-black text-[#1A2B28]">Remove Room</span>
              <span className="text-[12px] font-bold text-[#ABB3B8] mt-1">Cleanup</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

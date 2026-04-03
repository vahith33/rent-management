"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RoomsPage() {
  const router = useRouter();
  const [view, setView] = useState("menu"); // "menu", "list", "detail"
  const [selectedRoom, setSelectedRoom] = useState(null);

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

  // ==========================================
  // VIEW: ROOM DETAIL
  // ==========================================
  if (view === "detail" && selectedRoom) {
     return (
        <div className="min-h-screen bg-[#F8FAFB] animate-in slide-in-from-right duration-500 font-sans pb-32">
           <header className="bg-white px-6 py-6 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-slate-50">
              <button onClick={() => setView("list")} className="p-2 -ml-2 text-[#00685F]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              </button>
              <h2 className="text-lg font-bold text-[#1A2B28] font-heading">Room Details</h2>
              <div className="w-10" />
           </header>

           <main className="px-5 py-8 space-y-8">
              {/* Image / Hero */}
              <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-50">
                 <div className="h-48 bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600" 
                      className="w-full h-full object-cover opacity-90" 
                      alt="Room"
                    />
                    <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-[10px] items-center flex font-black tracking-widest ${
                        selectedRoom.status === 'OCCUPIED' ? 'bg-red-500 text-white' : 
                        selectedRoom.status === 'PARTIAL' ? 'bg-orange-500 text-white' : 'bg-[#008075] text-white'
                      }`}>
                         {selectedRoom.status}
                    </div>
                 </div>
                 <div className="p-6 text-center">
                    <h1 className="text-2xl font-bold text-[#1A2B28]">{selectedRoom.name}</h1>
                    <p className="text-[11px] font-bold text-[#ABB3B8] uppercase tracking-widest mt-1">{selectedRoom.floor} • {selectedRoom.type}</p>
                 </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-5 rounded-2xl border-l-4 border-[#008075] shadow-sm">
                    <p className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-1">Monthly Rent</p>
                    <p className="text-xl font-bold text-[#1A2B28]">{selectedRoom.price}</p>
                 </div>
                 <div className="bg-white p-5 rounded-2xl border-l-4 border-teal-200 shadow-sm">
                    <p className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-1">Availability</p>
                    <p className="text-xl font-bold text-[#1A2B28]">{selectedRoom.available}/{selectedRoom.beds} Beds</p>
                 </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-50 space-y-3">
                 <h3 className="text-[12px] font-bold text-[#1A2B28] uppercase tracking-widest ml-1">Overall Info</h3>
                 <p className="text-sm text-[#718096] leading-relaxed font-medium">{selectedRoom.desc}</p>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-50 space-y-4">
                 <h3 className="text-[12px] font-bold text-[#1A2B28] uppercase tracking-widest ml-1">Amenities</h3>
                 <div className="flex flex-wrap gap-3">
                    {selectedRoom.amenities.map((item, i) => (
                       <div key={i} className="bg-[#F1F4F8] px-4 py-2 rounded-xl text-[12px] font-bold text-[#00685F]">
                          {item}
                       </div>
                    ))}
                 </div>
              </div>
           </main>

           {/* Action Footer */}
           <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-50 z-50">
              <button 
                onClick={() => router.push('/rooms/edit')}
                className="w-full bg-[#008075] py-5 rounded-[22px] text-white font-bold text-[16px] shadow-xl shadow-teal-900/10 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
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
    return (
       <div className="min-h-screen bg-[#F8FAFB] animate-in fade-in duration-500 font-sans pb-32">
          <header className="bg-white px-6 py-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
             <button onClick={() => setView("menu")} className="p-2 -ml-2 text-[#718096]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
             </button>
             <div className="flex flex-col items-center text-center px-4">
                <h1 className="text-[18px] font-bold text-[#1A2B28] leading-none uppercase tracking-widest">Inventory List</h1>
                <span className="text-[10px] font-bold text-[#008075] mt-2 uppercase tracking-widest">{rooms.length} TOTAL ROOMS</span>
             </div>
             <div className="w-10" />
          </header>

          <main className="p-6 space-y-4">
             {rooms.map((room) => (
                <div 
                  key={room.id} 
                  onClick={() => { setSelectedRoom(room); setView("detail"); }}
                  className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 space-y-6 active:scale-[0.98] cursor-pointer hover:shadow-md transition-all"
                >
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className={`w-14 h-14 ${room.status === 'OCCUPIED' ? 'bg-[#00675B]' : 'bg-slate-100'} rounded-2xl flex items-center justify-center shadow-sm`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={room.status === 'OCCUPIED' ? 'white' : '#718096'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xl font-bold text-[#1A2B28]">{room.name}</span>
                            <span className="text-[10px] font-bold text-[#ABB3B8] uppercase tracking-widest mt-0.5">{room.floor} • {room.type}</span>
                         </div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest ${
                        room.status === 'OCCUPIED' ? 'bg-red-50 text-red-500' : 
                        room.status === 'PARTIAL' ? 'bg-orange-50 text-orange-600' : 'bg-[#EBFBF8] text-[#008075]'
                      }`}>
                         {room.status}
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest">Pricing</span>
                         <span className="text-2xl font-bold text-[#1A2B28] mt-1">{room.price}</span>
                      </div>
                      <div className="text-right">
                         <span className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest block mb-1">Availability</span>
                         <span className="text-sm font-bold text-[#1A2B28]">{room.available}/{room.beds} Beds Free</span>
                      </div>
                   </div>
                </div>
             ))}
          </main>
       </div>
    );
  }

  // ==========================================
  // VIEW: MENU
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sans pb-12">
      <header className="bg-white px-6 py-6 flex items-center gap-4 shadow-sm sticky top-0 z-50">
        <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-[#F1F4F8] rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A2B28" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 className="text-xl font-bold text-[#1A2B28]">Manage Property</h1>
      </header>

      <main className="px-6 pt-8 space-y-8">
        <div className="space-y-2 text-left">
          <h2 className="text-3xl font-bold text-[#1A2B28]">Property Inventory</h2>
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
              <span className="text-xl font-bold text-[#1A2B28]">Add Room</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ABB3B8] mt-1">Expansion</span>
            </div>
          </button>

          <button 
            onClick={() => setView("list")}
            className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"
          >
            <div className={`bg-[#00685F] text-white p-4.5 rounded-2xl shadow-lg shadow-[#00685F]/10`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12H3"/><path d="M9 6l-6 6 6 6"/><path d="M15 18l6-6-6-6"/></svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold text-[#1A2B28]">View Rooms</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ABB3B8] mt-1">Occupancy Meta</span>
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
              <span className="text-xl font-bold text-[#1A2B28]">Remove Room</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ABB3B8] mt-1 font-body">Cleanup</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

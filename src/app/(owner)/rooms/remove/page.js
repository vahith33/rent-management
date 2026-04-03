"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RemoveRoomPage() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [rooms, setRooms] = useState([
    { id: 1, name: "Room 302-B", floor: "2nd Floor", status: "OCCUPIED" },
    { id: 2, name: "Room 105-A", floor: "1st Floor", status: "VACANT" },
    { id: 3, name: "Room 201-C", floor: "2nd Floor", status: "VACANT" }
  ]);

  const confirmDelete = (room) => {
    setRoomToDelete(room);
    setShowConfirm(true);
  };

  const executeDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setRooms(rooms.filter(r => r.id !== roomToDelete.id));
      setIsDeleting(false);
      setShowConfirm(false);
      setRoomToDelete(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sans pb-10">
      {/* Header */}
      <header className="bg-white px-6 py-6 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-slate-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-[#008075]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h1 className="text-[20px] font-bold text-[#1A2B28]">Remove Property</h1>
        </div>
      </header>

      <main className="px-6 py-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-[22px] font-bold text-red-500">Decommissioning</h2>
          <p className="text-sm text-[#718096] font-medium leading-relaxed">Select a room to permanently remove it from your inventory. This action cannot be undone.</p>
        </div>

        {/* Room List for Deletion */}
        <div className="space-y-4 pt-4">
          {rooms.length > 0 ? rooms.map((room) => (
            <div key={room.id} className="bg-white p-5 rounded-[28px] border border-slate-50 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 ${room.status === 'OCCUPIED' ? 'bg-[#EEF2F8]' : 'bg-red-50'} rounded-2xl flex items-center justify-center`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={room.status === 'OCCUPIED' ? '#718096' : '#EF4444'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                 </div>
                 <div>
                    <h3 className="font-bold text-[#1A2B28]">{room.name}</h3>
                    <p className="text-[10px] font-bold text-[#ABB3B8] uppercase tracking-widest">{room.floor} • {room.status}</p>
                 </div>
              </div>
              <button 
                disabled={room.status === 'OCCUPIED'}
                onClick={() => confirmDelete(room)}
                className={`p-3 rounded-xl transition-all ${
                  room.status === 'OCCUPIED' 
                    ? 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-50' 
                    : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white active:scale-95'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <div className="w-16 h-16 border-2 border-dashed border-slate-400 rounded-full mb-4"></div>
                <p className="font-bold text-sm">NO ROOMS FOUND</p>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 pt-4 text-center sm:p-0">
          <div className="fixed inset-0 bg-[#1A2B28]/40 backdrop-blur-sm transition-opacity" onClick={() => !isDeleting && setShowConfirm(false)}></div>
          
          <div className="relative inline-block w-full max-w-lg overflow-hidden bg-white px-6 pb-12 pt-10 text-left align-bottom transition-all transform sm:my-8 sm:align-middle rounded-t-[40px] sm:rounded-[40px] animate-in slide-in-from-bottom duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#1A2B28]">Confirm Removal</h3>
                <p className="text-[#718096] text-sm font-medium">Are you sure you want to remove <span className="text-[#1A2B28] font-bold">{roomToDelete?.name}</span>? This will permanently delete it from Sri Sai PG.</p>
              </div>

              <div className="w-full flex flex-col gap-3 pt-4">
                <button 
                  onClick={executeDelete}
                  disabled={isDeleting}
                  className="w-full bg-red-500 py-5 rounded-[22px] text-white font-bold text-[16px] shadow-xl shadow-red-900/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      DELETING...
                    </>
                  ) : "Yes, Delete Property"}
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                  className="w-full bg-[#f8fafb] py-5 rounded-[22px] text-[#718096] font-bold text-[16px] active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

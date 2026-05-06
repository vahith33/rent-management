"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RemoveRoomPage() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rooms, setRooms] = useState([
    { id: 1, name: "Room 302-B", floor: "2nd Floor", status: "OCCUPIED", price: "₹18,500", beds: 2, available: 0 },
    { id: 2, name: "Room 105-A", floor: "1st Floor", status: "VACANT", price: "₹16,000", beds: 3, available: 3 },
    { id: 3, name: "Room 201-C", floor: "2nd Floor", status: "VACANT", price: "₹12,000", beds: 1, available: 1 }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

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
    <div className="min-h-screen bg-white pb-12 font-body">
      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-6 sticky top-0 bg-white z-50 border-b border-slate-50">
        <button onClick={() => router.back()} className="text-[#00685F] active:scale-90 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className="text-xl font-black text-[#1A2B28]">Remove Room</h1>
      </header>

      <main className="px-6 py-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-red-500">Decommissioning</h2>
          <p className="text-[13px] font-medium text-[#718096] leading-relaxed">Select a room to permanently remove it from your inventory. This action cannot be undone.</p>
        </div>

        {/* Room List for Deletion */}
        <div className="grid gap-4 pt-4">
          {rooms.length > 0 ? rooms.map((room) => (
            <div key={room.id} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between group transition-all hover:border-red-100">
              <div className="flex items-center gap-4">
                 <div className="w-11 h-11 bg-[#00685F] text-white rounded-2xl flex items-center justify-center shadow-sm">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                 </div>
                 <div className="flex flex-col">
                    <h3 className="text-[14px] font-black text-[#1A2B28]">{room.name}</h3>
                    <p className="text-[11px] font-bold text-[#718096] mt-0.5">{room.floor} • {room.status}</p>
                 </div>
              </div>
              <button 
                disabled={room.status === 'OCCUPIED'}
                onClick={() => confirmDelete(room)}
                className={`p-3 rounded-xl transition-all shadow-sm ${
                  room.status === 'OCCUPIED' 
                    ? 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-40' 
                    : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white active:scale-90'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                <div className="w-16 h-16 border-2 border-dashed border-[#718096] rounded-full mb-4 flex items-center justify-center">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                </div>
                <p className="font-black text-sm text-[#718096]">NO ROOMS FOUND</p>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 pt-4 text-center sm:p-0">
          <div className="fixed inset-0 bg-[#1A2B28]/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={() => !isDeleting && setShowConfirm(false)}></div>
          
          <div className="relative inline-block w-full max-w-lg overflow-hidden bg-white px-6 pb-12 pt-10 text-left align-bottom transition-all transform sm:my-8 sm:align-middle rounded-t-[40px] sm:rounded-[40px] animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              
              <div className="space-y-2 px-4">
                <h3 className="text-2xl font-black text-[#1A2B28]">Confirm Removal</h3>
                <p className="text-[#718096] text-sm font-medium leading-relaxed">Are you sure you want to remove <span className="text-[#1A2B28] font-black">{roomToDelete?.name}</span>? This will permanently delete it from your property records.</p>
              </div>

              <div className="w-full flex flex-col gap-3 pt-4 px-2">
                <button 
                  onClick={executeDelete}
                  disabled={isDeleting}
                  className="w-full bg-red-500 py-5 rounded-[24px] text-white font-black text-[16px] shadow-xl shadow-red-900/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Removing...
                    </>
                  ) : "Yes, Delete Property"}
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                  className="w-full bg-[#f1f4f8] py-5 rounded-[24px] text-[#718096] font-black text-[16px] active:scale-95 transition-all"
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

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getRooms, removeRoom } from '@/actions/owner';

export default function RemoveRoomPage() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const confirmDelete = (room) => {
    setRoomToDelete(room);
    setShowConfirm(true);
  };

  const executeDelete = async () => {
    if (!roomToDelete) return;
    setIsDeleting(true);
    
    try {
      const result = await removeRoom(roomToDelete.id);
      if (result.success) {
        toast.success("Room removed successfully");
        setRooms(rooms.filter(r => r.id !== roomToDelete.id));
        setShowConfirm(false);
        setRoomToDelete(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to remove room");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-12 font-body">
      <main className="px-6 py-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <h2 className="text-[28px] font-black text-red-500 tracking-tight leading-tight">Decommissioning</h2>
          <p className="text-[14px] font-medium text-[#718096] leading-relaxed">Select a room to permanently remove it from your inventory. This action cannot be undone.</p>
        </div>

        {/* Room List for Deletion */}
        <div className="grid gap-4 pt-4">
          {isLoading ? (
            <div className="space-y-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="w-full h-24 bg-slate-50 rounded-[28px] animate-pulse"></div>
               ))}
            </div>
          ) : rooms.length > 0 ? rooms.map((room) => (
            <div key={room.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group transition-all hover:border-red-100 hover:shadow-lg">
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${room.status !== 'VACANT' ? 'bg-slate-100 text-slate-400' : 'bg-red-50 text-red-500'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                 </div>
                 <div className="flex flex-col">
                    <h3 className="text-[16px] font-black text-[#1A2B28]">{room.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                       <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">Floor {room.floor}</span>
                       <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                       <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">Building {room.building}</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest mt-1.5 inline-block ${
                      room.status === 'VACANT' ? 'text-emerald-500' : 
                      room.status === 'PARTIAL' ? 'text-amber-500' : 'text-red-500'
                    }`}>
                       {room.status}
                    </span>
                 </div>
              </div>
              <button 
                onClick={() => {
                  if (room.status !== 'VACANT') {
                    toast.error(`Cannot delete: This room is currently ${room.status.toLowerCase()}ly Occupied`);
                    return;
                  }
                  confirmDelete(room);
                }}
                className={`p-4 rounded-2xl transition-all shadow-sm ${
                  room.status !== 'VACANT' 
                    ? 'bg-slate-50 text-slate-300 opacity-40' 
                    : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white active:scale-90'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-white rounded-full mb-6 flex items-center justify-center shadow-sm">
                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
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
          
          <div className="relative inline-block w-full max-w-lg overflow-hidden bg-white px-8 pb-12 pt-12 text-left align-bottom transition-all transform sm:my-8 sm:align-middle rounded-t-[48px] sm:rounded-[48px] animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              
              <div className="space-y-3 px-2">
                <h3 className="text-[28px] font-black text-[#1A2B28] leading-tight">Confirm Removal</h3>
                <p className="text-[#718096] text-[15px] font-medium leading-relaxed">Are you sure you want to remove <span className="text-[#1A2B28] font-black underline decoration-red-200 underline-offset-4">{roomToDelete?.name}</span>? This will permanently delete it from your property records.</p>
                
                <div className="flex items-center justify-center gap-3 pt-2">
                   <div className="bg-slate-50 px-4 py-2 rounded-xl text-[12px] font-black text-[#718096] uppercase tracking-wider border border-slate-100">
                      {roomToDelete?.floor}
                   </div>
                   <div className="bg-slate-50 px-4 py-2 rounded-xl text-[12px] font-black text-[#718096] uppercase tracking-wider border border-slate-100">
                      Bldg {roomToDelete?.building}
                   </div>
                </div>
              </div>

              <div className="w-full flex flex-col gap-4 pt-4">
                <button 
                  onClick={executeDelete}
                  disabled={isDeleting}
                  className="w-full bg-red-500 py-6 rounded-[28px] text-white font-black text-[17px] shadow-2xl shadow-red-900/30 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Removing Room...
                    </>
                  ) : "Yes, Delete Permanently"}
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                  className="w-full bg-[#f1f4f8] py-6 rounded-[28px] text-[#718096] font-black text-[17px] active:scale-95 transition-all"
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

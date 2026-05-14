"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRooms, updateRoom, uploadRoomPhoto } from '@/actions/owner';
import { toast } from 'react-hot-toast';

function EditRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('id');

  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    room_number: '',
    building_number: '',
    floor: '',
    room_type: 'AC',
    capacity: 2,
    price: '',
    amenities: []
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [minCapacity, setMinCapacity] = useState(1);
  const [occupiedBeds, setOccupiedBeds] = useState([]); // Array of bed indices

  useEffect(() => {
    setMounted(true);
    if (roomId) {
      fetchRoomData();
    }
  }, [roomId]);

  const fetchRoomData = async () => {
    setIsLoading(true);
    const rooms = await getRooms();
    const room = rooms.find(r => String(r.id) === String(roomId));
    
    if (room) {
      const activeAssignments = room.assignments?.filter(ta => 
        String(ta.status).toUpperCase() === 'ACTIVE'
      ) || [];
      
      const occupiedIndices = activeAssignments.map(ta => {
        const parts = String(ta.bed_index).split('-');
        const lastPart = parts[parts.length - 1];
        return Number(lastPart);
      }).filter(n => !isNaN(n));
      
      const maxOccupiedIndex = occupiedIndices.length > 0 ? Math.max(...occupiedIndices) : 0;
      
      // If we have bed 3 occupied, min capacity must be at least 3
      setMinCapacity(maxOccupiedIndex);
      setOccupiedBeds(occupiedIndices);

      setFormData({
        room_number: room.room_number,
        building_number: room.building,
        floor: room.floor,
        room_type: room.type.includes('Non-AC') ? 'Non-AC' : 'AC',
        capacity: room.beds,
        price: room.rawPrice || room.price.replace(/[^0-9]/g, ''),
        amenities: room.amenities || []
      });
      if (room.image_url) {
        setPreviewUrl(room.image_url);
      }
    } else {
      toast.error("Room not found");
    }
    setIsLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpdate = async () => {
    if (!formData.room_number || !formData.price) {
      toast.error("Room Number and Price are required");
      return;
    }

    setIsSaving(true);
    setIsSaving(true);

    try {
      let image_url = previewUrl && !selectedFile ? previewUrl : null;
      
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        const uploadResult = await uploadRoomPhoto(uploadFormData);
        if (uploadResult.success) {
          image_url = uploadResult.url;
        } else {
          toast.error(`Photo upload failed: ${uploadResult.error}`);
          setIsSaving(false);
          return;
        }
      }

      const res = await updateRoom(roomId, { ...formData, image_url });
      if (res.success) {
        toast.success("Room updated successfully");
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/rooms?view=list');
          router.refresh();
        }, 1500);
      } else {
        toast.error(res.error || "Failed to update room");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted || isLoading) return (
    <div className="min-h-screen bg-white font-body">
      <header className="bg-white px-6 py-6 flex items-center gap-4 border-b border-slate-50">
        <div className="w-10 h-10 bg-slate-50 rounded-xl animate-pulse"></div>
        <div className="w-32 h-6 bg-slate-50 rounded animate-pulse"></div>
      </header>
      <main className="px-6 py-8 space-y-10">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-slate-100 rounded-full animate-pulse"></div>
              <div className="w-40 h-5 bg-slate-50 rounded animate-pulse"></div>
            </div>
            <div className="h-24 bg-[#F8FAFB] rounded-[32px] animate-pulse"></div>
          </div>
        ))}
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-body relative">
      <div className={`transition-all duration-500 ${showSuccess ? 'blur-md scale-[0.98]' : ''}`}>
        <header className="bg-white px-6 py-6 flex items-center justify-between sticky top-0 z-50 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 text-[#00685F] bg-[#EBFBF8] rounded-xl active:scale-90 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <h1 className="text-[20px] font-black text-[#1A2B28]">Edit Room</h1>
          </div>
          <div className="bg-[#EBFBF8] px-4 py-1.5 rounded-full border border-[#00685F]/10">
              <span className="text-[12px] font-black text-[#00685F] uppercase tracking-widest">{formData.room_number}</span>
          </div>
        </header>

        <main className="px-6 py-4 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
              <h2 className="text-[16px] font-black text-[#1A2B28]">Room Photo</h2>
            </div>
            
            <label className="relative block h-56 bg-[#F8FAFB] rounded-[32px] border-2 border-dashed border-slate-200 overflow-hidden group cursor-pointer hover:bg-[#EEF2F8] transition-all">
               {previewUrl ? (
                 <>
                   <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                     <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[12px] font-black text-[#1A2B28] shadow-lg">Change Photo</div>
                   </div>
                 </>
               ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                   <div className="w-12 h-12 bg-[#EBFBF8] rounded-full flex items-center justify-center text-[#00685F] shadow-sm transform group-hover:scale-110 transition-transform">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                         <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                         <circle cx="12" cy="13" r="4"/>
                      </svg>
                   </div>
                   <div className="text-center">
                      <p className="text-[14px] font-black text-[#1A2B28]">Add room photo</p>
                      <p className="text-[11px] font-bold text-[#718096] mt-1">JPG or PNG, max 5MB</p>
                   </div>
                 </div>
               )}
               <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
              <h2 className="text-[16px] font-black text-[#1A2B28]">Room Information</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Room Number</label>
                  <input 
                    type="text" 
                    value={formData.room_number}
                    onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                    className="w-full bg-[#F8FAFB] border border-slate-100 rounded-2xl p-4.5 text-[#1A2B28] outline-none text-[14px] font-bold focus:border-[#00685F]/30 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Building</label>
                  <input 
                    type="text" 
                    value={formData.building_number}
                    onChange={(e) => setFormData({...formData, building_number: e.target.value})}
                    className="w-full bg-[#F8FAFB] border border-slate-100 rounded-2xl p-4.5 text-[#1A2B28] outline-none text-[14px] font-bold focus:border-[#00685F]/30 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Floor</label>
                <input 
                    type="text" 
                    value={formData.floor}
                    onChange={(e) => setFormData({...formData, floor: e.target.value})}
                    className="w-full bg-[#F8FAFB] border border-slate-100 rounded-2xl p-4.5 text-[#1A2B28] outline-none text-[14px] font-bold focus:border-[#00685F]/30 transition-all"
                  />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Room Type</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setFormData({...formData, room_type: "AC"})}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all ${formData.room_type === "AC" ? 'bg-[#00685F] text-white shadow-lg shadow-[#00685F]/20' : 'bg-[#F8FAFB] text-[#718096] border border-slate-100'}`}
                  >
                    AC
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, room_type: "Non-AC"})}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all ${formData.room_type === "Non-AC" ? 'bg-[#00685F] text-white shadow-lg shadow-[#00685F]/20' : 'bg-[#F8FAFB] text-[#718096] border border-slate-100'}`}
                  >
                    Non-AC
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
              <h2 className="text-[16px] font-black text-[#1A2B28]">Bed Capacity</h2>
            </div>
            
            <div className="bg-[#F8FAFB] p-6 rounded-[32px] border border-slate-100">
               <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-50 flex items-center justify-between">
                  <div className="flex flex-col">
                     <span className="text-[16px] font-black text-[#1A2B28]">Total Beds</span>
                     <span className="text-[11px] font-black text-[#00685F] uppercase tracking-widest mt-1">
                        {formData.capacity === 1 ? 'Single Occupancy' : `${formData.capacity}-Sharing Unit`}
                     </span>
                  </div>
                  <div className="flex items-center gap-6">
                     <button 
                       onClick={() => {
                         if (formData.capacity <= minCapacity) {
                           toast.error(`Cannot remove occupied beds (Bed ${minCapacity} is occupied)`);
                           return;
                         }
                         setFormData(prev => ({...prev, capacity: Math.max(1, prev.capacity - 1)}));
                       }}
                       className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.capacity <= minCapacity ? 'bg-slate-50 text-slate-300' : 'bg-[#F1F4F8] text-[#1A2B28] active:scale-90'}`}
                     >
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                     </button>
                     <span className="text-[22px] font-black text-[#1A2B28] w-6 text-center">{formData.capacity}</span>
                     <button 
                       onClick={() => setFormData(prev => ({...prev, capacity: prev.capacity + 1}))}
                       className="w-12 h-12 bg-[#EBFBF8] rounded-2xl flex items-center justify-center text-[#00685F] active:scale-90 transition-transform"
                     >
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                     </button>
                  </div>
               </div>

               <div className="space-y-4 mt-6">
                  <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Bed Identification</label>
                   <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: formData.capacity }).map((_, i) => {
                       const isOccupied = occupiedBeds.includes(i + 1);
                       return (
                       <div key={i} className={`p-4 rounded-[22px] border flex items-center gap-4 shadow-sm animate-in zoom-in-95 duration-300 transition-all ${isOccupied ? 'bg-white border-teal-100 ring-1 ring-teal-50' : 'bg-white border-slate-50'}`}>
                          <div className={`p-2.5 rounded-xl ${isOccupied ? 'bg-[#00685F] text-white shadow-lg shadow-teal-900/10' : 'bg-[#EBFBF8] text-[#00685F]'}`}>
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 20v-2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"/>
                                <rect x="7" y="4" width="10" height="14" rx="3"/>
                                <path d="M2 11h20"/>
                             </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#718096] uppercase tracking-wider">Bed {i+1}</span>
                            <span className="text-[13px] font-black text-[#1A2B28] flex items-center gap-1.5">
                              {formData.building_number || '?'}-{formData.room_number || '?'}-{i+1}
                              {isOccupied && <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>}
                            </span>
                          </div>
                       </div>
                    );})}
                  </div>
               </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
              <h2 className="text-[16px] font-black text-[#1A2B28]">Pricing</h2>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#00685F] font-black">₹</div>
              <input 
                type="number" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full bg-[#F8FAFB] border border-slate-100 rounded-2xl pl-12 pr-24 py-5 text-[#1A2B28] font-black text-[18px] outline-none focus:border-[#00685F]/30 transition-all"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#718096] text-[14px] font-bold">/ Month</div>
            </div>
          </section>
        </main>

        <footer className="px-6 pt-10 pb-20">
          <button 
            onClick={handleUpdate}
            disabled={isSaving}
            className="w-full bg-[#00685F] py-5 rounded-[22px] text-white font-black text-[17px] shadow-xl shadow-teal-900/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                Updating...
              </>
            ) : "Save Changes"}
          </button>
        </footer>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-[#1A2B28]/40 backdrop-blur-xl"></div>
          <div className="relative bg-white w-full max-w-sm rounded-[48px] p-10 shadow-2xl flex flex-col items-center text-center space-y-8 animate-in zoom-in-95 duration-500 delay-100">
            <div className="w-24 h-24 bg-[#EBFBF8] rounded-full flex items-center justify-center relative">
               <div className="absolute inset-0 bg-[#00685F] rounded-full animate-ping opacity-10"></div>
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00685F" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                 <polyline points="20 6 9 17 4 12"/>
               </svg>
            </div>
            <div className="space-y-3">
               <h3 className="text-[28px] font-black text-[#1A2B28] leading-tight">Updated!</h3>
               <p className="text-[15px] font-medium text-[#718096] leading-relaxed px-2">Changes for Room {formData.room_number} have been saved successfully.</p>
            </div>
            <div className="w-12 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
               <div className="h-full bg-[#00685F] w-full origin-left animate-progress"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditRoomPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <EditRoomContent />
    </Suspense>
  );
}

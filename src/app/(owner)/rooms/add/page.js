"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom } from '@/actions/owner';

export default function AddRoomPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    room_number: '',
    building_number: '',
    floor: '',
    room_type: 'AC',
    sharing_type: '2-Sharing',
    capacity: 2,
    price: '',
    amenities: ['Wi-Fi', 'Housekeeping']
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async () => {
    if (!formData.room_number || !formData.price) {
      setError("Room Number and Price are required");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const sharing_type = formData.capacity === 1 ? "Single" : `${formData.capacity}-Sharing`;
      const result = await createRoom({ ...formData, sharing_type });
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/rooms');
          router.refresh();
        }, 1500);
      } else {
        setError(result.error || "Failed to save room");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAmenity = (name) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(name) 
        ? prev.amenities.filter(a => a !== name)
        : [...prev.amenities, name]
    }));
  };

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className={`min-h-screen bg-white pb-20 font-body transition-all duration-500 ${showSuccess ? 'blur-md scale-[0.98]' : ''}`}>

      {error && (
        <div className="mx-4 mt-4 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <main className="px-2 pt-6">
        {/* ROOM INFORMATION */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 border border-slate-50 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Room Information</h2>
          </div>

          <div className="space-y-5">
            <div className="flex gap-4">
               <div className="flex-[1.2] space-y-2">
                  <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Room Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 102"
                    value={formData.room_number}
                    onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                    className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] placeholder-[#ADB5BD] outline-none text-[14px] font-medium"
                  />
               </div>
               <div className="flex-1 space-y-2">
                  <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Building</label>
                  <input 
                    type="text" 
                    placeholder="e.g. A"
                    value={formData.building_number}
                    onChange={(e) => setFormData({...formData, building_number: e.target.value})}
                    className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] placeholder-[#ADB5BD] outline-none text-[14px] font-medium"
                  />
               </div>
            </div>
 
            <div className="space-y-2">
              <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Floor</label>
              <input 
                type="number" 
                placeholder="e.g. 1, 2, 3"
                value={formData.floor}
                onChange={(e) => setFormData({...formData, floor: e.target.value})}
                className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] placeholder-[#ADB5BD] outline-none text-[14px] font-medium"
              />
            </div>
 
            <div className="space-y-2">
              <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Room Type</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setFormData({...formData, room_type: "AC"})}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all ${formData.room_type === "AC" ? 'bg-white text-[#00685F] border-2 border-[#00685F]/20 shadow-sm' : 'bg-[#EEF2F8] text-[#718096]'}`}
                >
                  AC
                </button>
                <button 
                  onClick={() => setFormData({...formData, room_type: "Non-AC"})}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all ${formData.room_type === "Non-AC" ? 'bg-white text-[#00685F] border-2 border-[#00685F]/20 shadow-sm' : 'bg-[#EEF2F8] text-[#718096]'}`}
                >
                  Non-AC
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* BED CAPACITY */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 border border-slate-50 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28] ">Bed Capacity</h2>
          </div>
 
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-[26px] border-2 border-[#EBFBF8] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#1A2B28]">Total Beds</span>
                <span className="text-[10px] font-black text-[#00685F] uppercase tracking-widest mt-1">
                   {formData.capacity === 1 ? 'Single Occupancy' : `${formData.capacity}-Sharing Unit`}
                </span>
              </div>
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => setFormData(prev => ({...prev, capacity: Math.max(1, prev.capacity - 1)}))}
                  className="w-10 h-10 bg-[#EEF2F8] rounded-xl flex items-center justify-center text-[#1A2B28] active:scale-90 transition-transform"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <span className="text-xl font-bold text-[#1A2B28]">{formData.capacity}</span>
                <button 
                  onClick={() => setFormData(prev => ({...prev, capacity: prev.capacity + 1}))}
                  className="w-10 h-10 bg-[#EBFBF8] rounded-xl flex items-center justify-center text-[#00685F] active:scale-90 transition-transform"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </div>
 
            <div className="space-y-3 pt-2">
              <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Bed Identification</label>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: formData.capacity }).map((_, i) => (
                   <div key={i} className="bg-white p-4 rounded-[22px] border border-slate-50 flex items-center gap-4 shadow-sm">
                      <div className="bg-[#EBFBF8] p-2 rounded-lg text-[#00685F]">
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 20v-2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"/>
                            <rect x="7" y="4" width="10" height="14" rx="3"/>
                            <path d="M2 11h20"/>
                         </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#718096]">Bed {i+1}</span>
                        <span className="text-sm font-bold text-[#1A2B28]">
                          {formData.building_number || '?'}-{formData.room_number || '?'}-{i+1}
                        </span>
                      </div>
                   </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 border border-slate-50 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Pricing</h2>
          </div>
 
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#00685F] font-bold">₹</div>
            <input 
              type="number" 
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full bg-[#EEF2F8] border-none rounded-2xl pl-12 pr-24 py-5 text-[#1A2B28] font-bold text-[18px] outline-none"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#718096] text-[14px] font-bold">/ Month</div>
          </div>
        </section>
 
        {/* AMENITIES */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 border border-slate-50 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Amenities</h2>
          </div>
 
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'wifi', name: 'Wi-Fi', icon: 'M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01' },
              { id: 'house', name: 'Housekeeping', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10' },
              { id: 'laundry', name: 'Laundry', icon: 'M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z' },
              { id: 'backup', name: 'Backup', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
              { id: 'tv', name: 'TV', icon: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM12 18h.01' }
            ].map(amenity => (
              <button 
                key={amenity.id} 
                onClick={() => toggleAmenity(amenity.name)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all ${formData.amenities.includes(amenity.name) ? 'bg-[#EBFBF8] border-[#00685F]/20 shadow-sm' : 'bg-white border-slate-50 shadow-sm opacity-60'}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={formData.amenities.includes(amenity.name) ? "#00685F" : "#718096"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d={amenity.icon} />
                </svg>
                <span className={`text-[13px] font-bold ${formData.amenities.includes(amenity.name) ? 'text-[#00685F]' : 'text-[#1A2B28]'}`}>{amenity.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ROOM PHOTOS */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 border border-slate-50 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Room Photos</h2>
          </div>
 
          <div className="w-full h-56 border-2 border-dashed border-[#DEE3E8] rounded-[24px] bg-white flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-[#EEF2F8] transition-all">
             <div className="bg-[#EBFBF8] p-5 rounded-full text-[#00685F] shadow-sm transform group-hover:scale-110 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                   <circle cx="12" cy="13" r="4"/>
                </svg>
             </div>
             <div className="text-center">
                <p className="text-[16px] font-bold text-[#1A2B28]">Upload Images</p>
                <p className="text-[13px] font-bold text-[#718096] mt-1">PNG, JPG up to 10MB</p>
             </div>
          </div>
        </section>
      </main>

      {/* Footer Action */}
      <footer className="px-4 pt-10 pb-10 flex gap-4">
        <button 
          onClick={() => router.back()}
          className="flex-1 bg-[#EEF2F8] py-5 rounded-[20px] text-[#1A2B28] font-bold text-[16px] hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-[1.5] bg-[#00685F] py-5 rounded-[20px] text-white font-black text-[16px] shadow-xl shadow-teal-900/10 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-70"
        >
          {isSaving ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving Room...
            </>
          ) : (
            "Save Room"
          )}
        </button>
      </footer>

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
               <h3 className="text-[28px] font-black text-[#1A2B28] leading-tight">Excellent!</h3>
               <p className="text-[15px] font-medium text-[#718096] leading-relaxed px-2">Room {formData.room_number} has been successfully added to your inventory.</p>
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

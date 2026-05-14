"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createTenant, updateTenant } from '@/actions/owner';
import { toast } from 'react-hot-toast';

function AddTenantForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Form State - Initialize from searchParams if available
  const [formData, setFormData] = useState({
    name: searchParams.get('name') || '',
    phone: searchParams.get('phone') || '',
    gender: searchParams.get('gender') || 'Male',
    rent: searchParams.get('rent') || '',
    deposit: searchParams.get('deposit') || '',
    move_in_date: searchParams.get('move_in_date') || new Date().toISOString().split('T')[0],
    agreement_period: searchParams.get('agreement_period') || '11 Months',
    id_type: searchParams.get('id_type') || 'Aadhaar',
    id_number: searchParams.get('id_number') || '',
    emergency_contact_name: searchParams.get('emergency_contact_name') || '',
    emergency_contact_phone: searchParams.get('emergency_contact_phone') || '',
    due_day: searchParams.get('due_day') || '1',
    roomId: searchParams.get('selectedRoomId') || '',
    bedId: searchParams.get('selectedBedId') || ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync searchParams into formData when they change (returning from selection)
  useEffect(() => {
    if (searchParams.get('selectedRoomId')) {
      setFormData(prev => ({
        ...prev,
        roomId: searchParams.get('selectedRoomId') || prev.roomId,
        bedId: searchParams.get('selectedBedId') || prev.bedId
      }));
    }
  }, [searchParams]);

  // Logical Part: Auto-fetch rent and agreement when room is selected
  useEffect(() => {
    if (formData.roomId) {
      const fetchRoomDetails = async () => {
        const { getRooms } = await import('@/actions/owner');
        const rooms = await getRooms();
        const room = rooms.find(r => String(r.id) === String(formData.roomId));
        
        if (room) {
          setFormData(prev => ({ 
            ...prev, 
            rent: prev.rent || room.rawPrice, // Don't override if already set (especially in edit mode)
            agreement_period: prev.agreement_period || (room.sharing_type ? 'Monthly' : '11 Months')
          }));
        }
      };
      fetchRoomDetails();
    }
  }, [formData.roomId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = true;
    if (!formData.phone) newErrors.phone = true;
    if (!formData.gender) newErrors.gender = true;
    if (!formData.rent) newErrors.rent = true;
    if (!formData.deposit) newErrors.deposit = true;
    if (!formData.move_in_date) newErrors.move_in_date = true;
    if (!formData.roomId) newErrors.roomId = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Please fill all mandatory fields (marked with *)");
      return;
    }

    setIsSaving(true);
    setIsSaving(true);
    
    try {
      const result = editId 
        ? await updateTenant(editId, formData)
        : await createTenant(formData);
      
      if (result.success) {
        toast.success(editId ? "Resident updated successfully" : "Resident onboarded successfully");
        setShowSuccess(true);
        setTimeout(() => {
          router.push(editId ? `/tenants?view=detail&id=${editId}` : '/tenants');
          router.refresh();
        }, 1500);
      } else {
        toast.error(result.error || "Failed to save tenant");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const navigateToSelection = () => {
    const params = new URLSearchParams(formData);
    // Ensure we use the correct param names for the selection pages
    params.set('selectedRoomId', formData.roomId);
    params.set('selectedBedId', formData.bedId);
    router.push(`/tenants/add/select-room?${params.toString()}`);
  };

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white relative">
      {/* Success Overlay - Outside the blurred container */}
      {showSuccess && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-6 text-center bg-white/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 flex flex-col items-center gap-6 shadow-[0_20px_70px_rgba(0,0,0,0.15)] border border-[#006E65]/5 animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-[#EBFBF8] rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[#006E65]/5 rounded-full animate-ping"></div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#006E65" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><polyline points="20 6 9 17 4 12"/></svg>
             </div>
             <div>
                <h3 className="text-2xl font-black text-[#1A2B28]">Tenant Added!</h3>
                <p className="text-sm font-medium text-[#718096] mt-2">New resident successfully onboarded.</p>
             </div>
          </div>
        </div>
      )}

      <div className={`transition-all duration-500 ${showSuccess ? 'blur-xl scale-[0.95] opacity-40' : ''}`}>

      <main className="px-4 space-y-4  font-body">
        {/* PERSONAL DETAILS SECTION */}
        <section className="bg-[#F8FAFB] rounded-[28px] p-5 space-y-4 border border-slate-100/50">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Personal Details</h2>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-[#1A2B28] ml-1">
              Full Name <span className="text-red-500 font-black">*</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g. Alexander Mitchell"
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                if (errors.name) setErrors({...errors, name: false});
              }}
              className={`w-full bg-[#EEF2F8] border-none rounded-xl p-4 text-[#1A2B28] placeholder-[#ADB5BD] outline-none ring-2 transition-all ${
                errors.name ? 'ring-red-500/50 bg-red-50/30' : 'ring-transparent focus:ring-[#008075]/20'
              }`}
            />
          </div>

          <div className="flex gap-3">
             <div className="flex-1 space-y-1.5">
                  <label className="text-[12px] font-bold text-[#1A2B28] ml-1">
                    Phone <span className="text-red-500 font-black">*</span>
                  </label>
                <input 
                  type="tel" 
                  placeholder="+91 90000 00000" 
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({...formData, phone: e.target.value});
                    if (errors.phone) setErrors({...errors, phone: false});
                  }}
                  className={`w-full bg-[#EEF2F8] border-none rounded-xl p-4 text-[#1A2B28] outline-none ring-2 transition-all ${
                    errors.phone ? 'ring-red-500/50 bg-red-50/30' : 'ring-transparent focus:ring-[#008075]/20'
                  }`} 
                />
             </div>
             <div className="flex-1 space-y-1.5">
                  <label className="text-[12px] font-bold text-[#1A2B28] ml-1">
                    Gender <span className="text-red-500 font-black">*</span>
                  </label>
                <div className="relative">
                  <select 
                    value={formData.gender}
                    onChange={(e) => {
                      setFormData({...formData, gender: e.target.value});
                      if (errors.gender) setErrors({...errors, gender: false});
                    }}
                    className={`w-full bg-[#EEF2F8] border-none rounded-xl p-4 text-[#1A2B28] outline-none appearance-none font-bold ring-2 transition-all ${
                      errors.gender ? 'ring-red-500/50 bg-red-50/30' : 'ring-transparent focus:ring-[#008075]/20'
                    }`}
                  >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#718096]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* ROOM ASSIGNMENT SECTION */}
        <section className="bg-[#F8FAFB] rounded-[28px] p-5 space-y-4 border border-slate-100/50">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Room Assignment</h2>
          </div>
          
          <div className="space-y-1.5">
             <label className="text-[12px] font-bold text-[#1A2B28] ml-1">
               Allocation Status <span className="text-red-500 font-black">*</span>
             </label>
             <button 
               onClick={navigateToSelection}
               className={`w-full p-4 rounded-xl flex items-center justify-between transition-all group active:scale-[0.98] ring-2 ${
                 errors.roomId ? 'ring-red-500/50 bg-red-50/30' : 'ring-transparent'
               } ${
                 formData.roomId && !errors.roomId ? 'bg-[#EBFBF8] ring-2 ring-[#00685F]/10 shadow-sm' : 'bg-[#EEF2F8]'
               }`}
             >
                <div className="flex items-center gap-4">
                   <div className={`p-2.5 rounded-xl transition-all ${
                     formData.roomId ? 'bg-[#00685F] text-white' : 'bg-white/50 text-[#00685F]'
                   }`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/>
                      </svg>
                   </div>
                   <div className="flex flex-col text-left">
                      <span className="text-[14px] font-black text-[#1A2B28] leading-tight">
                        {formData.bedId ? `Bed ${formData.bedId.split('-').pop()}` : formData.roomId ? `Suite Selected` : 'Click to Allocate'}
                      </span>
                      {formData.roomId && (
                        <span className="text-[9px] font-bold text-[#008075] uppercase tracking-widest mt-0.5">
                          Allocation Secured
                        </span>
                      )}
                   </div>
                </div>
                <div className={`transition-all ${formData.roomId ? 'text-[#00685F]' : 'text-[#ADB5BD]'} group-hover:translate-x-1`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
             </button>
          </div>
        </section>

        {/* FINANCIAL & STAY DETAILS */}
        <section className="bg-[#F8FAFB] rounded-[28px] p-5 space-y-4 border border-slate-100/50">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Financial & Stay</h2>
          </div>
          
          <div className="flex gap-3">
             <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[12px] font-bold text-[#1A2B28]">
                      Rent <span className="text-red-500 font-black">*</span>
                    </label>
                    {formData.roomId && (
                       <span className="text-[9px] font-bold text-[#008075] uppercase">Auto</span>
                    )}
                  </div>
                <input 
                  type="number" 
                  placeholder="₹0.00" 
                  value={formData.rent}
                  onChange={(e) => {
                    setFormData({...formData, rent: e.target.value});
                    if (errors.rent) setErrors({...errors, rent: false});
                  }}
                  className={`w-full border-none rounded-xl p-4 text-[#1A2B28] outline-none transition-all ring-2 ${
                    errors.rent ? 'ring-red-500/50 bg-red-50/30' : 'ring-transparent focus:ring-[#008075]/20'
                  } ${
                    formData.roomId && !errors.rent ? 'bg-[#EBFBF8] ring-2 ring-[#00685F]/5' : 'bg-[#EEF2F8]'
                  }`} 
                />
             </div>
             <div className="flex-1 space-y-1.5">
                  <label className="text-[12px] font-bold text-[#1A2B28] ml-1">
                    Deposit <span className="text-red-500 font-black">*</span>
                  </label>
                <input 
                  type="number" 
                  placeholder="₹0.00" 
                  value={formData.deposit}
                  onChange={(e) => {
                    setFormData({...formData, deposit: e.target.value});
                    if (errors.deposit) setErrors({...errors, deposit: false});
                  }}
                  className={`w-full bg-[#EEF2F8] border-none rounded-xl p-4 text-[#1A2B28] outline-none ring-2 transition-all ${
                    errors.deposit ? 'ring-red-500/50 bg-red-50/30' : 'ring-transparent focus:ring-[#008075]/20'
                  }`} 
                />
             </div>
          </div>

          <div className="flex gap-3">
             <div className="flex-1 space-y-1.5">
                  <label className="text-[12px] font-bold text-[#1A2B28] ml-1">
                    Move-in <span className="text-red-500 font-black">*</span>
                  </label>
                <input 
                  type="date" 
                  value={formData.move_in_date}
                  onChange={(e) => {
                    setFormData({...formData, move_in_date: e.target.value});
                    if (errors.move_in_date) setErrors({...errors, move_in_date: false});
                  }}
                  className={`w-full bg-[#EEF2F8] border-none rounded-xl p-4 text-[#1A2B28] outline-none ring-2 transition-all ${
                    errors.move_in_date ? 'ring-red-500/50 bg-red-50/30' : 'ring-transparent focus:ring-[#008075]/20'
                  }`} 
                />
             </div>
             <div className="flex-1 space-y-1.5">
                  <label className="text-[12px] font-bold text-[#1A2B28] ml-1">Due Date <span className="text-red-500 font-black">*</span></label>
                <div className="relative">
                  <select 
                    value={formData.due_day}
                    onChange={(e) => setFormData({...formData, due_day: e.target.value})}
                    className={`w-full border-none rounded-xl p-4 text-[#1A2B28] outline-none appearance-none font-bold transition-all ${
                      formData.roomId ? 'bg-[#EBFBF8] ring-2 ring-[#00685F]/5' : 'bg-[#EEF2F8]'
                    }`}
                  >
                    {[...Array(31)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#718096]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
             </div>
          </div>

          <div className="space-y-1.5">
               <label className="text-[12px] font-bold text-[#1A2B28] ml-1">Agreement Period</label>
             <div className="relative">
               <select 
                 value={formData.agreement_period}
                 onChange={(e) => setFormData({...formData, agreement_period: e.target.value})}
                 className={`w-full border-none rounded-xl p-4 text-[#1A2B28] outline-none appearance-none font-bold transition-all ${
                   formData.roomId ? 'bg-[#EBFBF8] ring-2 ring-[#00685F]/5' : 'bg-[#EEF2F8]'
                 }`}
               >
                 <option>11 Months</option>
                 <option>12 Months</option>
                 <option>6 Months</option>
                 <option>Monthly</option>
               </select>
               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#718096]">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
               </div>
             </div>
          </div>
        </section>

        {/* VERIFICATION SECTION */}
        <section className="bg-[#F8FAFB] rounded-[28px] p-5 space-y-4 border border-slate-100/50">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Verification</h2>
          </div>
          <div className="flex gap-3">
             <div className="flex-1 space-y-1.5">
                  <label className="text-[12px] font-bold text-[#1A2B28] ml-1">ID Type</label>
                <div className="relative">
                  <select 
                    value={formData.id_type}
                    onChange={(e) => setFormData({...formData, id_type: e.target.value})}
                    className="w-full bg-[#EEF2F8] border-none rounded-xl p-4 text-[#1A2B28] outline-none appearance-none font-bold"
                  >
                    <option>Aadhaar</option>
                    <option>PAN Card</option>
                    <option>Passport</option>
                    <option>Voter ID</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#718096]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
             </div>
             <div className="flex-1 space-y-1.5">
                  <label className="text-[12px] font-bold text-[#1A2B28] ml-1">ID Number</label>
                <input 
                  type="text" 
                  placeholder="ID Number" 
                  value={formData.id_number}
                  onChange={(e) => setFormData({...formData, id_number: e.target.value})}
                  className="w-full bg-[#EEF2F8] border-none rounded-xl p-4 text-[#1A2B28] outline-none font-bold" 
                />
             </div>
          </div>
        </section>

        {/* EMERGENCY CONTACT */}
        <section className="bg-[#F8FAFB] rounded-[28px] p-5 space-y-4 border border-slate-100/50">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Emergency Contact</h2>
          </div>
          <div className="space-y-4">
             <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#1A2B28] ml-1">Contact Name</label>
                <input 
                  type="text" 
                  placeholder="Full name" 
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                  className="w-full bg-[#EEF2F8] border-none rounded-xl p-4 text-[#1A2B28] outline-none font-bold" 
                />
             </div>
             <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#1A2B28] ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+91 90000 00000" 
                  value={formData.emergency_contact_phone}
                  onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                  className="w-full bg-[#EEF2F8] border-none rounded-xl p-4 text-[#1A2B28] outline-none font-bold" 
                />
             </div>
          </div>
        </section>
      </main>

      <footer className="px-4 py-8 flex gap-3">
        <button 
          type="button"
          onClick={() => router.replace('/tenants')}
          className="flex-1 py-4 rounded-[20px] bg-[#F1F4F8] text-[#1A2B28] font-bold hover:bg-slate-200 transition-all active:scale-[0.98]"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className={`flex-[1.5] bg-[#00685F] p-4 rounded-[20px] text-white font-bold shadow-lg shadow-teal-900/10 flex items-center justify-center gap-2 transition-all ${isSaving ? 'opacity-80 scale-95' : 'active:scale-[0.98]'}`}
        >
          {isSaving ? (
            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            'Onboard Resident'
          )}
        </button>
      </footer>
    </div>
  </div>
);
}

export default function AddTenantPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <AddTenantForm />
    </Suspense>
  );
}

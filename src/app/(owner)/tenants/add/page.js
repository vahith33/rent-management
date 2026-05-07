"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createTenant } from '@/actions/owner';

function AddTenantForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    roomId: searchParams.get('selectedRoomId') || '',
    bedId: searchParams.get('selectedBedId') || ''
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.phone) {
      setError("Name and Phone are required");
      return;
    }

    setIsSaving(true);
    setError(null);
    
    try {
      const result = await createTenant(formData);
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/tenants');
          router.refresh();
        }, 1500);
      } else {
        setError(result.error || "Failed to save tenant");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const navigateToSelection = () => {
    const params = new URLSearchParams(formData);
    router.push(`/tenants/add/select-room?${params.toString()}`);
  };

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className={`min-h-screen bg-white pb-20 transition-all duration-500 ${showSuccess ? 'blur-md scale-[0.98]' : ''}`}>
      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-6 text-center">
          <div className="bg-white rounded-[40px] p-10 flex flex-col items-center gap-6 shadow-2xl border border-[#006E65]/5 animate-in zoom-in duration-500">
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

      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <main className="px-4 space-y-4 pt-6 font-body">
        {/* PERSONAL DETAILS SECTION */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 space-y-5 border border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Personal Details</h2>
          </div>
          
          <div className="space-y-2">
            <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Alexander Mitchell"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] placeholder-[#ADB5BD] outline-none"
            />
          </div>

          <div className="flex gap-4">
             <div className="flex-1 space-y-2">
                 <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Phone</label>
                <input 
                  type="tel" 
                  placeholder="+91 90000 00000" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none" 
                />
             </div>
             <div className="flex-1 space-y-2">
                 <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Gender</label>
                <div className="relative">
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none appearance-none font-medium"
                  >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#718096]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* FINANCIAL & STAY DETAILS */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 space-y-5 border border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Financial & Stay</h2>
          </div>
          
          <div className="flex gap-4">
             <div className="flex-1 space-y-2">
                 <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Monthly Rent</label>
                <input 
                  type="number" 
                  placeholder="₹0.00" 
                  value={formData.rent}
                  onChange={(e) => setFormData({...formData, rent: e.target.value})}
                  className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none" 
                />
             </div>
             <div className="flex-1 space-y-2">
                 <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Security Deposit</label>
                <input 
                  type="number" 
                  placeholder="₹0.00" 
                  value={formData.deposit}
                  onChange={(e) => setFormData({...formData, deposit: e.target.value})}
                  className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none" 
                />
             </div>
          </div>

          <div className="flex gap-4">
             <div className="flex-1 space-y-2">
                 <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Move-in Date</label>
                <input 
                  type="date" 
                  value={formData.move_in_date}
                  onChange={(e) => setFormData({...formData, move_in_date: e.target.value})}
                  className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none" 
                />
             </div>
             <div className="flex-1 space-y-2">
                 <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Agreement</label>
                <select 
                  value={formData.agreement_period}
                  onChange={(e) => setFormData({...formData, agreement_period: e.target.value})}
                  className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none appearance-none font-medium"
                >
                  <option>11 Months</option>
                  <option>12 Months</option>
                  <option>6 Months</option>
                  <option>Monthly</option>
                </select>
             </div>
          </div>
        </section>

        {/* ROOM ASSIGNMENT SECTION */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 space-y-5 border border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Room Assignment</h2>
          </div>
          
          <div className="pt-2">
             <button 
               onClick={navigateToSelection}
               className={`w-full p-5 rounded-[26px] flex items-center justify-between border-2 transition-all group active:scale-[0.98] ${
                 formData.roomId ? 'bg-white border-[#00685F]/20 shadow-sm' : 'bg-white border-[#EBFBF8] hover:border-[#00685F]/30'
               }`}
             >
                <div className="flex items-center gap-5">
                   <div className={`p-3.5 rounded-2xl shadow-sm transform group-hover:scale-105 transition-transform ${
                     formData.roomId ? 'bg-[#00685F] text-white' : 'bg-[#EBFBF8] text-[#00685F]'
                   }`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18"/>
                        <path d="M5 21V7l7-4 7 4v14"/>
                        <path d="M9 21v-6h6v6"/>
                      </svg>
                   </div>
                   <div className="flex flex-col text-left">
                      <span className="text-[15px] font-black text-[#1A2B28]">
                        {formData.bedId ? `Bed ${formData.bedId}` : formData.roomId ? `Suite Selected` : 'Select Suite'}
                      </span>
                      <span className={`text-[12px] font-black mt-1.5 leading-none uppercase tracking-widest ${
                        formData.roomId ? 'text-[#00685F]' : 'text-[#ADB5BD]'
                      }`}>
                        {formData.roomId ? 'Live Allocation Ready' : 'Room Allocation Tool'}
                      </span>
                   </div>
                </div>
                <div className={`transition-all ${formData.roomId ? 'text-[#00685F]' : 'text-[#ADB5BD]'} group-hover:translate-x-1`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
             </button>
          </div>
        </section>

        {/* VERIFICATION SECTION */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 space-y-5 border border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Identity Verification</h2>
          </div>
          <div className="flex gap-4">
             <div className="flex-1 space-y-2">
                 <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">ID Type</label>
                <div className="relative">
                  <select 
                    value={formData.id_type}
                    onChange={(e) => setFormData({...formData, id_type: e.target.value})}
                    className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none appearance-none font-medium"
                  >
                    <option>Aadhaar</option>
                    <option>PAN Card</option>
                    <option>Passport</option>
                    <option>Voter ID</option>
                    <option>Driving License</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#718096]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
             </div>
             <div className="flex-1 space-y-2">
                 <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">ID Number</label>
                <input 
                  type="text" 
                  placeholder="ID Number" 
                  value={formData.id_number}
                  onChange={(e) => setFormData({...formData, id_number: e.target.value})}
                  className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none font-medium" 
                />
             </div>
          </div>
        </section>

        {/* EMERGENCY CONTACT */}
        <section className="bg-[#F8FAFB] rounded-[32px] p-5 space-y-5 border border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00685F] rounded-full"></div>
            <h2 className="text-[16px] font-black text-[#1A2B28]">Emergency Contact</h2>
          </div>
          <div className="space-y-4">
             <div className="space-y-2">
                 <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Contact Name</label>
                <input 
                  type="text" 
                  placeholder="Full name of contact" 
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                  className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none font-medium" 
                />
             </div>
             <div className="space-y-2">
                 <label className="text-[13px] font-black text-[#1A2B28] block pb-1 ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+91 90000 00000" 
                  value={formData.emergency_contact_phone}
                  onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                  className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4.5 text-[#1A2B28] outline-none font-medium" 
                />
             </div>
          </div>
        </section>
      </main>

      <footer className="px-4 pt-10 pb-10 flex gap-4">
        <button 
          onClick={() => router.back()} 
          className="flex-1 bg-[#EEF2F8] p-5 rounded-[24px] text-[#1A2B28] font-black hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className={`flex-[1.2] bg-[#00685F] p-5 rounded-[24px] text-white font-black shadow-2xl shadow-teal-900/10 flex items-center justify-center gap-3 transition-all ${isSaving ? 'opacity-80 scale-95' : 'active:scale-95'}`}
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              Finalizing...
            </>
          ) : (
            'Onboard Resident'
          )}
        </button>
      </footer>
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

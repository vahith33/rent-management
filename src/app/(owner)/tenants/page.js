"use client";

import { useState, useEffect, useTransition, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getTenants, removeTenant } from '@/actions/owner';

export default function TenantsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState(() => searchParams.get('view') || "menu");
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const hasFetchedRef = useRef(false);

  // Fetch tenants only when needed (list or detail view)
  const fetchTenantsIfNeeded = useCallback(async () => {
    if (hasFetchedRef.current) return tenants;
    setLoading(true);
    const data = await getTenants();
    setTenants(data);
    setLoading(false);
    hasFetchedRef.current = true;
    return data;
  }, []);

  // Sync URL → view and handle detail selection
  useEffect(() => {
    const v = searchParams.get('view');
    const id = searchParams.get('id');

    if (v === 'list') {
      setView('list');
      fetchTenantsIfNeeded();
    } else if (v === 'detail' && id) {
      fetchTenantsIfNeeded().then(data => {
        const tenant = data.find(t => t.id === id || t.id === parseInt(id));
        if (tenant) {
          setSelectedTenant(tenant);
          setView('detail');
        }
      });
    } else {
      setView('menu');
      setLoading(false);
    }
  }, [searchParams]);

  // Instant view switcher — no router.push overhead
  const switchView = useCallback((newView, params = '') => {
    const url = params ? `/tenants?view=${newView}&${params}` : (newView === 'menu' ? '/tenants' : `/tenants?view=${newView}`);
    window.history.pushState(null, '', url);

    if (newView === 'list' || newView === 'detail') {
      fetchTenantsIfNeeded();
    }

    startTransition(() => {
      setView(newView);
    });
  }, [fetchTenantsIfNeeded]);

  const handleRemove = async () => {
    if (!confirm(`Are you sure you want to remove ${selectedTenant.name}?`)) return;
    
    const result = await removeTenant(selectedTenant.id);
    if (result.success) {
      router.push('?view=list');
      router.refresh();
      // Also update local state
      setTenants(tenants.filter(t => t.id !== selectedTenant.id));
    } else {
      alert("Failed to remove tenant: " + result.error);
    }
  };

  const handleEdit = () => {
    const activeAssignment = selectedTenant.tenant_assignments?.find(ta => ta.status === 'ACTIVE') || selectedTenant.tenant_assignments?.[0];
    const params = new URLSearchParams({
      id: selectedTenant.id,
      name: selectedTenant.name || '',
      phone: selectedTenant.phone || '',
      gender: selectedTenant.gender || 'Male',
      rent: String(selectedTenant.rent || '').replace(/[^\d]/g, ''),
      deposit: String(selectedTenant.deposit || '').replace(/[^\d]/g, ''),
      move_in_date: selectedTenant.move_in_date || '',
      agreement_period: selectedTenant.agreement_period || '11 Months',
      id_type: selectedTenant.id_type || 'Aadhaar',
      id_number: selectedTenant.id_number || '',
      emergency_contact_name: selectedTenant.emergency_contact_name || '',
      emergency_contact_phone: selectedTenant.emergency_contact_phone || '',
      selectedRoomId: activeAssignment?.room_id || '',
      selectedBedId: activeAssignment?.bed_index || ''
    });
    router.push(`/tenants/add?${params.toString()}`);
  };

  // ==========================================
  // VIEW: TENANT DETAIL
  // ==========================================
  if (view === "detail" && selectedTenant) {
     return (
        <div className="min-h-screen bg-white animate-in slide-in-from-right duration-500 font-body pb-10">

           <main className="px-4 py-2 space-y-4">
              {/* Hero Card */}
              <div className="bg-white rounded-[32px] p-8 flex flex-col items-center text-center shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden">
                 <div className="relative mb-4">
                    <div className="w-28 h-28 bg-[#00675B] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                       {selectedTenant.initials}
                    </div>
                    {(selectedTenant.status === 'ACTIVE' || selectedTenant.status === 'active') && (
                       <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#00D084] border-4 border-white rounded-full"></div>
                    )}
                 </div>
                 <h1 className="text-[22px] font-bold text-[#1A2B28] mb-1 font-heading">{selectedTenant.name}</h1>
                 <div className="flex items-center gap-2 text-[#718096] mb-4">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg>
                    <span className="text-sm font-medium">{selectedTenant.room}</span>
                 </div>
                 <div className="bg-[#EBFBF8] px-6 py-1.5 rounded-full">
                    <span className="text-[12px] font-black text-[#008075]">{selectedTenant.status}</span>
                 </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-4 rounded-2xl border-l-4 border-[#00685F] shadow-sm">
                     <p className="text-[10px] font-bold text-[#718096] mb-1 uppercase">Rent</p>
                     <p className="text-[15px] font-black text-[#1A2B28]">{selectedTenant.rent}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border-l-4 border-[#00B4D8] shadow-sm">
                     <p className="text-[10px] font-bold text-[#718096] mb-1 uppercase">Deposit</p>
                     <p className="text-[15px] font-black text-[#1A2B28]">{selectedTenant.deposit}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border-l-4 border-blue-500 shadow-sm">
                     <p className="text-[10px] font-bold text-[#718096] mb-1 uppercase">EB Total</p>
                     <p className="text-[15px] font-black text-blue-600">₹{selectedTenant.totalEB?.toLocaleString('en-IN')}</p>
                  </div>
              </div>

              {/* Info Sections */}
              <div className="bg-[#F8FAFB] rounded-[32px] p-6 space-y-6 border border-slate-50">
                 <div>
                    <h3 className="text-[13px] font-bold text-[#718096] mb-4">Resident Information</h3>
                    <div className="grid grid-cols-2 gap-y-6">
                       <div className="space-y-1">
                          <p className="text-[11px] font-bold text-[#718096]">Phone Number</p>
                          <p className="text-sm font-black text-[#1A2B28]">{selectedTenant.phone}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[11px] font-bold text-[#718096]">Move-in Date</p>
                          <p className="text-sm font-black text-[#1A2B28]">{selectedTenant.moveIn}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[11px] font-bold text-[#718096]">ID Verification</p>
                          <div className="flex flex-col gap-1">
                             <p className="text-sm font-black text-[#1A2B28]">{selectedTenant.govId}</p>
                             {selectedTenant.id_number ? (
                                <div className="flex items-center gap-1 bg-[#EBFBF8] w-fit px-1.5 py-0.5 rounded-full">
                                   <div className="w-1 h-1 bg-[#008075] rounded-full animate-pulse"></div>
                                   <span className="text-[8px] font-black text-[#008075] uppercase">Verified</span>
                                </div>
                             ) : (
                                <span className="text-[9px] font-bold text-red-400 uppercase italic">Not Entered</span>
                             )}
                          </div>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[11px] font-bold text-[#718096]">Agreement</p>
                          <p className="text-sm font-black text-[#1A2B28]">{selectedTenant.period}</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-200/50">
                    <h3 className="text-[13px] font-bold text-[#718096] mb-4">Emergency Contact</h3>
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                          <p className="text-sm font-black text-[#1A2B28]">{selectedTenant.emergency_contact_name || 'Not Provided'}</p>
                          <p className="text-[11px] font-bold text-[#718096]">Primary Contact</p>
                       </div>
                       <a href={`tel:${selectedTenant.emergency_contact_phone}`} className="p-3 bg-white rounded-xl text-[#00685F] shadow-sm border border-slate-100 active:scale-90 transition-all">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                       </a>
                    </div>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                 <button 
                   onClick={handleEdit}
                   className="w-full bg-[#00685F]/5 border border-[#00685F]/10 py-4.5 rounded-[20px] text-sm font-black text-[#00685F] shadow-sm active:scale-95 transition-all"
                 >
                    Edit Resident Details
                 </button>
                 <button 
                   onClick={handleRemove}
                   className="w-full bg-white border border-red-100 py-4 rounded-[18px] text-sm font-bold text-red-500 shadow-sm flex items-center justify-center gap-2 active:scale-95 hover:bg-red-50 transition-colors"
                 >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="8" x2="22" y2="13"/><line x1="22" y1="8" x2="17" y2="13"/></svg>
                    Remove Tenant
                 </button>
              </div>
           </main>
        </div>
     );
  }

  // ==========================================
  // VIEW: TENANT LIST
  // ==========================================
  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (view === "list") {
    return (
       <div className="min-h-screen bg-[#F8FAFB] animate-in fade-in duration-500 font-body pb-32">

          <main className="px-6 py-3 space-y-5">


             {/* Search Bar */}
             <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ADB5BD] group-focus-within:text-[#008075] transition-colors">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <input 
                   type="text" 
                   placeholder="Search by name or room..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-white pl-14 pr-6 py-5 rounded-[24px] border border-slate-200 outline-none focus:ring-2 focus:ring-[#008075]/20 focus:border-[#008075] transition-all text-[14px] font-medium text-[#1A2B28] shadow-sm"
                />
             </div>

             <div className="space-y-4">
                <h3 className="text-[20px] font-bold text-[#1A2B28] font-heading">Active Residents ({loading ? '...' : filteredTenants.length})</h3>
                
                {loading ? (
                   <div className="grid gap-4">
                      {[1, 2, 3].map(i => (
                         <div key={i} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm space-y-4 animate-pulse">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <div className="w-11 h-11 bg-slate-100 rounded-2xl"></div>
                                  <div className="flex flex-col gap-2">
                                     <div className="h-4 w-32 bg-slate-100 rounded-md"></div>
                                     <div className="h-3 w-20 bg-slate-100 rounded-md"></div>
                                  </div>
                               </div>
                               <div className="w-10 h-10 bg-slate-50 rounded-xl"></div>
                            </div>
                            <div className="grid grid-cols-3 pt-3 border-t border-slate-50">
                               <div className="h-8 bg-slate-50 rounded-lg mx-1"></div>
                               <div className="h-8 bg-slate-50 rounded-lg mx-1"></div>
                               <div className="h-8 bg-slate-50 rounded-lg mx-1"></div>
                            </div>
                         </div>
                      ))}
                   </div>
                ) : filteredTenants.length > 0 ? (
                   <div className="grid gap-4">
                      {filteredTenants.map((tenant) => (
                         <div 
                            key={tenant.id} 
                            onClick={() => { setSelectedTenant(tenant); switchView('detail', `id=${tenant.id}`); }}
                            className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm space-y-4 group hover:border-[#008075]/30 transition-all active:scale-[0.99] cursor-pointer"
                         >
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4 text-left">
                                  <div className="w-11 h-11 bg-[#00685F] text-white rounded-2xl flex items-center justify-center shadow-sm">
                                     <span className="text-[14px] font-bold">{tenant.initials}</span>
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-[16px] font-black text-[#1A2B28]">{tenant.name}</span>
                                     <span className="text-[12px] font-bold text-[#008075] mt-0.5">{tenant.phone}</span>
                                  </div>
                               </div>
                               <a 
                                  href={`tel:${tenant.phone.replace(/ /g, '')}`} 
                                  onClick={(e) => e.stopPropagation()}
                                  className="bg-[#EBFBF8] p-2.5 rounded-xl text-[#008075] hover:bg-[#008075] hover:text-white transition-all active:scale-90 shadow-sm relative z-10"
                               >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                               </a>
                            </div>

                            <div className="grid grid-cols-3 pt-3 border-t border-slate-50">
                               <div className="flex flex-col items-start">
                                  <span className="text-[10px] font-bold text-[#718096] mb-0.5">Rent</span>
                                  <span className="text-[15px] font-black text-[#1A2B28]">{tenant.rent}</span>
                               </div>
                               <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold text-[#718096] mb-0.5">Suite</span>
                                  <span className="text-[13px] font-bold text-[#1A2B28]">{tenant.room}</span>
                               </div>
                               <div className="flex flex-col items-end">
                                  <div className="flex flex-col items-center min-w-[70px]">
                                     <span className="text-[10px] font-bold text-[#718096] mb-1">Status</span>
                                     <div className="px-2.5 py-1 rounded-full bg-[#EBFBF8] text-[#008075] text-[9px] font-black">
                                        Active
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                ) : (
                   <div className="flex flex-col items-center py-12 text-slate-400 gap-3">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      <p className="text-sm font-medium">{searchQuery ? 'No tenants match your search' : 'No active residents available'}</p>
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
          <h2 className="text-3xl font-black text-[#1A2B28]">Manage Tenants</h2>
          <p className="text-sm font-medium text-[#718096]">Control and monitor your residents profiles</p>
        </div>

        <div className="grid gap-5 ">
          <button 
            onClick={() => router.push('/tenants/add')}
            className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"
          >
            <div className={`bg-[#008075] text-white p-4.5 rounded-2xl shadow-lg shadow-[#008075]/10`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-black text-[#1A2B28]">Add Tenant</span>
              <span className="text-[12px] font-bold text-[#718096] mt-1">New Onboarding</span>
            </div>
          </button>

          <button 
            onClick={() => switchView('list')}
            className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"
          >
            <div className={`bg-[#00685F] text-white p-4.5 rounded-2xl shadow-lg shadow-[#00685F]/10`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-black text-[#1A2B28]">View Tenants</span>
              <span className="text-[12px] font-bold text-[#718096] mt-1">Manage Profiles</span>
            </div>
          </button>

          <button 
            onClick={() => router.push('/tenants/remove')}
            className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"
          >
            <div className={`bg-red-500 text-white p-4.5 rounded-2xl shadow-lg shadow-red-500/10`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="8" x2="22" y2="13"/><line x1="22" y1="8" x2="17" y2="13"/></svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold text-[#1A2B28] font-body">Remove Tenant</span>
              <span className="text-[12px] font-bold text-[#ABB3B8] mt-1">Process Exit</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

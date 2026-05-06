"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

const tenants = [
  {
    id: 1,
    name: "Arjun Sharma",
    room: "Room 302-B",
    floor: "2nd Floor",
    status: "ACTIVE",
    rent: "₹18,500",
    deposit: "₹20,000",
    phone: "+91 98765 43210",
    email: "arjun.s@gmail.com",
    moveIn: "15 Jan 2024",
    period: "11 Months",
    govId: "Aadhaar",
    initials: "AS",
    color: "bg-[#00675B]",
    textColor: "text-white"
  },
  {
    id: 2,
    name: "Riya Kapoor",
    room: "Room 105-A",
    floor: "1st Floor",
    status: "NOTICE",
    rent: "₹16,000",
    deposit: "₹15,000",
    phone: "+91 99988 77665",
    email: "riya.k@hotmail.com",
    moveIn: "05 Mar 2024",
    period: "12 Months",
    govId: "Aadhaar",
    initials: "RK",
    color: "bg-orange-50",
    textColor: "text-orange-600"
  }
];

export default function TenantsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState("menu"); // "menu", "list", "detail"
  const [selectedTenant, setSelectedTenant] = useState(null);

  useEffect(() => {
    setMounted(true);
    const v = searchParams.get('view');
    const id = searchParams.get('id');
    
    if (v === 'list') {
      setView('list');
    } else if (v === 'detail' && id) {
      const tenant = tenants.find(t => t.id === parseInt(id));
      if (tenant) {
        setSelectedTenant(tenant);
        setView('detail');
      }
    } else {
      setView('menu');
    }
  }, [searchParams]);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  // ==========================================
  // VIEW: TENANT DETAIL
  // ==========================================
  if (view === "detail" && selectedTenant) {
     return (
        <div className="min-h-screen bg-white animate-in slide-in-from-right duration-500 font-body pb-10">
           {/* Header */}
           <header className="px-4 py-4 flex items-center gap-6 sticky top-0 bg-white z-50 border-b border-slate-50">
              <button onClick={() => router.push('?view=list')} className="text-[#00685F] active:scale-90 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              </button>
              <h1 className="text-xl font-black text-[#1A2B28]">Tenant Profile</h1>
           </header>

           <main className="px-5 py-6 space-y-6">
              {/* Hero Card */}
              <div className="bg-white rounded-[32px] p-8 flex flex-col items-center text-center shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden">
                 <div className="relative mb-4">
                    <div className="w-28 h-28 bg-[#00675B] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                       {selectedTenant.initials}
                    </div>
                    {selectedTenant.status === 'ACTIVE' && (
                       <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#00D084] border-4 border-white rounded-full"></div>
                    )}
                 </div>
                 <h1 className="text-[22px] font-bold text-[#1A2B28] mb-1 font-heading">{selectedTenant.name}</h1>
                 <div className="flex items-center gap-2 text-[#718096] mb-4">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg>
                    <span className="text-sm font-medium">{selectedTenant.room}</span>
                 </div>
                 <div className="bg-[#EBFBF8] px-6 py-1.5 rounded-full">
                    <span className="text-[10px] font-black text-[#008075] tracking-widest uppercase">{selectedTenant.status}</span>
                 </div>
              </div>

              {/* Stats Row */}
              <div className="flex gap-4">
                 <div className="flex-1 bg-white p-5 rounded-2xl border-l-4 border-[#00685F] shadow-sm">
                    <p className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-1">Monthly Rent</p>
                    <p className="text-lg font-black text-[#1A2B28]">{selectedTenant.rent}</p>
                 </div>
                 <div className="flex-1 bg-white p-5 rounded-2xl border-l-4 border-[#00B4D8] shadow-sm">
                    <p className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-1">Security Deposit</p>
                    <p className="text-lg font-black text-[#1A2B28]">{selectedTenant.deposit}</p>
                 </div>
              </div>

              {/* Personal Info */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-50 space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="text-[#008075]">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <h3 className="font-bold text-base text-[#1A2B28]">Personal Info</h3>
                 </div>
                 <div className="space-y-6 pt-2">
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-0.5">PHONE</p>
                          <p className="text-sm font-bold text-[#1A2B28]">{selectedTenant.phone}</p>
                       </div>
                       <div className="text-[#008075]">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                       </div>
                    </div>
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-0.5">EMAIL</p>
                          <p className="text-sm font-bold text-[#1A2B28]">{selectedTenant.email}</p>
                       </div>
                       <div className="text-[#008075]">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                       </div>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-1.5">GOV ID</p>
                       <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-[#1A2B28]">{selectedTenant.govId}</span>
                          <div className="bg-[#EBFBF8] px-2 py-0.5 rounded flex items-center gap-1">
                             <div className="bg-[#008075] rounded-full p-0.5">
                                <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                             </div>
                             <span className="text-[8px] font-black text-[#008075] uppercase tracking-wider">VERIFIED</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Stay Details */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-50 space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="text-[#008075]">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <h3 className="font-bold text-base text-[#1A2B28]">Stay Details</h3>
                 </div>
                 <div className="grid grid-cols-2 gap-8 pt-2">
                    <div>
                       <p className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-1">MOVE-IN DATE</p>
                       <p className="text-sm font-bold text-[#1A2B28]">{selectedTenant.moveIn}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-1">AGREEMENT PERIOD</p>
                       <p className="text-sm font-bold text-[#1A2B28]">{selectedTenant.period}</p>
                    </div>
                 </div>
              </div>

              {/* Payment History */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-50 space-y-6">
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                       <div className="text-[#008075]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                       </div>
                       <h3 className="font-bold text-base text-[#1A2B28]">Payment History</h3>
                    </div>
                    <button className="text-[10px] font-black text-[#00685F] uppercase tracking-widest hover:underline transition-all">VIEW ALL</button>
                 </div>
                 
                 <div className="space-y-6 pt-2">
                    {[
                       { month: "March Rent", date: "05 Mar 2024" },
                       { month: "February Rent", date: "03 Feb 2024" },
                       { month: "January Rent", date: "15 Jan 2024" }
                    ].map((payment, i) => (
                       <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-[#EBFBF8] rounded-full flex items-center justify-center text-[#008075]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                             </div>
                             <div>
                                <p className="text-sm font-bold text-[#1A2B28]">{payment.month}</p>
                                <p className="text-[10px] font-medium text-[#ABB3B8]">{payment.date}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-bold text-[#1A2B28]">{selectedTenant.rent}</p>
                             <span className="text-[8px] font-black text-[#008075] uppercase tracking-widest">PAID</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-50 space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="text-[#008075]">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <h3 className="font-bold text-base text-[#1A2B28]">Documents</h3>
                 </div>
                 
                 <div className="space-y-3 pt-2">
                    {[
                       { name: "Aadhaar Card", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21h-2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"/><rect x="14" y="3" width="7" height="18" rx="1"/><path d="M10 8h4"/><path d="M10 12h4"/><path d="M10 16h4"/></svg> },
                       { name: "Rental Agreement", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
                       { name: "Photo", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> }
                    ].map((doc, i) => (
                       <div key={i} className="flex items-center justify-between bg-[#F1F4F8] p-4 rounded-2xl border border-slate-50">
                          <div className="flex items-center gap-4">
                             <div className="bg-white p-2 rounded-xl text-[#008075] shadow-sm">
                                {doc.icon}
                             </div>
                             <span className="text-sm font-bold text-[#1A2B28]">{doc.name}</span>
                          </div>
                          <button className="text-[#ABB3B8] hover:text-[#008075] transition-colors">
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                 <div className="flex gap-4">
                    <button className="flex-1 bg-white border border-slate-200 py-4 rounded-[18px] text-sm font-bold text-[#1A2B28] shadow-sm active:scale-95 transition-all">
                       Edit Details
                    </button>
                    <button className="flex-1 bg-[#00675B] py-4 rounded-[18px] text-sm font-bold text-white shadow-lg shadow-[#00675B]/20 active:scale-95 transition-all">
                       Message Tenant
                    </button>
                 </div>
                 <button className="w-full bg-white border border-red-100 py-4 rounded-[18px] text-sm font-bold text-red-500 shadow-sm flex items-center justify-center gap-2 active:scale-95 hover:bg-red-50 transition-colors">
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
  if (view === "list") {
    return (
       <div className="min-h-screen bg-white animate-in fade-in duration-500 font-body pb-32">
          <header className="px-4 py-4 flex items-center gap-6 sticky top-0 bg-white z-50 border-b border-slate-50">
             <button onClick={() => router.push('/tenants')} className="text-[#00685F] active:scale-90 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
             </button>
             <div className="flex flex-col">
                <h1 className="text-xl font-black text-[#1A2B28]">Resident List</h1>
                <span className="text-[10px] font-bold text-[#008075] uppercase tracking-widest mt-0.5">{tenants.length} Total Tenants</span>
             </div>
          </header>

          <main className="p-4 space-y-3">
             {tenants.map((tenant) => (
                <div key={tenant.id} className="bg-[#F8FAFB] rounded-[28px] p-5 border border-slate-50 space-y-5">
                   <div className="flex items-center justify-between">
                      <button 
                        onClick={() => router.push(`?view=detail&id=${tenant.id}`)}
                        className="flex items-center gap-4 text-left group"
                      >
                         <div className={`w-12 h-12 ${tenant.id === 1 ? 'bg-[#00675B]' : 'bg-slate-200'} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm`}>
                            <span className={`text-lg font-black ${tenant.id === 1 ? 'text-white' : 'text-slate-500'}`}>{tenant.initials}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[17px] font-black text-[#1A2B28] group-hover:text-[#00685F] transition-colors">{tenant.name}</span>
                            <span className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest mt-0.5">{tenant.room} • {tenant.floor}</span>
                         </div>
                      </button>
                      <a href={`tel:${tenant.phone.replace(/ /g, '')}`} className="bg-white p-3 rounded-xl text-[#008075] border border-slate-50 hover:bg-[#EBFBF8] shadow-sm transition-all active:scale-90">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </a>
                   </div>
 
                   <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                      <div className="flex flex-col">
                         <span className="text-[8px] font-bold text-[#ABB3B8] uppercase tracking-widest">Monthly Rent</span>
                         <span className="text-xl font-black text-[#00685F] mt-0.5">{tenant.rent}</span>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[8px] font-black tracking-widest ${
                        tenant.status === 'ACTIVE' ? 'bg-[#EBFBF8] text-[#008075]' : 'bg-orange-50 text-orange-600'
                      }`}>
                         {tenant.status}
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
    <div className="min-h-screen bg-white font-body pb-12">
      <header className="px-4 py-4 flex items-center gap-6 sticky top-0 bg-white z-50 border-b border-slate-50">
        <button onClick={() => router.back()} className="text-[#00685F] active:scale-90 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 className="text-xl font-black text-[#1A2B28]">Manage Tenants</h1>
      </header>

      <main className="px-6 pt-8 space-y-8">
        <div className="space-y-2 text-left">
          <h2 className="text-3xl font-black text-[#1A2B28]">Tenant Directory</h2>
          <p className="text-sm font-medium text-[#718096]">Control and monitor your residents profiles</p>
        </div>

        <div className="grid gap-5 mt-10">
          <button 
            onClick={() => router.push('/tenants/add')}
            className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"
          >
            <div className={`bg-[#008075] text-white p-4.5 rounded-2xl shadow-lg shadow-[#008075]/10`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-black text-[#1A2B28]">Add Tenant</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ABB3B8] mt-1">New Onboarding</span>
            </div>
          </button>

          <button 
            onClick={() => router.push('?view=list')}
            className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"
          >
            <div className={`bg-[#00685F] text-white p-4.5 rounded-2xl shadow-lg shadow-[#00685F]/10`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-black text-[#1A2B28]">View Tenants</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ABB3B8] mt-1">Manage Profiles</span>
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ABB3B8] mt-1 font-body">Process Exit</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

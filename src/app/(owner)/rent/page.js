"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RentManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState("menu"); // "menu", "paid", "unpaid", "analytics"

  useEffect(() => {
    const v = searchParams.get('view');
    if (v) setView(v);
    else setView("menu");
  }, [searchParams]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [editableAmount, setEditableAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI (GPay/PhonePe)");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const tenants = [
    { id: 1, name: "Arjun S", room: "302-B", rent: "₹18,500", rawRent: "18500", status: "PAID", date: "2026-03-05", displayDate: "05 Mar 2026", mode: "UPI (GPay/PhonePe)" },
    { id: 2, name: "Riya K", room: "105-A", rent: "₹16,000", rawRent: "16000", status: "PAID", date: "2026-03-02", displayDate: "02 Mar 2026", mode: "Cash" },
    { id: 3, name: "Anita M", room: "102-C", rent: "₹12,000", rawRent: "12000", status: "UNPAID", date: "DUE OVERFLOW" },
    { id: 4, name: "Ravi K", room: "201-B", rent: "₹14,500", rawRent: "14500", status: "UNPAID", date: "DUE TODAY" },
    { id: 5, name: "Siva K", room: "201-C", rent: "₹15,000", rawRent: "15000", status: "UNPAID", date: "DUE TODAY" },
    { id: 6, name: "Priya G", room: "105-B", rent: "₹16,000", rawRent: "16000", status: "UNPAID", date: "DUE TODAY" }
  ];

  const paidTenants = tenants.filter(t => t.status === "PAID");
  const unpaidTenants = tenants.filter(t => t.status === "UNPAID");

  const openPaymentCollector = (tenant, isEdit = false) => {
    setSelectedTenant(tenant);
    setEditableAmount(tenant.rawRent);
    setPaymentDate(isEdit ? tenant.date : new Date().toISOString().split('T')[0]);
    setPaymentMode(isEdit && tenant.mode ? tenant.mode : "UPI (GPay/PhonePe)");
    setIsEditingExisting(isEdit);
    setShowConfirm(true);
  };

  // ==========================================
  // VIEW: ANALYTICS
  // ==========================================
  if (view === "analytics") {
    return (
       <div className="min-h-screen bg-[#F8FAFB] animate-in fade-in duration-500 font-sans pb-32">
          <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-slate-50">
             <button onClick={() => router.back()} className="p-2 -ml-2 text-[#718096]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg></button>
             <h1 className="text-[18px] font-bold text-[#1A2B28] uppercase tracking-widest leading-none">Financial Analytics</h1>
             <div className="w-10" />
          </header>
          <main className="p-6 space-y-8">
             <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 space-y-6">
                <h3 className="text-[12px] font-bold text-[#ABB3B8] uppercase tracking-widest">Monthly Collection Trend</h3>
                <div className="h-40 flex items-end justify-between px-2 gap-2">
                   {[40, 70, 45, 90, 65, 80].map((h, i) => (
                      <div key={i} className="w-full bg-[#EBFBF8] rounded-t-xl relative group"><div className="bg-[#008075] absolute bottom-0 left-0 right-0 rounded-t-xl transition-all duration-1000" style={{ height: `${h}%` }}></div><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#008075] opacity-0 group-hover:opacity-100 transition-opacity">₹{h}k</span></div>
                   ))}
                </div>
                <div className="flex justify-between text-[10px] font-bold text-[#ABB3B8] uppercase px-1"><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span></div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border-l-4 border-[#008075] shadow-sm"><p className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-1">Target</p><p className="text-xl font-black text-[#1A2B28]">₹1.24L</p></div>
                <div className="bg-white p-5 rounded-2xl border-l-4 border-amber-500 shadow-sm"><p className="text-[9px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-1">Achieved</p><p className="text-xl font-black text-[#1A2B28]">₹1.08L</p></div>
             </div>
          </main>
       </div>
    )
  }

  // ==========================================
  // VIEW: LIST (OUTSTANDING RENT / PAID HISTORY)
  // ==========================================
  if (view === "paid" || view === "unpaid") {
    const list = (view === "paid" ? paidTenants : unpaidTenants).filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.room.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
       <div className="min-h-screen bg-[#F8FAFB] animate-in fade-in duration-500 font-sans pb-32">
          <header className={`px-6 py-4 flex flex-col gap-6 sticky top-0 z-50 shadow-sm bg-white border-b border-slate-50`}>
             <div className="flex items-center justify-between">
                <button onClick={() => router.back()} className={`p-2 -ml-2 text-[#718096]`}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                </button>
                <div className="flex flex-col items-center text-center"><h1 className="text-[17px] font-bold uppercase tracking-widest leading-none text-[#1A2B28]">{view === 'paid' ? 'Collection History' : 'Outstanding Rent'}</h1><span className={`text-[10px] font-bold mt-2 uppercase tracking-widest text-[#008075]`}>{list.length} TOTAL ENTRIES</span></div>
                <div className="w-10" />
             </div>
             <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-[#718096]`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search tenant..." className={`w-full py-4 pl-12 pr-6 rounded-2xl text-[13px] font-bold outline-none shadow-sm transition-all bg-[#F1F4F8] text-[#1A2B28] placeholder:text-[#ABB3B8] border ${view === 'unpaid' ? 'border-teal-50' : 'border-slate-50'}`}/>
             </div>
          </header>

          <main className="p-6 space-y-4">
             {list.length > 0 ? list.map((tenant) => (
                <div 
                  key={tenant.id} 
                  onClick={() => view === 'paid' && openPaymentCollector(tenant, true)}
                  className={`bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 flex items-center justify-between group active:scale-[0.98] transition-all ${view === 'paid' ? 'cursor-pointer hover:border-teal-100' : ''}`}
                >
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${view === 'paid' ? 'bg-teal-50 text-[#008075]' : 'bg-red-50 text-red-500'} rounded-2xl flex items-center justify-center`}><span className="font-black text-sm">{tenant.name.split(' ')[0][0]}</span></div>
                      <div className="flex flex-col">
                         <span className="text-lg font-bold text-[#1A2B28]">{tenant.name}</span>
                         <span className="text-[10px] font-bold text-[#ABB3B8] uppercase tracking-widest mt-0.5">{tenant.room} • {view === 'paid' ? tenant.displayDate : tenant.date}</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-end gap-2">
                      <span className={`text-xl font-black ${view === 'unpaid' ? 'text-red-500' : 'text-[#008075]'}`}>{tenant.rent}</span>
                      {view === 'unpaid' && (
                        <button onClick={(e) => { e.stopPropagation(); openPaymentCollector(tenant); }} className="bg-[#008075] text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-teal-900/10 active:scale-95 transition-all">Collect</button>
                      )}
                      {view === 'paid' && (
                         <span className="text-[8px] font-black uppercase tracking-widest text-[#ABB3B8]">{tenant.mode || 'UPI'} Payment</span>
                      )}
                   </div>
                </div>
             )) : (
                <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4"><div className="w-16 h-16 border-2 border-dashed border-slate-400 rounded-full flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div><p className="font-bold text-[14px]">NO RESULTS MATCH SEARCH</p></div>
             )}
          </main>

          {/* Combined Bottom Sheet */}
          {showConfirm && (
          <div className="fixed inset-0 z-100 flex items-end justify-center pointer-events-auto">
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setShowConfirm(false)}></div>
             <div className="relative bg-white w-full max-w-lg rounded-t-[40px] px-6 pt-10 pb-12 animate-in slide-in-from-bottom duration-500 shadow-[0_-15px_50px_-15px_rgba(0,0,0,0.3)]">
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-8"></div>
                <div className="space-y-8">
                   <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold text-[#1A2B28]">{isEditingExisting ? 'Edit Transaction' : 'Confirm Payment'}</h2>
                      <p className="text-sm text-[#718096] font-medium leading-relaxed px-4">{isEditingExisting ? 'Modify payment details for this record.' : 'Review transaction details before confirming.'}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-y-8 pt-2">
                      <div className="space-y-1"><p className="text-[10px] font-bold text-[#ABB3B8] uppercase tracking-widest">Tenant</p><p className="text-[16px] font-bold text-[#1A2B28]">{selectedTenant?.name}</p></div>
                      <div className="space-y-1"><p className="text-[10px] font-bold text-[#ABB3B8] uppercase tracking-widest">Room</p><p className="text-[16px] font-bold text-[#1A2B28]">{selectedTenant?.room}</p></div>
                      <div className="space-y-1 bg-[#F1F4F8] p-4 rounded-2xl border-l-4 border-[#00685F]">
                         <p className="text-[10px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-1 ml-1">Rent Amount</p>
                         <div className="flex items-center gap-2"><span className="text-lg font-black text-[#00685F]">₹</span><input type="number" value={editableAmount} onChange={(e) => setEditableAmount(e.target.value)} className="bg-transparent border-none w-full text-lg font-black text-[#00685F] outline-none"/></div>
                      </div>
                      <div className="space-y-1 bg-[#F1F4F8] p-4 rounded-2xl border-l-4 border-amber-500">
                         <p className="text-[10px] font-bold text-[#ABB3B8] uppercase tracking-widest mb-1 ml-1">Payment Date</p>
                         <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="bg-transparent border-none w-full text-[14px] font-bold text-[#1A2B28] outline-none"/>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <p className="text-[10px] font-bold text-[#ABB3B8] uppercase tracking-widest ml-1">Payment Mode</p>
                      <div className="flex gap-4">
                         <button onClick={() => setPaymentMode("UPI (GPay/PhonePe)")} className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all font-bold ${paymentMode === "UPI (GPay/PhonePe)" ? 'bg-teal-50 border-[#00685F] text-[#00685F]' : 'bg-white border-slate-100 text-[#718096]'}`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/></svg>UPI</button>
                         <button onClick={() => setPaymentMode("Cash")} className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all font-bold ${paymentMode === "Cash" ? 'bg-teal-50 border-[#00685F] text-[#00685F]' : 'bg-white border-slate-100 text-[#718096]'}`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>Cash</button>
                      </div>
                   </div>
                   <div className="flex flex-col gap-3 pt-4">
                      <button onClick={() => { setShowConfirm(false); router.push('/rent'); }} className="w-full bg-[#00685F] py-5 rounded-[22px] text-white font-bold text-[16px] shadow-xl shadow-teal-900/20 active:scale-95 transition-all">{isEditingExisting ? 'Update Record' : 'Confirm & Mark Paid'}</button>
                      <button onClick={() => setShowConfirm(false)} className="w-full bg-white border border-slate-200 py-5 rounded-[22px] text-[#718096] font-bold text-[16px] active:scale-95 transition-all">Cancel</button>
                   </div>
                </div>
             </div>
          </div>
          )}
       </div>
    );
  }

  // ==========================================
  // VIEW: MENU
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sans pb-12">
      <header className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-50">
        <button onClick={() => router.back()} className="p-2 hover:bg-[#F1F4F8] rounded-full transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A2B28" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg></button>
        <h1 className="text-xl font-bold text-[#1A2B28]">Financial Console</h1>
      </header>
      <main className="px-6 pt-8 space-y-8">
        <div className="space-y-2 text-left"><h2 className="text-3xl font-bold text-[#1A2B28]">Rent Status</h2><p className="text-sm font-medium text-[#718096]">Track collections, identify late payments, and log income</p></div>
        <div className="grid gap-5 mt-10">
          <button onClick={() => router.push('?view=unpaid')} className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"><div className={`bg-red-500 text-white p-4.5 rounded-2xl shadow-lg shadow-red-900/10`}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><div className="flex flex-col items-start text-left"><span className="text-xl font-bold text-[#1A2B28]">Unpaid Tenants</span><span className="text-[10px] font-bold uppercase tracking-widest text-red-500 mt-1">{unpaidTenants.length} Pending Collections</span></div></button>
          <button onClick={() => router.push('?view=paid')} className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"><div className={`bg-[#008075] text-white p-4.5 rounded-2xl shadow-lg shadow-teal-900/10`}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div className="flex flex-col items-start text-left"><span className="text-xl font-bold text-[#1A2B28]">Paid Tenants</span><span className="text-[10px] font-bold uppercase tracking-widest text-[#008075] mt-1">{paidTenants.length} Cleared this Month</span></div></button>
          <button onClick={() => router.push('?view=analytics')} className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"><div className={`bg-amber-500 text-white p-4.5 rounded-2xl shadow-lg shadow-amber-900/10`}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div><div className="flex flex-col items-start text-left"><span className="text-xl font-bold text-[#1A2B28]">Rent Analytics</span><span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mt-1">Income Insights</span></div></button>
        </div>
      </main>
    </div>
  );
}

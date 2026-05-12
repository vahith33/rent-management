"use client";

import { useState, useEffect, useTransition, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRentPayments, updateRentPayment, getRentAnalytics, getRentCounts } from '@/actions/owner';

export default function RentManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState(() => searchParams.get('view') || "menu");
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true); // Start TRUE — show skeleton immediately
  const [tenants, setTenants] = useState([]);
  const [counts, setCounts] = useState({ paid: 0, unpaid: 0 });
  const [analyticsData, setAnalyticsData] = useState(null);

  // Cache for previously loaded data — switching back to a view is instant
  const cache = useRef({ paid: null, unpaid: null, analytics: null, counts: null });

  // Sync URL → view (only when URL changes externally, e.g. browser back button)
  useEffect(() => {
    const v = searchParams.get('view');
    if (v && v !== view) setView(v);
    else if (!v && view !== "menu") setView("menu");
  }, [searchParams]);

  // Fast view switcher — updates state instantly, fetches in background
  const switchView = useCallback((newView) => {
    // Update URL without full page navigation
    const url = newView === 'menu' ? '/rent' : `/rent?view=${newView}`;
    window.history.pushState(null, '', url);

    // If we have cached data, show it instantly while refreshing
    if (newView === 'paid' && cache.current.paid) setTenants(cache.current.paid);
    if (newView === 'unpaid' && cache.current.unpaid) setTenants(cache.current.unpaid);
    if (newView === 'analytics' && cache.current.analytics) setAnalyticsData(cache.current.analytics);
    if (newView === 'menu' && cache.current.counts) setCounts(cache.current.counts);

    startTransition(() => {
      setView(newView);
    });
  }, []);

  // Data fetching — runs when view changes
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      if (view === 'paid' || view === 'unpaid') {
        const data = await getRentPayments(view === 'paid' ? 'PAID' : 'UNPAID');
        if (!cancelled) {
          setTenants(data);
          cache.current[view] = data;
        }
      } else if (view === 'menu') {
        const data = await getRentCounts();
        if (!cancelled) {
          setCounts(data);
          cache.current.counts = data;
        }
      } else if (view === 'analytics') {
        const data = await getRentAnalytics();
        if (!cancelled) {
          setAnalyticsData(data);
          cache.current.analytics = data;
        }
      }
      if (!cancelled) setLoading(false);
    };
    fetchData();
    return () => { cancelled = true; };
  }, [view]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [editableAmount, setEditableAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI (GPay/PhonePe)");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);

  const openPaymentCollector = (tenant, isEdit = false) => {
    setSelectedTenant(tenant);
    setEditableAmount(tenant.rawRent || "");
    setPaymentDate(isEdit && tenant.date ? new Date(tenant.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setPaymentMode(isEdit && tenant.mode ? tenant.mode : "UPI (GPay/PhonePe)");
    setIsEditingExisting(isEdit);
    setShowConfirm(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedTenant) return;
    
    setIsSaving(true);
    try {
      const result = await updateRentPayment(selectedTenant.id, {
        amount: Number(editableAmount),
        paymentMode,
        paidAt: paymentDate,
        status: 'PAID'
      });

      if (result.success) {
        setShowConfirm(false);
        // Refresh the list
        const updatedData = await getRentPayments(view === 'paid' ? 'PAID' : 'UNPAID');
        setTenants(updatedData);
      } else {
        alert("Failed to update payment: " + result.error);
      }
    } catch (err) {
      alert("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // VIEW: ANALYTICS
  // ==========================================
  if (view === "analytics") {
    return (
       <div className="min-h-screen bg-white animate-in fade-in duration-500 font-body pb-32">
           <main className="px-6 py-8 space-y-8">
              <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[13px] font-black text-[#1A2B28]">Monthly Collection Trend</h3>
                 </div>
                 
                 <div className="h-40 flex items-end justify-between px-2 gap-2">
                    {loading ? (
                      [...Array(6)].map((_, i) => (
                        <div key={i} className="w-full bg-slate-100/50 rounded-t-xl animate-pulse" style={{ height: `${20 + Math.random() * 60}%` }}></div>
                      ))
                    ) : (
                      analyticsData?.trend.map((month, i) => (
                        <div key={i} className="w-full bg-[#EBFBF8] rounded-t-xl relative group">
                            <div 
                              className="bg-[#008075] absolute bottom-0 left-0 right-0 rounded-t-xl transition-all duration-1000" 
                              style={{ height: `${month.height}%` }}
                            ></div>
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-[#008075] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                ₹{new Intl.NumberFormat('en-IN').format(month.value)}
                            </span>
                        </div>
                      ))
                    )}
                 </div>
                 <div className="flex justify-between text-[10px] font-bold text-[#718096] uppercase px-1">
                    {loading ? (
                       [...Array(6)].map((_, i) => <div key={i} className="w-8 h-2 bg-slate-100 rounded animate-pulse"></div>)
                    ) : (
                      analyticsData?.trend.map((month, i) => (
                        <span key={i}>{month.label}</span>
                      ))
                    )}
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-5 rounded-2xl border-l-4 border-[#008075] shadow-sm">
                    <p className="text-[12px] font-bold text-[#718096] mb-1">Target</p>
                    {loading ? (
                       <div className="h-6 w-24 bg-slate-100 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-xl font-black text-[#1A2B28]">
                         ₹{new Intl.NumberFormat('en-IN').format(analyticsData?.target || 0)}
                      </p>
                    )}
                 </div>
                 <div className="bg-white p-5 rounded-2xl border-l-4 border-amber-500 shadow-sm">
                    <p className="text-[12px] font-bold text-[#718096] mb-1">Achieved</p>
                    {loading ? (
                       <div className="h-6 w-24 bg-slate-100 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-xl font-black text-[#1A2B28]">
                         ₹{new Intl.NumberFormat('en-IN').format(analyticsData?.achieved || 0)}
                      </p>
                    )}
                 </div>
              </div>
           </main>
        </div>
    )
  }

  // ==========================================
  // VIEW: LIST (OUTSTANDING RENT / PAID HISTORY)
  // ==========================================
  if (view === "paid" || view === "unpaid") {
    const list = tenants.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.room.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
       <div className="min-h-screen bg-white animate-in fade-in duration-500 font-body pb-32">
           <main className="px-6 py-8 space-y-8">
              <div className="space-y-2">
                 <h2 className="text-[22px] font-bold text-[#1A2B28]">{view === 'paid' ? 'Received Payments' : 'Pending Payments'}</h2>
                 <p className="text-[14px] font-medium text-[#718096]">{view === 'paid' ? 'Review your recent incoming payments' : 'Identify and manage pending rent collections'}</p>
              </div>

              {/* Search Bar */}
              <div className="relative group">
                 <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ADB5BD] group-focus-within:text-[#008075] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                 </div>
                 <input 
                    type="text" 
                    placeholder="Search tenant..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white pl-14 pr-6 py-5 rounded-[24px] border border-slate-200 outline-none focus:ring-2 focus:ring-[#008075]/20 focus:border-[#008075] transition-all text-[14px] font-medium text-[#1A2B28] shadow-sm"
                 />
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[20px] font-bold text-[#1A2B28]">{view === 'paid' ? 'Paid Transactions' : 'Pending Payments'} {!loading && `(${list.length})`}</h3>
                 </div>
                 
                 <div className="grid gap-4">
                    {loading ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-50 space-y-4 animate-pulse">
                           <div className="flex items-center gap-4">
                              <div className="w-11 h-11 bg-slate-100 rounded-2xl"></div>
                              <div className="space-y-2">
                                 <div className="w-32 h-4 bg-slate-100 rounded"></div>
                                 <div className="w-20 h-3 bg-slate-100 rounded"></div>
                              </div>
                           </div>
                           <div className="grid grid-cols-3 pt-3 border-t border-slate-50">
                              <div className="space-y-1"><div className="w-10 h-2 bg-slate-100 rounded"></div><div className="w-16 h-4 bg-slate-100 rounded"></div></div>
                              <div className="space-y-1 flex flex-col items-center"><div className="w-10 h-2 bg-slate-100 rounded"></div><div className="w-12 h-4 bg-slate-100 rounded"></div></div>
                              <div className="space-y-1 flex flex-col items-end"><div className="w-10 h-2 bg-slate-100 rounded"></div><div className="w-14 h-4 bg-slate-100 rounded"></div></div>
                           </div>
                        </div>
                      ))
                    ) : list.length > 0 ? list.map((tenant) => (
                       <div 
                         key={tenant.id} 
                         onClick={() => view === 'paid' && openPaymentCollector(tenant, true)}
                         className={`bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 space-y-4 group active:scale-[0.98] transition-all ${view === 'paid' ? 'cursor-pointer hover:border-teal-100' : ''}`}
                       >
                          <div className="flex items-center gap-4">
                             <div className={`w-11 h-11 bg-[#00685F] text-white rounded-2xl flex items-center justify-center shadow-sm`}>
                                <span className="font-black text-[15px]">{tenant.name.split(' ')[0][0]}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[16px] font-black text-[#1A2B28]">{tenant.name}</span>
                                <span className="text-[12px] font-bold text-[#718096] mt-0.5">{view === 'paid' ? tenant.displayDate : tenant.date}</span>
                             </div>
                          </div>

                          <div className="grid grid-cols-3 pt-3 border-t border-slate-50">
                             <div className="flex flex-col items-start">
                                <span className="text-[10px] font-bold text-[#718096] mb-0.5">Amount</span>
                                <span className="text-[15px] font-black text-[#1A2B28]">{tenant.rent}</span>
                             </div>
                             <div className="flex flex-col items-center">
                                <span className="text-[10px] font-bold text-[#718096] mb-0.5">Suite</span>
                                <span className="text-[13px] font-bold text-[#1A2B28]">{tenant.room}</span>
                             </div>
                             <div className="flex flex-col items-end">
                                <div className="flex flex-col items-center min-w-[70px]">
                                   <span className="text-[10px] font-bold text-[#718096] mb-1">Status</span>
                                   {view === 'unpaid' ? (
                                     <button onClick={(e) => { e.stopPropagation(); openPaymentCollector(tenant); }} className="bg-[#008075] text-white px-3.5 py-1.5 rounded-xl text-[11px] font-black shadow-lg shadow-teal-900/10 active:scale-95 transition-all">Collect</button>
                                   ) : (
                                     <div className="px-2.5 py-1 rounded-full bg-[#EBFBF8] text-[#008075] text-[9px] font-black">Paid</div>
                                   )}
                                </div>
                             </div>
                          </div>
                       </div>
                    )) : !loading && (
                       <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4"><div className="w-16 h-16 border-2 border-dashed border-slate-400 rounded-full flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div><p className="font-bold text-[14px]">NO RESULTS MATCH SEARCH</p></div>
                    )}
                 </div>
              </div>
           </main>

           {/* Combined Bottom Sheet */}
           {showConfirm && (
           <div className="fixed inset-0 z-100 flex items-end justify-center pointer-events-auto">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setShowConfirm(false)}></div>
              <div className="relative bg-white w-full max-w-lg rounded-t-[40px] px-6 pt-8 pb-12 animate-in slide-in-from-bottom duration-500 shadow-[0_-15px_50px_-15px_rgba(0,0,0,0.3)]">
                 <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-8"></div>
                 <div className="space-y-8">
                    <div className="text-center space-y-2">
                       <h2 className="text-[26px] font-black text-[#1A2B28] font-heading leading-tight">{isEditingExisting ? 'Edit Transaction' : 'Confirm Payment'}</h2>
                       <p className="text-[14px] text-[#718096] font-medium leading-relaxed px-4">{isEditingExisting ? 'Modify payment details for this record.' : 'Review transaction details before confirming.'}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                       <div className="space-y-1.5 px-1"><p className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">Resident</p><p className="text-[16px] font-black text-[#1A2B28]">{selectedTenant?.name}</p></div>
                       <div className="space-y-1.5 px-1"><p className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">Suite</p><p className="text-[16px] font-black text-[#1A2B28]">{selectedTenant?.room}</p></div>
                       
                       <div className="space-y-1.5 bg-[#EEF2F8] p-5 rounded-[24px] border-l-4 border-[#00685F] shadow-sm">
                          <p className="text-[10px] font-bold text-[#718096] uppercase tracking-widest mb-1">Rent Amount</p>
                          <div className="flex items-center gap-2"><span className="text-lg font-black text-[#00685F]">₹</span><input type="number" value={editableAmount} onChange={(e) => setEditableAmount(e.target.value)} className="bg-transparent border-none w-full text-lg font-black text-[#00685F] outline-none"/></div>
                       </div>
                       
                       <div className="space-y-1.5 bg-[#EEF2F8] p-5 rounded-[24px] border-l-4 border-amber-500 shadow-sm">
                          <p className="text-[10px] font-bold text-[#718096] uppercase tracking-widest mb-1">Due Date</p>
                          <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="bg-transparent border-none w-full text-[14px] font-black text-[#1A2B28] outline-none"/>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[11px] font-bold text-[#718096] uppercase tracking-widest ml-1">Payment Mode</p>
                       <div className="flex gap-4">
                          <button onClick={() => setPaymentMode("UPI (GPay/PhonePe)")} className={`flex-1 flex items-center justify-center gap-2 py-4.5 rounded-[20px] border-2 transition-all font-black text-[14px] active:scale-[0.98] ${paymentMode === "UPI (GPay/PhonePe)" ? 'bg-teal-50 border-[#00685F] text-[#00685F] shadow-lg shadow-teal-900/5' : 'bg-white border-slate-100 text-[#718096]'}`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/></svg>UPI</button>
                          <button onClick={() => setPaymentMode("Cash")} className={`flex-1 flex items-center justify-center gap-2 py-4.5 rounded-[20px] border-2 transition-all font-black text-[14px] active:scale-[0.98] ${paymentMode === "Cash" ? 'bg-teal-50 border-[#00685F] text-[#00685F] shadow-lg shadow-teal-900/5' : 'bg-white border-slate-100 text-[#718096]'}`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>Cash</button>
                       </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                       <button 
                         onClick={handleConfirmPayment}
                         disabled={isSaving}
                         className="w-full bg-[#00685F] py-5 rounded-[22px] text-white font-black text-[16px] shadow-xl shadow-teal-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                       >
                          {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (isEditingExisting ? 'Update Record' : 'Confirm & Mark Paid')}
                       </button>
                       <button onClick={() => setShowConfirm(false)} className="w-full bg-white border border-slate-100 py-5 rounded-[22px] text-[#718096] font-bold text-[16px] active:scale-[0.98] transition-all">Cancel</button>
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
    <div className="min-h-screen bg-white font-body pb-12">
      <main className="px-6 pt-5 space-y-8">
        <div className="space-y-2 text-left">
          <h2 className="text-3xl font-black text-[#1A2B28]">Manage Rent</h2>
          <p className="text-sm font-medium text-[#718096]">Track Rent, identify late payments, and log income</p>
        </div>

        <div className="grid gap-5">
          <button 
            onClick={() => switchView('unpaid')}
            className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"
          >
            <div className={`bg-red-500 text-white p-4.5 rounded-2xl shadow-lg shadow-red-900/10`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-xl font-black text-[#1A2B28]">Unpaid Tenants</span>
              <span className="text-[12px] font-bold text-red-500 mt-1">{loading ? '...' : counts.unpaid} Pending Collections</span>
            </div>
          </button>

          <button 
            onClick={() => switchView('paid')}
            className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"
          >
            <div className={`bg-[#008075] text-white p-4.5 rounded-2xl shadow-lg shadow-teal-900/10`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-xl font-black text-[#1A2B28]">Paid Tenants</span>
              <span className="text-[12px] font-bold text-[#008075] mt-1">{loading ? '...' : counts.paid} Cleared this Month</span>
            </div>
          </button>

          <button 
            onClick={() => switchView('analytics')}
            className="w-full bg-white p-7 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition-all group active:scale-[0.98]"
          >
            <div className={`bg-[#648dcb] text-white p-4.5 rounded-2xl shadow-lg shadow-slate-900/10`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-xl font-black text-[#1A2B28]">Rent Analytics</span>
              <span className="text-[12px] font-bold text-[#718096] mt-1">Income Insights</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

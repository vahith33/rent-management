"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTenants, removeTenant } from '@/actions/owner';

export default function RemoveTenantPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getTenants();
      setTenants(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveInitiate = (tenant) => {
    setSelectedTenant(tenant);
    setShowConfirm(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedTenant) return;
    
    setIsRemoving(true);
    try {
      const result = await removeTenant(selectedTenant.id);
      if (result.success) {
        setTenants(tenants.filter(t => t.id !== selectedTenant.id));
        setShowConfirm(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        alert("Failed to remove tenant: " + result.error);
      }
    } catch (err) {
      alert("An unexpected error occurred");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-body pb-20">
      {/* Header */}
      <header className="bg-white px-6 py-6 flex items-center gap-4 sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <button onClick={() => router.back()} className="p-2 hover:bg-[#F1F4F8] rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A2B28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 className="text-[20px] font-bold text-[#1A2B28] font-heading">Remove Tenant</h1>
      </header>

      <main className="px-6 py-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-[22px] font-bold text-[#1A2B28] font-heading">Exit Process</h2>
          <p className="text-[14px] font-medium text-[#718096]">Permanently remove a tenant from your records</p>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ADB5BD] group-focus-within:text-[#EB5757] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search by name or room..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white pl-14 pr-6 py-5 rounded-[24px] border border-slate-200 outline-none focus:ring-2 focus:ring-[#EB5757]/20 focus:border-[#EB5757] transition-all text-[14px] font-medium text-[#1A2B28] shadow-sm"
          />
        </div>

        {/* Tenant List */}
        <div className="space-y-4">
          <h3 className="text-[20px] font-bold text-[#1A2B28] font-heading">Active Residents ({filteredTenants.length})</h3>
          
          {filteredTenants.length > 0 ? (
            <div className="grid gap-4">
              {filteredTenants.map(tenant => (
                <div key={tenant.id} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-red-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${tenant.id === 1 ? 'bg-[#008075]' : 'bg-slate-100'} rounded-2xl flex items-center justify-center shadow-sm`}>
                      <span className={`text-lg font-bold ${tenant.id === 1 ? 'text-white' : 'text-slate-500'}`}>{tenant.initials}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[16px] font-bold text-[#1A2B28]">{tenant.name}</span>
                      <span className="text-[12px] font-bold text-[#ABB3B8] mt-0.5">Room {tenant.room}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveInitiate(tenant)}
                    className="bg-red-50 p-3 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-12 text-slate-400 gap-3">
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
               <p className="text-sm font-medium">No tenants match your search</p>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#1A2B28]/40 backdrop-blur-sm p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[400px] rounded-[40px] p-8 flex flex-col items-center gap-6 shadow-2xl animate-in zoom-in-95 pointer-events-auto">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-[22px] font-bold text-[#1A2B28] font-heading">Confirm Removal</h2>
              <p className="text-[14px] font-medium text-[#718096]">Are you sure you want to remove <b>{selectedTenant?.name}</b>? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-4.5 rounded-2xl bg-slate-100 text-[#1A2B28] font-bold text-[14px] active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmRemove}
                disabled={isRemoving}
                className="flex-1 py-4.5 rounded-2xl bg-red-500 text-white font-bold text-[14px] shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isRemoving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-200 bg-[#1A2B28] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-10 duration-500">
          <div className="bg-green-500 rounded-full p-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span className="text-[13px] font-bold tracking-tight">Tenant successfully removed</span>
        </div>
      )}
    </div>
  );
}

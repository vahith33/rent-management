"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

export default function DashboardPage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [rentFilter, setRentFilter] = useState("UNPAID"); // "UNPAID", "PARTIAL", "PAID"

  // Lock scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSidebarOpen]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState({
    name: "Suresh Kumar",
    phone: "9363658160",
    pgName: "Sri Sai PG"
  });

  const [tempInfo, setTempInfo] = useState({...ownerInfo});

  const menuItems = [
    { label: 'Dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', path: '/dashboard' },
    { label: 'Property/Rooms', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: '/rooms' },
    { label: 'Tenant Directory', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8', path: '/tenants' },
    { label: 'Financial Console', icon: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', path: '/rent' },
    { label: 'Broadcast Notice', icon: 'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z', path: '/notices' },
  ];

  const handleAction = (label) => {
    if (label === 'Mark Paid') {
      router.push('/rent?view=unpaid');
    } else if (label === 'Send Notice') {
      router.push('/notices');
    }
  };

  const handleSaveProfile = () => {
    setOwnerInfo(tempInfo);
    setIsEditingProfile(false);
    setToastMessage("Profile updated successfully!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24 font-sans">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-100 flex animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => { setIsSidebarOpen(false); setIsEditingProfile(false); }}></div>
          <div className="relative bg-white w-[300px] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 ease-out overflow-hidden">
             
             {/* Profile Header (Matches Image) */}
             <div className="p-8 pt-10 flex items-center gap-4">
                <div className="relative">
                   <div className="w-14 h-14 bg-[#008075] rounded-[18px] flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-teal-900/20">
                      SK
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <div className="bg-[#00D1FF] w-4 h-4 rounded-full flex items-center justify-center">
                         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                   </div>
                </div>
                <div className="flex flex-col">
                   <h2 className="text-[19px] font-bold text-[#00685F] leading-tight">{ownerInfo.pgName}</h2>
                </div>
             </div>



             {/* Menu Items (Matches Image Style) */}
             <div className="flex-1 px-4 space-y-2">
                {!isEditingProfile ? (
                  <>
                    <button 
                      onClick={() => { router.push('/settings'); setIsSidebarOpen(false); }}
                      className="w-full flex items-center gap-5 px-5 py-4 rounded-[20px] text-[#4A5568] hover:bg-[#F7FAFC] transition-all group"
                    >
                      <div className="text-[#008075] bg-[#E6F4F3] p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                      </div>
                      <span className="text-[15px] font-bold">Profile Settings</span>
                    </button>

                    <button 
                      onClick={() => { router.push('/support'); setIsSidebarOpen(false); }}
                      className="w-full flex items-center gap-5 px-5 py-4 rounded-[20px] text-[#4A5568] hover:bg-[#F7FAFC] transition-all group"
                    >
                      <div className="bg-[#EDF2F7] p-2.5 rounded-xl"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                      <span className="text-[15px] font-bold">Help & Support</span>
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                     <div className="space-y-4">
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Owner Name</label>
                           <input value={tempInfo.name} onChange={(e) => setTempInfo({...tempInfo, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-[#008075] transition-all"/>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">PG Name</label>
                           <input value={tempInfo.pgName} onChange={(e) => setTempInfo({...tempInfo, pgName: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-[#008075] transition-all"/>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                           <input value={tempInfo.phone} onChange={(e) => setTempInfo({...tempInfo, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-[#008075] transition-all"/>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <button onClick={handleSaveProfile} className="flex-1 bg-[#008075] text-white py-4 rounded-xl font-bold text-[14px] shadow-lg shadow-teal-900/10 active:scale-95 transition-all">Save Changes</button>
                        <button onClick={() => setIsEditingProfile(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold text-[14px] active:scale-95 transition-all">Cancel</button>
                     </div>
                  </div>
                )}
             </div>

             {/* Footer (Matches Image) */}
             <div className="p-8">
                <button 
                  onClick={() => router.push('/login')}
                  className="flex items-center gap-4 text-[#E53E3E] font-bold text-[16px] active:scale-95 transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Logout
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setIsSidebarOpen(true)}
            className="w-9 h-9 bg-[#00685F] rounded-full flex items-center justify-center text-white text-[12px] font-bold shadow-md cursor-pointer active:scale-90 transition-all border-2 border-white"
          >
            SK
          </div>
          <h1 className="text-[16px] font-bold text-[#1A2B28]">{ownerInfo.pgName}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div 
            onClick={() => router.push('/notifications')}
            className="relative cursor-pointer active:scale-90 transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A2B28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </header>

      <main className="px-6 pt-8 space-y-8">
        {/* Welcome Section */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-[28px] font-bold text-[#1A2B28] flex items-center gap-2">
            Good morning, Vahith 👋
          </h2>
          <p className="text-[#718096] font-medium mt-1">Sunday, 29 March 2026</p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Tenants */}
          <div 
            onClick={() => router.push('/tenants?view=list')}
            className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border-l-4 border-[#008075] relative overflow-hidden group cursor-pointer active:scale-95 transition-all hover:bg-teal-50/30"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ADB5BD]">Total Tenants</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-[#1A2B28]">24</span>
              <span className="text-[11px] font-bold text-[#008075]">+2 this month</span>
            </div>
          </div>

          {/* Occupancy */}
          <div 
            onClick={() => router.push('/rooms?view=list')}
            className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden group cursor-pointer active:scale-95 transition-all hover:bg-slate-50"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ADB5BD]">Vacant Beds</span>
            <div className="mt-2 space-y-3">
              <span className="text-3xl font-bold text-[#1A2B28]">4</span>
              <div className="w-full bg-[#F1F4F8] h-2 rounded-full overflow-hidden">
                <div className="bg-[#008075] h-full rounded-full transition-all duration-1000" style={{ width: '87%' }}></div>
              </div>
            </div>
          </div>

          {/* Pending Rent */}
          <div 
            onClick={() => router.push('/rent?view=unpaid')}
            className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden group cursor-pointer active:scale-95 transition-all hover:bg-red-50"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ADB5BD]">Pending Rent</span>
            <div className="mt-2">
              <span className="text-3xl font-bold text-red-500">6</span>
              <p className="text-[11px] font-medium text-[#718096] mt-1">Due this week</p>
            </div>
          </div>

          {/* Monthly Income */}
          <div 
            onClick={() => router.push('/rent?view=analytics')}
            className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden group cursor-pointer active:scale-95 transition-all hover:bg-amber-50"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ADB5BD]">Monthly Income</span>
            <div className="mt-2">
              <span className="text-3xl font-bold text-[#1A2B28]">₹1.08L</span>
              <p className="text-[11px] font-medium text-[#718096] mt-1">of ₹1.24L target</p>
            </div>
          </div>
        </div>

        {/* Quick Actions - Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
          {[
            { label: 'Mark Paid', icon: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', color: 'bg-[#008075]/10', iconColor: '#008075' },
            { label: 'Send Notice', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', color: 'bg-[#008075]/10', iconColor: '#008075' },
          ].map((action, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <button 
                onClick={() => handleAction(action.label)}
                className={`${action.color} p-4 rounded-2xl shadow-sm active:scale-95 transition-all`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={action.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={action.icon} />
                </svg>
              </button>
              <span className="text-[11px] font-bold text-[#1A2B28]">{action.label}</span>
            </div>
          ))}
        </div>

        {/* Rent Status Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#1A2B28]">Rent Status</h3>
            <button 
              onClick={() => router.push('/rent')}
              className="text-[13px] font-bold text-[#008075] flex items-center gap-1 active:scale-95 transition-all"
            >
              View all <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setRentFilter("UNPAID")}
              className={`${rentFilter === 'UNPAID' ? 'bg-[#00685F] text-white shadow-md shadow-teal-900/10' : 'bg-[#EEF2FF] text-[#1A2B28]'} px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95`}
            >
              Unpaid
            </button>
            <button 
              onClick={() => setRentFilter("PARTIAL")}
              className={`${rentFilter === 'PARTIAL' ? 'bg-[#00685F] text-white shadow-md shadow-teal-900/10' : 'bg-[#EEF2FF] text-[#1A2B28]'} px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95`}
            >
              Partial
            </button>
            <button 
              onClick={() => setRentFilter("PAID")}
              className={`${rentFilter === 'PAID' ? 'bg-[#00685F] text-white shadow-md shadow-teal-900/10' : 'bg-[#EEF2FF] text-[#1A2B28]'} px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95`}
            >
              Paid
            </button>
          </div>

          {/* Tenant List */}
          <div className="space-y-3">
            {[
              { name: 'Ravi Kumar', room: 'Room 3B', rent: '₹7,500', status: 'UNPAID', color: 'bg-red-50 text-red-500', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
              { name: 'Anita M', room: 'Room 1A', rent: '₹6,000', status: 'PARTIAL', color: 'bg-orange-50 text-orange-500', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
              { name: 'Siva K', room: 'Room 2C', rent: '₹8,000', status: 'UNPAID', color: 'bg-red-50 text-red-500', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
              { name: 'Rahul S', room: 'Room 4A', rent: '₹5,500', status: 'PAID', color: 'bg-emerald-50 text-emerald-500', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
              { name: 'Priya D', room: 'Room 2B', rent: '₹9,000', status: 'PAID', color: 'bg-emerald-50 text-emerald-500', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' }
            ]
            .filter(t => t.status === rentFilter)
            .map((tenant, i) => (
              <div key={i} className="bg-white p-4 rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50 flex items-center justify-between hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#EEF2FF]">
                    <Image src={tenant.img} alt={tenant.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1A2B28]">{tenant.name}</span>
                    <span className="text-[13px] font-medium text-[#ADB5BD]">{tenant.room} • {tenant.rent}</span>
                  </div>
                </div>
                <div className={`${tenant.color} px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest`}>
                  {tenant.status}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-100 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="bg-[#1A2B28] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
            <div className="bg-[#008075] p-1 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span className="text-sm font-bold tracking-tight">{toastMessage}</span>
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

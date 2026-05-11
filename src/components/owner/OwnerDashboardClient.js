"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OwnerDashboardClient({ initialData }) {
  const router = useRouter();
  const { owner, stats, recentRent } = initialData;

  const [rentFilter, setRentFilter] = useState("UNPAID"); 

  const handleAction = (label) => {
    if (label === 'Mark Paid') {
      router.push('/rent?view=unpaid');
    } else if (label === 'Send Notice') {
      router.push('/notices');
    }
  };

  return (
    <div className="min-h-screen pb-24 font-sans">
      <main className="px-6 pt-5 space-y-8">
        <div className="animate-in fade-in slide-in-from-top-4 duration-400">
          <h2 className="text-[28px] font-bold text-[#1A2B28]">
            Hello, {owner.name} 👋
          </h2>
          <p className="text-[#718096] font-medium mt-1">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div onClick={() => router.push('/tenants?view=list')} className="bg-white p-5 rounded-3xl shadow-sm border-l-4 border-[#008075] cursor-pointer active:scale-95 transition-all">
            <span className="text-[12px] font-bold text-[#ADB5BD]">Total Tenants</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-[#1A2B28]">{stats.totalTenants}</span>
            </div>
          </div>

          <div onClick={() => router.push('/rooms?view=list')} className="bg-white p-5 rounded-3xl shadow-sm cursor-pointer active:scale-95 transition-all">
            <span className="text-[12px] font-bold text-[#ADB5BD]">Vacant Beds</span>
            <div className="mt-2 space-y-3">
              <span className="text-3xl font-bold text-[#1A2B28]">{stats.vacantBeds}</span>
              <div className="w-full bg-[#F1F4F8] h-2 rounded-full overflow-hidden">
                <div className="bg-[#008075] h-full rounded-full transition-all duration-1000" style={{ width: `${stats.occupancyRate}%` }}></div>
              </div>
            </div>
          </div>

          <div onClick={() => router.push('/rent?view=unpaid')} className="bg-white p-5 rounded-3xl shadow-sm cursor-pointer active:scale-95 transition-all">
            <span className="text-[12px] font-bold text-[#ADB5BD]">Pending Rent</span>
            <div className="mt-2">
              <span className="text-3xl font-bold text-red-500">{stats.pendingRentCount}</span>
            </div>
          </div>

          <div onClick={() => router.push('/rent?view=analytics')} className="bg-white p-5 rounded-3xl shadow-sm cursor-pointer active:scale-95 transition-all">
            <span className="text-[12px] font-bold text-[#ADB5BD]">Monthly Income</span>
            <div className="mt-2">
              <span className="text-3xl font-bold text-[#1A2B28]">₹{stats.monthlyIncome}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar px-1 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          {[
            { label: 'Mark Paid', icon: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', color: 'bg-[#008075]/10', iconColor: '#008075' },
            { label: 'Send Notice', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', color: 'bg-[#008075]/10', iconColor: '#008075' },
          ].map((action, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <button onClick={() => handleAction(action.label)} className={`${action.color} p-4 rounded-2xl active:scale-95 transition-all`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={action.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={action.icon} /></svg>
              </button>
              <span className="text-[11px] font-bold text-[#1A2B28]">{action.label}</span>
            </div>
          ))}
        </div>

        {/* Rent Status Section */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#1A2B28]">Rent Status</h3>
            <button onClick={() => router.push('/rent')} className="text-[13px] font-bold text-[#008075]">View all</button>
          </div>

          <div className="flex gap-2">
            {["UNPAID", "PARTIAL", "PAID"].map(filter => (
              <button 
                key={filter}
                onClick={() => setRentFilter(filter)}
                className={`${rentFilter === filter ? 'bg-[#00685F] text-white' : 'bg-[#EEF2FF] text-[#1A2B28]'} px-5 py-2.5 rounded-full text-sm font-bold transition-all`}
              >
                {filter.charAt(0) + filter.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {recentRent.filter(t => t.status === rentFilter).map((rent, i) => (
              <div key={i} className="bg-white p-4 rounded-[28px] shadow-sm border border-slate-50 flex items-center justify-between hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center font-bold text-[#00685F]">
                    {rent.tenants?.name?.substring(0, 1)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1A2B28]">{rent.tenants?.name}</span>
                    <span className="text-[13px] font-medium text-[#ADB5BD]">Due: {new Date(rent.due_date).toLocaleDateString()} • ₹{rent.amount}</span>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${rent.status === 'PAID' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                  {rent.status}
                </div>
              </div>
            ))}
            {recentRent.filter(t => t.status === rentFilter).length === 0 && (
              <div className="text-center py-8 text-[#ADB5BD] font-medium text-sm">No {rentFilter.toLowerCase()} records found</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

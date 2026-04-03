"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24 font-sans">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-1 group cursor-pointer">
          <h1 className="text-lg font-bold text-[#1A2B28]">Sri Sai PG</h1>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A2B28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="w-10 h-10 bg-[#00685F] rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer">
            SK
          </div>
        </div>
      </header>

      <main className="px-6 pt-8 space-y-8">
        {/* Welcome Section */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-[28px] font-bold text-[#1A2B28] flex items-center gap-2">
            Good morning, Suresh 👋
          </h2>
          <p className="text-[#718096] font-medium mt-1">Sunday, 29 March 2026</p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Tenants */}
          <div className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border-l-4 border-[#008075] relative overflow-hidden group">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ADB5BD]">Total Tenants</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-[#1A2B28]">24</span>
              <span className="text-[11px] font-bold text-[#008075]">+2 this month</span>
            </div>
          </div>

          {/* Occupancy */}
          <div className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ADB5BD]">Occupancy</span>
            <div className="mt-2 space-y-3">
              <span className="text-3xl font-bold text-[#1A2B28]">87%</span>
              <div className="w-full bg-[#F1F4F8] h-2 rounded-full overflow-hidden">
                <div className="bg-[#008075] h-full rounded-full transition-all duration-1000" style={{ width: '87%' }}></div>
              </div>
            </div>
          </div>

          {/* Pending Rent */}
          <div className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ADB5BD]">Pending Rent</span>
            <div className="mt-2">
              <span className="text-3xl font-bold text-red-500">6</span>
              <p className="text-[11px] font-medium text-[#718096] mt-1">Due this week</p>
            </div>
          </div>

          {/* Monthly Income */}
          <div className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
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
              <button className={`${action.color} p-4 rounded-2xl shadow-sm active:scale-95 transition-all`}>
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
            <button className="text-[13px] font-bold text-[#008075] flex items-center gap-1">
              View all <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

          <div className="flex gap-2">
            <button className="bg-[#00685F] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md shadow-teal-900/10">Unpaid</button>
            <button className="bg-[#EEF2FF] text-[#1A2B28] px-5 py-2.5 rounded-full text-sm font-bold border border-transparent hover:border-[#008075]/20 transition-all">Partial</button>
            <button className="bg-[#EEF2FF] text-[#1A2B28] px-5 py-2.5 rounded-full text-sm font-bold border border-transparent hover:border-[#008075]/20 transition-all">Paid</button>
          </div>

          {/* Tenant List */}
          <div className="space-y-3">
            {[
              { name: 'Ravi Kumar', room: 'Room 3B', rent: '₹7,500', status: 'UNPAID', color: 'bg-red-50 text-red-500', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
              { name: 'Anita M', room: 'Room 1A', rent: '₹6,000', status: 'PARTIAL', color: 'bg-orange-50 text-orange-500', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
              { name: 'Siva K', room: 'Room 2C', rent: '₹8,000', status: 'UNPAID', color: 'bg-red-50 text-red-500', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' }
            ].map((tenant, i) => (
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

        {/* Maintenance Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#1A2B28]">Maintenance</h3>
            <button className="text-[13px] font-bold text-[#008075] flex items-center gap-1">
              View all <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

          {/* Ticket List */}
          <div className="space-y-4">
            {[
              { issue: 'Fan not working', type: 'ELECTRICAL', room: 'Room 3B', time: '2 hrs ago', icon: 'RK', borderColor: 'border-orange-200' },
              { issue: 'Tap leaking', type: 'PLUMBING', room: 'Room 1A', time: '1 day ago', icon: 'AM', borderColor: 'border-teal-200' }
            ].map((ticket, i) => (
              <div key={i} className={`bg-white p-6 rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border-l-4 ${ticket.borderColor} space-y-4`}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-[#1A2B28]">{ticket.issue}</h4>
                    <p className="text-[13px] font-medium text-[#ADB5BD]">{ticket.room} • {ticket.time}</p>
                  </div>
                  <div className="bg-[#F1F4F8] text-[#1A2B28] px-3 py-1 rounded-lg text-[9px] font-black tracking-widest">
                    {ticket.type}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="w-8 h-8 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[11px] font-bold text-[#008075]">
                    {ticket.icon}
                  </div>
                  <button className="text-[13px] font-black tracking-tight text-[#00685F] hover:underline uppercase">
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around py-4 px-6 z-50">
        <button className="flex flex-col items-center gap-1 text-[#008075]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10"/></svg>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button 
          onClick={() => router.push('/tenants')}
          className="flex flex-col items-center gap-1 text-[#ADB5BD] hover:text-[#008075] transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span className="text-[10px] font-medium">Tenants</span>
        </button>
        <button 
          onClick={() => router.push('/rooms')}
          className="flex flex-col items-center gap-1 text-[#ADB5BD] hover:text-[#008075] transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
          <span className="text-[10px] font-medium">Rooms</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#ADB5BD] hover:text-[#008075] transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span className="text-[10px] font-medium">Rent</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#ADB5BD] hover:text-[#008075] transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>

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

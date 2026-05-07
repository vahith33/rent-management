"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BottomNav from "@/components/BottomNav";

export default function NotificationsPage() {
  const router = useRouter();

  const notifications = {
    today: [
      { id: 1, title: 'Rent Received', desc: 'Ravi Kumar paid ₹7,500 for Unit 402', time: '10m ago', unread: true, type: 'rent', color: 'bg-[#D1F2EB]', iconColor: 'text-[#008075]' },
      { id: 2, title: 'New Complaint', desc: 'Tap leaking in Room 1A. Urgent maintenance required.', time: '2h ago', unread: true, type: 'complaint', color: 'bg-[#EBF2FF]', iconColor: 'text-[#2D5BFF]' },
      { id: 3, title: 'New Tenant', desc: 'Added Anita M to Room 2B. Document verification pending.', time: '5h ago', unread: false, type: 'tenant', color: 'bg-[#F3E8FF]', iconColor: 'text-[#9F7AEA]' }
    ],
    yesterday: [
      { id: 4, title: 'Rent Overdue', desc: 'Siva K rent is 3 days overdue. Reminder sent.', time: '1d ago', unread: false, type: 'alert', color: 'bg-[#FFEDE8]', iconColor: 'text-[#F56565]' },
      { id: 5, title: 'Issue Resolved', desc: 'Electrical fault in Main Hall has been fixed by the team.', time: '1d ago', unread: false, type: 'resolve', color: 'bg-[#EDF2F7]', iconColor: 'text-[#718096]' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sans pb-32">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button onClick={() => router.back()} className="text-[#00685F]">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <h1 className="text-[19px] font-bold text-[#1A2B28]">Notifications</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
           <Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" alt="Profile" width={40} height={40} className="object-cover" />
        </div>
      </header>

      <main className="px-6 pt-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Today Section */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h2 className="text-[14px] font-black text-[#A0AEC0] uppercase tracking-[0.2em]">Today</h2>
              <button className="text-[13px] font-bold text-[#008075]">Mark all as read</button>
           </div>
           
           <div className="space-y-4">
              {notifications.today.map((n) => (
                <div key={n.id} className={`bg-white p-5 rounded-[28px] shadow-[0_15px_45px_rgba(0,0,0,0.03)] border border-slate-50 flex items-start gap-5 relative group active:scale-[0.98] transition-all ${n.id === 1 ? 'border-l-4 border-l-[#008075]' : ''}`}>
                   <div className={`${n.color} w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0`}>
                      {n.type === 'rent' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={n.iconColor}><polyline points="20 6 9 17 4 12"/></svg>}
                      {n.type === 'complaint' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={n.iconColor}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>}
                      {n.type === 'tenant' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={n.iconColor}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>}
                   </div>
                   <div className="flex-1 pt-1">
                      <div className="flex justify-between items-start mb-1">
                         <h3 className="text-[16px] font-bold text-[#1A2B28]">{n.title}</h3>
                         <span className="text-[11px] font-medium text-[#A0AEC0]">{n.time}</span>
                      </div>
                      <p className="text-[13px] font-medium text-[#718096] leading-relaxed pr-4">{n.desc}</p>
                   </div>
                   {n.unread && <div className="absolute right-6 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#008075] rounded-full ring-4 ring-teal-50"></div>}
                </div>
              ))}
           </div>
        </section>

        {/* Yesterday Section */}
        <section className="space-y-6">
           <h2 className="text-[14px] font-black text-[#A0AEC0] uppercase tracking-[0.2em] px-1">Yesterday</h2>
           
           <div className="space-y-4">
              {notifications.yesterday.map((n) => (
                <div key={n.id} className="bg-white p-5 rounded-[28px] shadow-[0_15px_45px_rgba(0,0,0,0.03)] border border-slate-50 flex items-start gap-5 group active:scale-[0.98] transition-all">
                   <div className={`${n.color} w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0`}>
                      {n.type === 'alert' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={n.iconColor}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
                      {n.type === 'resolve' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={n.iconColor}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>}
                   </div>
                   <div className="flex-1 pt-1">
                      <div className="flex justify-between items-start mb-1">
                         <h3 className="text-[16px] font-bold text-[#1A2B28]">{n.title}</h3>
                         <span className="text-[11px] font-medium text-[#A0AEC0]">{n.time}</span>
                      </div>
                      <p className="text-[13px] font-medium text-[#718096] leading-relaxed pr-4">{n.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        <p className="text-center text-[12px] font-bold text-[#CBD5E0] italic pt-8 pb-4">
           Showing your last 48 hours of activity
        </p>
      </main>

      {/* Bottom Navigation */}
    </div>
  );
}

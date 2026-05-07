"use client";

import { useRouter } from 'next/navigation';
import BottomNav from "@/components/BottomNav";

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sans pb-32">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center gap-6 sticky top-0 z-50">
        <button onClick={() => router.back()} className="p-1 text-[#00685F]">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 className="text-[20px] font-bold text-[#00685F]">Help & Support</h1>
      </header>

      <main className="px-6 pt-12 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Support Icon */}
        <div className="w-24 h-24 bg-[#D1F2EB] rounded-full flex items-center justify-center mb-8">
           <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00685F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>

        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-black text-[#1A2B28]">How can we help?</h2>
          <p className="text-[#718096] font-medium leading-relaxed max-w-[280px] mx-auto text-[15px]">
            Select your preferred way to connect with our elite property concierge team.
          </p>
        </div>

        {/* Request Call Card */}
        <div className="w-full bg-white rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col items-center text-center space-y-6 mb-8">
           <div className="w-20 h-20 bg-[#E6F4F3] rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00685F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
           </div>
           
           <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#1A2B28]">Request a Call</h3>
              <p className="text-[#718096] font-medium text-[15px] leading-relaxed">
                 Need assistance? Our support team will call you back within <span className="text-[#008075] font-bold">15 minutes</span>.
              </p>
           </div>

           <button className="w-full bg-[#00685F] py-5 rounded-[24px] text-white font-bold text-[17px] shadow-xl shadow-teal-900/10 active:scale-95 transition-all">
              Call Me Now
           </button>

           <div className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-[0.2em] pt-2">
              Available 24/7 • Premium Support
           </div>
        </div>

      </main>

      {/* Bottom Navigation */}
    </div>
  );
}

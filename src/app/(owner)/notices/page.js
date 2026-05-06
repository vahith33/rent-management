"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NoticesPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [category, setCategory] = useState("General");

  const categories = ["General", "Maintenance", "Emergency", "Rent Due"];

  const handleSend = () => {
    if (!message.trim()) return;
    setIsSending(true);
    // Mock sending process
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setMessage("");
        router.back();
      }, 2500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sans pb-12">
      <header className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-50">
        <button onClick={() => router.back()} className="p-2 hover:bg-[#F1F4F8] rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A2B28" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 className="text-xl font-bold text-[#1A2B28]">Broadcast Notice</h1>
      </header>

      <main className="px-6 pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-[#1A2B28]">Create Notice</h2>
          <p className="text-sm font-medium text-[#718096]">Send a message to all 24 registered tenants</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 space-y-8">
          {/* Category Selection */}
          <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ABB3B8] ml-1">Notice Category</label>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all border ${category === cat ? 'bg-[#008075] text-white border-[#008075] shadow-lg shadow-teal-900/10' : 'bg-[#F1F4F8] text-[#718096] border-transparent hover:bg-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ABB3B8] ml-1">Your Message</label>
            <div className="relative">
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your notice here (e.g. Maintenance scheduled for tomorrow...)"
                className="w-full h-48 bg-[#F1F4F8] rounded-[24px] p-6 text-[15px] font-medium text-[#1A2B28] outline-none focus:bg-white focus:ring-2 focus:ring-[#008075]/20 transition-all placeholder:text-[#ABB3B8] resize-none"
              />
              <div className="absolute bottom-4 right-6 text-[10px] font-bold text-[#ABB3B8] uppercase tracking-widest">
                {message.length} Characters
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-4">
             <button 
               onClick={handleSend}
               disabled={!message.trim() || isSending}
               className={`w-full py-5 rounded-[22px] font-bold text-lg flex items-center justify-center gap-3 transition-all ${!message.trim() ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#008075] text-white shadow-xl shadow-teal-900/20 active:scale-[0.98]'}`}
             >
               {isSending ? (
                 <>
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   Sending...
                 </>
               ) : (
                 <>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
                   Send to all Tenants
                 </>
               )}
             </button>
             <p className="text-center text-[10px] font-medium text-[#ABB3B8] uppercase tracking-widest">Sent via SMS & App Push Notification</p>
          </div>
        </div>

        {/* Recent History (Mock) */}
        <div className="space-y-4">
           <h3 className="text-[12px] font-bold text-[#ABB3B8] uppercase tracking-widest ml-1">Recently Sent</h3>
           <div className="bg-white p-6 rounded-[28px] border border-slate-50 flex items-center justify-between shadow-sm opacity-60 grayscale-[0.5]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div>
                   <p className="text-sm font-bold text-[#1A2B28]">Water Maintenance</p>
                   <p className="text-[10px] font-bold text-[#ABB3B8] uppercase">Emergency • Yesterday, 4:30 PM</p>
                </div>
              </div>
              <div className="text-[10px] font-black text-[#008075] uppercase tracking-widest">Delivered</div>
           </div>
        </div>
      </main>

      {/* Success Animation Overlay */}
      {sent && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-[#008075] rounded-full flex items-center justify-center mx-auto shadow-2xl animate-in zoom-in duration-500">
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-2xl font-bold text-[#1A2B28]">Notice Sent!</h2>
              <p className="text-[#718096] font-medium">All residents have been notified.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

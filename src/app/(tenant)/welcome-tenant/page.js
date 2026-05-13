"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function WelcomeTenantPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center justify-between pb-12 pt-20 px-6 font-sans">
      <div className="w-full max-w-[420px] flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-[#00624E]/20 rounded-full blur-2xl transform translate-y-6"></div>
          <div className="w-32 h-32 bg-[#00624E] rounded-full flex items-center justify-center relative z-10 shadow-2xl">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-black/5 blur-xl rounded-full tracking-tighter"></div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-4 mb-10">
          <h1 className="text-[34px] font-bold text-[#1A2B28] leading-[1.1]">
            Welcome back,<br />Ravi Kumar
          </h1>
          <p className="text-[#718096] text-[17px] font-medium leading-relaxed px-4">
            Your living experience with <span className="text-[#008075] font-bold">Pg Manager</span> continues.
          </p>
        </div>

        {/* Current Residence Card */}
        <div className="w-full bg-[#EEF2FF] rounded-[28px] p-6 flex items-center gap-4 mb-6 shadow-[0_10px_30px_rgba(238,242,255,0.8)] border border-white/40">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100/50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008075" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#718096]">Current Residence</span>
            <span className="text-xl font-bold text-[#1A2B28]">Premium Studio B-402</span>
          </div>
        </div>

        {/* Active Lease Hero Card */}
        <div className="w-full relative aspect-[1.8/1] rounded-[32px] overflow-hidden shadow-2xl group cursor-pointer border border-white/20">
          <Image 
            src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200" 
            alt="Active Lease" 
            fill 
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="absolute top-5 left-5">
            <div className="bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-white/50">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#008075]">Active Lease</span>
            </div>
          </div>

          <div className="absolute bottom-5 left-8 right-8 flex justify-between items-end">
            <div className="flex flex-col">
               <div className="w-12 h-1 bg-white opacity-40 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full max-w-[340px] mt-10">
        <button 
          onClick={() => router.push('/my-residence')}
          className="w-full bg-[#00624E] py-5 rounded-[22px] text-white font-bold text-lg shadow-xl shadow-teal-900/20 active:scale-[0.98] transition-all hover:bg-[#004D3D]"
        >
          Manage Residence
        </button>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="w-24 h-1.5 bg-slate-200/60 rounded-full mt-10"></div>
    </div>
  );
}

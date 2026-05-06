"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between py-12 px-6 safe-top safe-bottom">
      {/* Decorative top-right element */}
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-teal-100 rounded-tr-[50px] -z-10 mt-10 mr-10 opacity-50"></div>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 max-w-sm">
        {/* Success Icon */}
        <div className="relative">
          <div className="w-32 h-32 bg-[#00624E] rounded-full flex items-center justify-center shadow-xl shadow-teal-900/20">
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
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h1 className="text-[28px] font-bold text-[#111827] leading-tight px-4">
            Welcome back, Property Manager
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed px-6">
            You are now signed in to your StayEase owner account.
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-3 gap-3 w-full mt-8">
          <div className="aspect-4/5 rounded-2xl overflow-hidden relative shadow-sm">
            <Image 
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800" 
              alt="Apartment Interior" 
              fill 
              sizes="33vw"
              className="object-cover"
            />
          </div>
          <div className="aspect-4/5 rounded-2xl overflow-hidden relative shadow-sm">
            <Image 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800" 
              alt="Building Exterior" 
              fill 
              sizes="33vw"
              className="object-cover"
            />
          </div>
          <div className="aspect-4/5 rounded-2xl overflow-hidden relative shadow-sm">
            <Image 
              src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800" 
              alt="Living Room" 
              fill 
              sizes="33vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-sm mt-12">
        <button 
          onClick={() => router.push('/dashboard')}
          className="w-full bg-[#00624E] py-5 rounded-[22px] text-white font-bold text-lg shadow-xl shadow-teal-900/20 active:scale-[0.98] transition-all hover:bg-[#004D3D]"
        >
          Continue to Dashboard
        </button>
      </div>

      {/* Proprietary Footer */}
      <div className="mt-12">
        <p className="text-[10px] tracking-[0.2em] text-gray-400 font-medium uppercase">
          StayEase Proprietary System
        </p>
      </div>
    </div>
  );
}

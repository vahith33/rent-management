'use client'

import { ShieldAlert } from 'lucide-react'

export default function AdminError({ error, reset }) {
  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-10 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-xl font-black text-[#1A2B28]">Something went wrong</h2>
        <p className="text-sm font-medium text-[#718096] mt-2 mb-8">Something went wrong loading the admin dashboard.</p>
        <button
          onClick={() => reset()}
          className="bg-[#1A2B28] text-white px-8 py-4 rounded-[20px] font-bold active:scale-95 transition-transform w-full"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

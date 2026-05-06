"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangeMobilePage() {
  const router = useRouter();
  const [newNumber, setNewNumber] = useState("");
  const [step, setStep] = useState(1); // 1: Input, 2: OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSendOtp = () => {
    if (newNumber.length < 10) return;
    setStep(2);
  };

  const handleVerify = () => {
    if (otp.join("").length < 6) return;
    // Mock success
    router.push('/settings');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sans pb-12">
      <header className="bg-white px-6 py-6 flex items-center gap-6 sticky top-0 z-50">
        <button onClick={() => router.back()} className="p-1 text-[#00685F]">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 className="text-[20px] font-bold text-[#00685F]">Change Mobile</h1>
      </header>

      <main className="px-8 pt-12 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-[#1A2B28] leading-tight">
            {step === 1 ? 'Update Mobile Number' : 'Verify Identity'}
          </h2>
          <p className="text-[#718096] font-medium leading-relaxed">
            {step === 1 
              ? 'Enter your new mobile number. We will send you a verification code.' 
              : `We've sent a 6-digit code to +91 ${newNumber}`}
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-10">
             <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#4A5568] uppercase tracking-wider ml-1">New Mobile Number</label>
                <div className="bg-[#F0F4FF] rounded-[24px] py-6 px-8 flex items-center gap-4 border border-transparent focus-within:border-[#00685F] transition-all">
                   <span className="text-[17px] font-bold text-[#00685F]">+91</span>
                   <input 
                     type="tel"
                     value={newNumber}
                     onChange={(e) => setNewNumber(e.target.value)}
                     placeholder="00000 00000"
                     className="bg-transparent border-none w-full text-[17px] font-bold text-[#1A2B28] outline-none placeholder:text-slate-300"
                   />
                </div>
             </div>
             <button 
               onClick={handleSendOtp}
               disabled={newNumber.length < 10}
               className={`w-full py-6 rounded-[24px] font-bold text-[17px] shadow-xl transition-all ${newNumber.length >= 10 ? 'bg-[#00685F] text-white shadow-teal-900/20 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
             >
                Send OTP
             </button>
          </div>
        ) : (
          <div className="space-y-10">
             <div className="flex justify-between gap-3">
                {otp.map((digit, i) => (
                  <input 
                    key={i}
                    id={`otp-${i}`}
                    type="number"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-full aspect-square bg-[#F0F4FF] rounded-[18px] text-center text-xl font-black text-[#00685F] outline-none focus:ring-2 focus:ring-[#00685F] transition-all"
                  />
                ))}
             </div>
             <div className="space-y-6">
                <button 
                  onClick={handleVerify}
                  className="w-full bg-[#00685F] py-6 rounded-[24px] text-white font-bold text-[17px] shadow-xl shadow-teal-900/20 active:scale-95 transition-all"
                >
                   Verify & Update
                </button>
                <button className="w-full text-[14px] font-bold text-[#00685F] tracking-wide">Resend Code in 0:45</button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { classifyUser } from "@/actions/auth/classifyUser";
import { Suspense } from 'react';
import { toast } from "react-hot-toast";

function OtpVerifyContent() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef([]);
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    
    const { data, error: authError } = await supabase.auth.verifyOtp({
      email: email,
      token: enteredOtp,
      type: 'email',
    });

    if (authError) {
      setIsLoading(false);
      toast.error(authError.message);
      return;
    }

    toast.success("Login successful! Welcome back.");
    
    // Use server action to determine where to go
    const redirectPath = await classifyUser();
    router.push(redirectPath);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center font-sans selection:bg-[#008075]/10 antialiased p-6">
      <div className="w-full max-w-[440px] flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">
        <nav className="flex items-center gap-4 mb-16 px-2">
          <button onClick={() => router.push("/login")} className="p-2 hover:bg-[#008075]/5 rounded-full transition-all group">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008075" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <h1 className="text-[#008075] text-xl font-bold tracking-tight">Pg Manager</h1>
        </nav>

        <header className="mb-10 pl-2">
          <h2 className="text-[28px] font-bold text-[#1A2B28] mb-1">Verify your email</h2>
          <p className="text-[#718096] font-medium text-[15px]">
            OTP sent to <span className="text-[#1A2B28] font-bold">{email || "your email"}</span>
            <button onClick={() => router.push("/login")} className="ml-2 text-[#008075] font-bold hover:underline decoration-2">Change</button>
          </p>
        </header>

        <div className="flex gap-2.5 mb-8 justify-center">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (otpRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              disabled={isLoading}
              autoFocus={i === 0}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-[52px] h-[64px] rounded-2xl text-2xl font-bold text-center transition-all outline-none border-2 shadow-sm ${digit ? "bg-white border-[#008075] text-[#1A2B28] shadow-md" : "bg-[#F1F4F8] border-transparent text-[#1A2B28] focus:bg-white focus:border-[#008075] focus:shadow-md"} disabled:opacity-50`}
            />
          ))}
        </div>

        <p className="text-center text-[#718096] font-bold text-sm mb-12 flex items-center justify-center gap-1.5">
          Resend OTP in <span className="text-[#1A2B28] tabular-nums">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</span>
        </p>

        <button
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full bg-[#008075] py-5 rounded-[22px] text-white font-bold flex items-center justify-center gap-3 text-lg hover:bg-[#006E65] shadow-xl shadow-[#008075]/25 active:scale-[0.98] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Verify & Sign In 
              <div className="bg-white p-0.5 rounded-full flex items-center justify-center border-2 border-white/20 group-hover:bg-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#008075" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </>
          )}
        </button>

        <p className="text-center text-[10.5px] text-[#A0AEC0] mt-10 leading-relaxed px-6">
          By signing in, you agree to our <a href="#" className="text-slate-600 font-bold underline decoration-slate-400/30 hover:decoration-slate-400">Terms of Service</a><br className="hidden sm:block" /> and <a href="#" className="text-slate-600 font-bold underline decoration-slate-400/30 hover:decoration-slate-400">Privacy Policy</a>
        </p>

        <div className="mt-12 flex justify-center">
           <div className="w-12 h-1 bg-[#E2E8F0] rounded-full"></div>
        </div>
      </div>

    </div>
  );
}

export default function OtpVerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpVerifyContent />
    </Suspense>
  );
}

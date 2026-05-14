"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { updateOwnerProfile, getOwnerInfo } from "@/actions/owner";
import { toast } from "react-hot-toast";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const otpRefs = useRef([]);

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

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      // Get the owner ID BEFORE verifying OTP. 
      // Once OTP is verified, the auth email changes, which could break the fallback lookup.
      const ownerInfo = await getOwnerInfo();
      const currentOwnerId = ownerInfo.id;

      // 1. Verify the OTP with Supabase Auth (type: 'email_change' or 'email' depending on config)
      // For email change, Supabase uses 'email_change' type
      const { error: authError } = await supabase.auth.verifyOtp({
        email: email,
        token: enteredOtp,
        type: 'email_change',
      });

      if (authError) {
        // Fallback to 'email' type if 'email_change' is not the configured one
        const { error: secondTryError } = await supabase.auth.verifyOtp({
          email: email,
          token: enteredOtp,
          type: 'email',
        });

        if (secondTryError) {
          toast.error(authError.message);
          setIsLoading(false);
          return;
        }
      }

      // 2. Sync the new email to our 'owners' table
      // We explicitly pass the ownerId so the lookup doesn't fail.
      await updateOwnerProfile({ ownerId: currentOwnerId, email: email });

      toast.success("Email updated successfully");
      setSuccess(true);
      setTimeout(() => {
        router.push('/settings');
        router.refresh();
      }, 2000);

    } catch (err) {
      toast.error("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center font-sans p-6">
      <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <nav className="flex items-center gap-4 mb-12">
          <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-sm border border-slate-100 active:scale-90 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00685F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <h1 className="text-xl font-black text-[#1A2B28]">Verify Email</h1>
        </nav>

        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-50 flex flex-col items-center text-center space-y-10">
          <div className="space-y-3">
             <div className="w-16 h-16 bg-[#EBFBF8] rounded-2xl flex items-center justify-center mx-auto text-[#00685F] mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
             </div>
             <h2 className="text-[24px] font-black text-[#1A2B28]">Check your inbox</h2>
             <p className="text-[14px] font-medium text-[#718096] px-4">Enter the 6-digit code we sent to<br/><span className="font-bold text-[#1A2B28]">{email}</span></p>
          </div>

          <div className="flex gap-3 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (otpRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isLoading || success}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-[50px] h-[64px] rounded-2xl text-2xl font-black text-center transition-all outline-none border-2 ${digit ? "bg-white border-[#00685F] text-[#1A2B28]" : "bg-[#F1F4F8] border-transparent focus:bg-white focus:border-[#00685F]"}`}
              />
            ))}
          </div>

          <button 
            onClick={handleVerify} 
            disabled={isLoading || success}
            className="w-full bg-[#00685F] py-5 rounded-[22px] text-white font-black text-[17px] shadow-xl shadow-[#00685F]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : success ? (
              "Verified Successfully!"
            ) : "Verify & Update Email"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

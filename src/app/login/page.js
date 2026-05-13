"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { checkUserRegistration } from "@/actions/auth/checkUser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginContinue = async () => {
    setError("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Check if the user is registered in our system
      const registration = await checkUserRegistration(email);
      
      if (!registration.registered) {
        setError("This email is not registered. Please contact your property administrator.");
        setIsLoading(false);
        return;
      }

      // 2. If registered, send the OTP
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
      } else {
        router.push(`/otp-verify?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center font-sans selection:bg-[#008075]/10 antialiased">
      {/* Top Header with Gradient and House Icon */}
      <div className="w-full max-w-[440px] bg-linear-to-b from-[#008075] to-[#0D1F1D] rounded-b-[40px] p-10 pb-20 flex flex-col items-start gap-3 relative overflow-hidden">
        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10L12 3L21 10V21H16V14H8V21H3V10Z" />
          </svg>
        </div>
        <h1 className="text-white text-[22px] font-bold tracking-tight">Pg Manager</h1>
        <div className="absolute top-[-40px] right-[-40px] w-32 h-32 bg-[#008075] rounded-full blur-[60px] opacity-20"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[400px] -mt-10 bg-white rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col gap-6 z-10 mx-6 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
        <h2 className="text-[20px] font-bold leading-tight text-[#1A2B28] font-heading">
          Welcome back!<br />Enter your email
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold animate-in fade-in zoom-in-95">
            {error}
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-2 mt-2">
          <label className="text-[12px] font-bold uppercase tracking-widest text-[#ADB5BD] pl-1 font-body">Email Address</label>
          <div className="flex gap-1.5">
            <div className="flex items-center gap-2 bg-[#F1F4F8] px-4 py-4 rounded-2xl shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008075" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleLoginContinue()}
              className="flex-1 bg-[#F1F4F8] px-5 py-4 rounded-2xl text-[14px] font-medium text-[#1A2B28] outline-none focus:bg-white focus:ring-2 focus:ring-[#008075] transition-all font-body disabled:opacity-50"
            />
          </div>
      </div>

        <button 
          onClick={handleLoginContinue} 
          disabled={isLoading}
          className="w-full bg-[#008075] py-4.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 group hover:bg-[#006E65] transition-all active:scale-[0.98] mt-2 shadow-lg shadow-[#008075]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Continue <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </>
          )}
        </button>
        <p className="text-center text-[12px] text-[#A0AEC0] leading-relaxed px-4 font-body">
          By continuing, you agree to our <a href="#" className="text-[#008075] font-semibold underline decoration-[#008075]/30">Terms</a> and <a href="#" className="text-[#008075] font-semibold underline decoration-[#008075]/30">Privacy</a>
        </p>
      </div>

      <footer className="mt-auto mb-10 flex gap-10 text-[#718096]">
        <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:text-[#008075] transition-colors"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Help</button>
        <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:text-[#008075] transition-colors"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> Contact Support</button>
      </footer>
    </div>
  );
}

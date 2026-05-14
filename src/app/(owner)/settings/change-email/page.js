"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";

export default function ChangeEmailPage() {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      // Supabase updateUser with a new email automatically sends a verification code/link
      const { error: updateError } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (updateError) {
        toast.error(updateError.message);
        setIsLoading(false);
      } else {
        toast.success("Verification code sent to your new email");
        // Redirect to verification page
        router.push(`/settings/change-email/verify?email=${encodeURIComponent(newEmail)}`);
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center font-sans p-6">
      <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header */}
        <nav className="flex items-center gap-4 mb-12">
          <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-sm border border-slate-100 active:scale-90 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00685F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <h1 className="text-xl font-black text-[#1A2B28]">Change Email</h1>
        </nav>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 space-y-8">
          <div className="space-y-2">
            <h2 className="text-[22px] font-black text-[#1A2B28] leading-tight">Update your email</h2>
            <p className="text-[14px] font-medium text-[#718096]">We'll send a 6-digit verification code to your new email address.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#ADB5BD] ml-1">New Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="new@example.com"
                  value={newEmail}
                  disabled={isLoading}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#F1F4F8] px-6 py-5 rounded-[22px] text-[15px] font-bold text-[#1A2B28] outline-none focus:bg-white focus:ring-4 focus:ring-[#008075]/5 focus:border-[#008075] transition-all"
                />
              </div>
            </div>

            <button 
              onClick={handleSendOtp} 
              disabled={isLoading}
              className="w-full bg-[#00685F] py-5 rounded-[22px] text-white font-black text-[17px] shadow-xl shadow-[#00685F]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Send Verification Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

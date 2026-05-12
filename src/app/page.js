"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect root to the login page
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center font-sans tracking-tight">
      <div className="flex flex-col items-center gap-4 text-slate-400">
        <div className="w-12 h-12 border-4 border-[#008075]/20 border-t-[#008075] rounded-full animate-spin"></div>
        <p className="font-bold text-xs uppercase tracking-widest animate-pulse">Rent Manager Loading...</p>
      </div>
    </div>
  );
}

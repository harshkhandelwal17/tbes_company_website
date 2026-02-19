"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, ShieldCheck, LogOut } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      // Small delay to let the animation play and feel deliberate
      const timer = setTimeout(async () => {
        try {
          await axios.post("/api/admin/logout");
        } catch (error) {
          console.error("Logout failed", error);
        } finally {
          router.push("/admin/login");
          router.refresh();
        }
      }, 1500);

      return () => clearTimeout(timer);
    };

    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#05080F] relative overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* =======================
          1. BACKGROUND EFFECTS
      ======================== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.05]"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full"></div>
      </div>

      {/* =======================
          2. LOGOUT CONTENT
      ======================== */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 animate-in zoom-in-95 duration-500">
        
        {/* Animated Icon Wrapper */}
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
           <div className="w-20 h-20 bg-[#09090b] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl relative z-10">
              <LogOut size={32} className="text-zinc-400" />
           </div>
           
           {/* Spinner Overlay */}
           <div className="absolute -inset-1">
              <svg className="animate-spin w-22 h-22 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-0" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
           </div>
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Terminating Session</h1>
        
        <div className="flex items-center gap-2 text-sm text-zinc-500 bg-white/[0.03] px-4 py-2 rounded-full border border-white/[0.05]">
           <ShieldCheck size={14} className="text-green-500" />
           <span>Securely clearing credentials...</span>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-center">
         <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">TBES Global Admin</p>
      </div>

    </div>
  );
}
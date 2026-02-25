'use client';

import Link from 'next/link';
import { ArrowRight, Play, Layers, Maximize2, CheckCircle2, Cpu, ScanLine } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getYearsOfExperience, getProjectCount } from '@/lib/companyStats';

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const companyYears = useMemo(() => getYearsOfExperience(), []);
  const projectCount = useMemo(() => getProjectCount(), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full pt-32 pb-20 lg:min-h-screen lg:pt-0 lg:pb-0 flex items-center bg-[#030509] overflow-hidden selection:bg-blue-500/30">

      {/* =========================================
          1. CINEMATIC BACKGROUND EFFECTS
      ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Animated Radial Gradient - Acts as a spotlight */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-500/10 blur-[120px] rounded-full mix-blend-screen"></div>

        {/* Engineering Grid with Fade Mask */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.03]"
          style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* =========================================
              2. LEFT: TYPOGRAPHY & ACTIONS
          ========================================= */}
          <div className={`lg:col-span-6 space-y-8 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            {/* Glowing Tech Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-zinc-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase">ISO 19650 Certified Excellence</span>
            </div>

            {/* Main Headline with Depth Effect */}
            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-extrabold tracking-tight text-white leading-[1.1] relative">
              <span className="block text-zinc-100">We believe</span>
              <span className="block text-zinc-300">virtual reality is</span>
              
              {/* "The Future" with ambient glow behind it */}
              <span className="relative inline-block mt-2 mb-2">
                <span className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 blur-2xl opacity-30 -z-10 rounded-full"></span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-200 drop-shadow-sm">
                  The Future
                </span>
              </span>
              
              <span className="block text-zinc-400 text-3xl sm:text-4xl lg:text-[3rem] mt-2 font-bold tracking-normal">
                of construction industry.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-lg font-light border-l-2 border-blue-500/30 pl-4">
              Our optimized and cost-effective approach drives us to reach milestones within time and budgets, delivering excellence through our experienced team.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-[#030509] font-bold rounded-xl overflow-hidden transition-all hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center">
                  Start Project
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/[0.03] border border-white/[0.08] text-white font-medium rounded-xl hover:bg-white/[0.08] transition-all hover:scale-[1.02]"
              >
                <Play size={16} className="mr-2 fill-current text-blue-400" />
                Explore Portfolio
              </Link>
            </div>

            {/* Mobile Metrics */}
            <div className="lg:hidden grid grid-cols-3 gap-3 pt-8 border-t border-white/[0.08]">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">{companyYears}+</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Years Exp.</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">5M+</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Sq. Ft.</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">24/7</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Support</span>
              </div>
            </div>

          </div>

          {/* =========================================
              3. RIGHT: LAYERED 3D COMPOSITION
          ========================================= */}
          <div className={`hidden lg:block lg:col-span-6 relative h-[650px] w-full transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>

            {/* The Main Render Glass Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[400px] bg-zinc-900/40 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl p-2 z-10 group">
              <div className="w-full h-full relative rounded-[1.5rem] overflow-hidden bg-[#0a0f1a]">
                
                {/* Simulated Architectural Render */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#030509] via-transparent to-transparent opacity-90"></div>

               
              </div>
            </div>

          

            {/* Floating Element 2 (Bottom Left) */}
            <div className="absolute bottom-24 left-4 z-20 bg-white/[0.05] backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl animate-[bounce_5s_ease-in-out_infinite_reverse]">
               <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
                   <CheckCircle2 size={20} />
                 </div>
                 <div>
                   <p className="text-xs text-zinc-400 font-medium">MEPF & Architectural </p>
                   <p className="text-sm font-bold text-white">Zero Clashes</p>
                 </div>
               </div>
            </div>

          

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
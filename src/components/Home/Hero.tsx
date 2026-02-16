'use client';

import Link from 'next/link';
import { ArrowRight, Play, Layers, Box, Maximize2, CheckCircle2, MousePointer2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    // CHANGE: Mobile = auto height (pb-16), Desktop = min-h-screen
    <section className="relative w-full pt-28 pb-16 lg:min-h-screen lg:pt-0 lg:pb-0 flex items-center bg-[#080c14] overflow-hidden">
      
      {/* =========================================
          1. MOBILE BACKGROUND (Compact & Blended)
      ========================================= */}
      <div className="absolute inset-0 z-0 lg:hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1931&auto=format&fit=crop')" }}
        ></div>
        {/* Strong Gradient Overlay - Makes text pop & blends bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/95 via-[#080c14]/80 to-[#080c14]"></div>
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:30px_30px] opacity-[0.05]"></div>
      </div>

      {/* =========================================
          2. DESKTOP BACKGROUND (Clean Engineering)
      ========================================= */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:50px_50px] opacity-[0.1]"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          
          {/* =========================================
              3. TEXT CONTENT
          ========================================= */}
          <div className={`space-y-6 lg:space-y-8 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Tech Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-900/30 border border-blue-800/50 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-300 text-[10px] sm:text-xs font-mono tracking-wider uppercase">ISO 19650 Certified</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.15]">
              Virtual Design. <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300">
                Constructed Reality.
              </span>
            </h1>

            {/* Subtext - Optimized for Mobile Reading */}
            <p className="text-sm sm:text-lg text-slate-400 leading-relaxed max-w-xl font-light">
              We convert architectural drawings into clash-free <strong>LOD 500 BIM Models</strong>. Reduce on-site risks and visualize projects with engineering precision.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-all shadow-[0_4px_20px_-5px_rgba(37,99,235,0.5)] active:scale-95"
              >
                Start Project
                <ArrowRight size={18} className="ml-2" />
              </Link>
              
              <Link 
                href="/projects"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white/5 border border-white/10 text-slate-200 font-medium rounded-lg hover:bg-white/10 transition-all active:scale-95"
              >
                <Play size={16} className="mr-2 fill-current" />
                Case Studies
              </Link>
            </div>

            {/* Mobile Metrics (Compact Grid - No Scroll) */}
            <div className="lg:hidden pt-6 mt-4 border-t border-white/10">
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-white/5 rounded border border-white/5">
                        <div className="text-blue-400 font-bold text-lg">200+</div>
                        <div className="text-[9px] text-slate-400 uppercase">Projects</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded border border-white/5">
                        <div className="text-emerald-400 font-bold text-lg">LOD 500</div>
                        <div className="text-[9px] text-slate-400 uppercase">Detailing</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded border border-white/5">
                        <div className="text-orange-400 font-bold text-lg">100%</div>
                        <div className="text-[9px] text-slate-400 uppercase">Accuracy</div>
                    </div>
                </div>
            </div>

            {/* Desktop Metrics */}
            <div className="hidden lg:flex pt-8 border-t border-slate-800/60 gap-12">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <Layers size={18} className="text-blue-500" />
                     <p className="text-2xl font-bold text-white">LOD 500</p>
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider pl-7">Detail Level</p>
               </div>
               <div className="w-px h-12 bg-slate-800"></div>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <CheckCircle2 size={18} className="text-emerald-500" />
                     <p className="text-2xl font-bold text-white">Clash Free</p>
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider pl-7">MEP Coordination</p>
               </div>
            </div>
          </div>

          {/* =========================================
              4. DESKTOP VISUAL (Hidden on Mobile)
          ========================================= */}
          <div className={`hidden lg:block relative h-[600px] w-full transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            
            {/* Revit/BIM Dashboard Window */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[480px] bg-[#1a1f2e] rounded-xl border border-slate-700 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
               
               {/* Window Header */}
               <div className="h-9 bg-[#0f1219] border-b border-slate-700 flex items-center justify-between px-4">
                  <div className="flex gap-4 items-center">
                     <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                     </div>
                     <div className="text-[10px] font-mono text-slate-400">TBES_GLOBAL_PROJECT_V2.rvt</div>
                  </div>
                  <Maximize2 size={14} className="text-slate-500" />
               </div>

               {/* Viewport */}
               <div className="relative w-full h-full bg-[#111]">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

                  <div className="absolute inset-4 top-4 bottom-12 rounded border border-slate-800 overflow-hidden">
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                     
                     {/* Floating Badge */}
                     <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur px-3 py-2 rounded border border-white/10 flex items-center gap-3">
                         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                         <div className="text-[10px] text-white font-mono">RENDERING: LIVE</div>
                     </div>
                  </div>
                  
                  {/* Status Bar */}
                  <div className="absolute bottom-0 w-full h-8 bg-[#0f1219] border-t border-slate-700 flex items-center px-4 justify-between text-[10px] text-slate-500 font-mono">
                     <div>X: 1240.50 Y: 450.20</div>
                     <div>READY</div>
                  </div>
               </div>
            </div>

            {/* Back Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] bg-blue-500/10 blur-[90px] -z-10 rounded-full"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
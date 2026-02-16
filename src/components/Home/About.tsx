'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Target, Users } from 'lucide-react';

const About = () => {
  return (
    <section className="relative py-16 lg:py-32 bg-white overflow-hidden">
      
      {/* Subtle Background Text - Aesthetic Touch */}
      <div className="absolute top-10 left-10 text-[12vw] font-black text-slate-50 select-none leading-none z-0">
        ABOUT
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
          
          {/* =========================================
              1. VISUAL SECTION (Optimized for Mobile)
          ========================================= */}
          <div className="w-full lg:w-1/2 relative">
            {/* Image Container: Mobile pe Height kam rakhi hai */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video lg:aspect-square group">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop')" }}
              ></div>
              {/* Overlay with subtle branding */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              
              {/* Floating Badge (Hidden on very small mobile to save space, visible from sm up) */}
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hidden sm:flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">6+</div>
                 <div>
                    <p className="text-white text-xs font-bold uppercase tracking-wider">Years of Excellence</p>
                    <p className="text-blue-200 text-[10px]">Delivering Global BIM Standards</p>
                 </div>
              </div>
            </div>

            {/* Decorative Elements (Desktop Only) */}
            <div className="hidden lg:block absolute -top-6 -left-6 w-32 h-32 border-l-2 border-t-2 border-blue-600/20 rounded-tl-3xl -z-10"></div>
            <div className="hidden lg:block absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-blue-600/20 rounded-br-3xl -z-10"></div>
          </div>

          {/* =========================================
              2. CONTENT SECTION
          ========================================= */}
          <div className="w-full lg:w-1/2 space-y-8">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 bg-blue-600"></span>
                <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Company Overview</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.2]">
                We Bridge the Gap Between <br className="hidden sm:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Design & Construction.</span>
              </h2>
              
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                TBES Global is a leading BIM & CAD service provider. We create high-fidelity <strong>Digital Twins</strong> that allow architects and contractors to identify risks before ground is even broken.
              </p>
            </div>

            {/* Feature Grid: 2 columns even on mobile for compactness */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                { icon: ShieldCheck, title: "Precision", desc: "Zero-clash models" },
                { icon: Zap, title: "Speed", desc: "Fast turnarounds" },
                { icon: Target, title: "LOD 500", desc: "Detailed modeling" },
                { icon: Users, title: "Global", desc: "50+ Global clients" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-md transition-all group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <item.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-xs sm:text-sm">{item.title}</h4>
                    <p className="text-slate-500 text-[10px] sm:text-xs whitespace-nowrap">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Content in About Section */}
            <div className="pt-4 flex flex-wrap items-center gap-6">
              <Link 
                href="/about" 
                className="group inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-900/20"
              >
                Learn More 
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="flex items-center gap-2">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?u=${i+20}`} alt="client" className="w-full h-full object-cover" />
                       </div>
                    ))}
                 </div>
                 <p className="text-[11px] font-medium text-slate-500 italic">Trusted by industry leaders</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default About;
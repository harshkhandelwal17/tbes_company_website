'use client';

import { ShieldCheck, Zap, DollarSign, Clock, Award, CheckCircle2 } from 'lucide-react';

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Cost Efficiency",
      desc: "Save 20% on reworks.",
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    {
      icon: ShieldCheck,
      title: "Zero Error",
      desc: "ISO Certified QA.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      icon: Zap,
      title: "Rapid Delivery",
      desc: "Meeting tight deadlines.",
      color: "text-amber-400",
      bg: "bg-amber-500/10"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      desc: "Global coordination.",
      color: "text-purple-400",
      bg: "bg-purple-500/10"
    }
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-[#05080F] text-white overflow-hidden">
      
      {/* Background Grid Pattern (Very Subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.05] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* =========================================
              1. LEFT: Concise Content
          ========================================= */}
          <div className="w-full lg:w-2/5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              Why TBES Global
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-bold leading-tight tracking-tight text-slate-50">
              The Standard of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                BIM Excellence.
              </span>
            </h2>
            
            <p className="text-slate-400 text-sm lg:text-base max-w-md mx-auto lg:mx-0 leading-relaxed">
              We eliminate construction uncertainties using high-fidelity digital twins. Our process ensures that your vision is built exactly as designed, within budget.
            </p>

            <div className="hidden lg:flex items-center gap-6 pt-4">
               <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">98%</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Accuracy</span>
               </div>
               <div className="w-px h-10 bg-slate-800"></div>
               <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">LOD 500</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Precision</span>
               </div>
            </div>
          </div>

          {/* =========================================
              2. RIGHT: Compact Feature Grid
          ========================================= */}
          <div className="w-full lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {benefits.map((item, idx) => (
              <div 
                key={idx} 
                className="group relative p-5 lg:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/50 hover:bg-white/[0.06] transition-all duration-300 overflow-hidden"
              >
                {/* Background Accent Glow */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${item.bg}`}></div>
                
                <div className="flex items-center gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base lg:text-lg mb-0.5 group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 text-xs lg:text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Subtle Progress Bar Decoration */}
                <div className="mt-4 w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full w-0 group-hover:w-full transition-all duration-700 ease-out bg-gradient-to-r from-transparent to-blue-500`}></div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
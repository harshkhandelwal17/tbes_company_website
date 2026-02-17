'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Target, 
  History, 
  Globe2, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Milestone,
  Gem,
  Building2,
  Users2
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      
      {/* =========================================
          1. SLEEK HERO (Zero Space Waste)
      ========================================= */}
      <section className="relative pt-12 pb-16  lg:pb-32 bg-[#05080F] overflow-hidden">
        {/* Engineering Grid Background */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Engineering Trust Since 2018
            </div>
            <h1 className="text-4xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              We Bridge Design & <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Construction Reality.</span>
            </h1>
            <p className="text-base md:text-xl text-slate-400 leading-relaxed max-w-2xl font-light">
              TBES Global is a premier BIM consultancy transforming the AEC industry through data-rich digital twins and collaborative engineering.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          2. WHO WE ARE (Compact & Clean)
      ========================================= */}
      <section className="py-16 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Left: Content Card */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-blue-600"></span>
                <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Who We Are</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                An Innovative BIM <br className="hidden lg:block"/> Solutions Provider.
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Established in 2018 in Eastern India, TBES Global has rapidly evolved into a global service provider. We specialize in Building Information Modeling (BIM) for architects, contractors, and consultants worldwide.
              </p>
              
              <div className="bg-slate-50 border-l-4 border-blue-600 p-5 rounded-r-xl italic text-slate-700 font-medium">
                "Our mission is to uplift engineering value through collaborative design support and high-fidelity BIM adoption."
              </div>
            </div>

            {/* Right: Feature Matrix (Responsive 2-col) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { icon: Building2, label: "Infrastructure Excellence", desc: "Proven track record in major metro & city projects." },
                 { icon: Users2, label: "Collaborative Design", desc: "Working as an extension of your engineering team." },
                 { icon: Globe2, label: "Global Standards", desc: "Expertise in ISO 19650 and international building codes." },
                 { icon: Milestone, label: "Proven Legacy", desc: "Delivering BIM excellence since 2018." }
               ].map((item, idx) => (
                 <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                       <item.icon size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{item.label}</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          3. LAYING STONES (Project Visuals)
      ========================================= */}
      <section className="py-16 lg:py-32 bg-[#05080F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.3em]">Our Legacy</h2>
            <h3 className="text-3xl lg:text-5xl font-bold">Notable Global Achievements</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Doha Metro */}
             <div className="group relative rounded-3xl overflow-hidden aspect-video lg:aspect-[16/9]">
                <img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" alt="Doha Metro"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#05080F] via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                   <h4 className="text-2xl font-bold mb-2">Doha Metro</h4>
                   <p className="text-slate-400 text-sm max-w-xs">Major infrastructure project in the MENA region with large-scale BIM implementation.</p>
                </div>
             </div>

             {/* Lusail City */}
             <div className="group relative rounded-3xl overflow-hidden aspect-video lg:aspect-[16/9]">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" alt="Lusail City"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#05080F] via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                   <h4 className="text-2xl font-bold mb-2">Lusail City</h4>
                   <p className="text-slate-400 text-sm max-w-xs">Comprehensive infrastructure development project showcasing global capabilities.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          4. OUR VALUES (The Grid)
      ========================================= */}
      <section className="py-16 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-4">
             <div className="max-w-2xl">
                <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Our Approach</span>
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-4 leading-tight">Guided by Professional Religion & Excellence.</h3>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              { title: "Client Commitment", icon: Target, desc: "Our prime motto that sets us apart from global competition." },
              { title: "Continuous Effort", icon: Building2, desc: "Meeting rising market demands with consistent passion." },
              { title: "Core Religion", icon: Gem, desc: "Dedication, consistency, and trust are our organizational pillars." },
              { title: "Trust Building", icon: History, desc: "Developing continued services with our valuable long-term clients." },
              { title: "Engineering Value", icon: Building2, desc: "Our mission to add tangible engineering value to every project." },
              { title: "Cost Efficiency", icon: Award, desc: "Optimized approaches to reach milestones within budget and time." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-600/30 transition-all hover:shadow-xl group">
                 <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <item.icon size={24} />
                 </div>
                 <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                 <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          5. CTA (Compact)
      ========================================= */}
      <section className="py-16 lg:py-24">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0B0F19] rounded-[2.5rem] p-10 lg:p-20 relative overflow-hidden text-center">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full"></div>
               <div className="relative z-10 max-w-2xl mx-auto">
                  <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">Ready to Advance Your Project?</h2>
                  <p className="text-slate-400 mb-10">Experience the difference of working with a premier BIM consultancy.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Link href="/contact" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all active:scale-95">Get a Proposal</Link>
                     <Link href="/projects" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all active:scale-95">View Projects</Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default AboutPage;
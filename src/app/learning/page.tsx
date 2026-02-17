'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Users, Award, BookOpen, Target, CheckCircle2, 
  ArrowRight, Sparkles, GraduationCap, MonitorPlay, 
  Layers, FileText, Quote 
} from 'lucide-react';

const LearningPage = () => {
  const testimonials = [
    {
      name: "Debaprasad Santra",
      position: "BIM Engineer, Sudlows Consulting (Dubai)",
      content: "Arup Sir's teaching is exceptional. He thoroughly explains every topic, ensuring clarity and mastery. This personalized attention gave me the confidence to work internationally.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      name: "Kunal Das",
      position: "MEP Engineer, ITD Cementation",
      content: "TBES provided comprehensive practical learning. The instructors are knowledgeable, and the blend of theory with live project exposure is what sets them apart.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      name: "Kousik Ghosh",
      position: "BIM Professional",
      content: "I pursued the BIM Advanced Training. The training on AutoCAD and Revit was deeply tied to actual project workflows. I even got hired by TBES afterwards!",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop"
    }
  ];

  const courses = [
    {
      name: "AutoCAD Mastery",
      icon: <FileText size={32} className="text-blue-400" />,
      description: "Master 2D drafting and 3D design foundations. The starting point for every engineering career.",
      tags: ["2D/3D", "Drafting", "Industry Standard"]
    },
    {
      name: "Revit Architecture",
      icon: <Layers size={32} className="text-sky-400" />,
      description: "Dive into Building Information Modeling. Create intelligent 3D models for planning and construction.",
      tags: ["BIM", "3D Modeling", "Architecture"]
    },
    {
      name: "Navisworks Manage",
      icon: <Target size={32} className="text-green-400" />,
      description: "The ultimate project review tool. Master clash detection, coordination, and 4D simulation.",
      tags: ["Clash Detection", "Coordination", "4D"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#05080F] text-white font-sans selection:bg-orange-500/30">
      
      {/* =========================================
          1. HERO SECTION
      ========================================= */}
      <section className="relative pb-20 pt-2 lg:pb-32 overflow-hidden border-b border-white/5">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.05]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in zoom-in duration-500">
            <Sparkles size={12} /> Transform Your Career
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
            An Art Infused <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Learning Experience.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light mb-10">
            Don't just learn software. Learn how to <strong>Engineer</strong>. <br className="hidden md:block"/>
            Join our industry-led training programs designed for the future of construction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)] flex items-center justify-center gap-2 active:scale-95">
              Enquire Now <ArrowRight size={18} />
            </Link>
            <Link href="#courses" className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95">
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          2. STATS & TRUST
      ========================================= */}
      <div className="bg-[#0B0F19] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
            {[
              { label: "Students Trained", value: "500+", icon: Users },
              { label: "Placement Rate", value: "95%", icon: Target },
              { label: "Industry Mentors", value: "10+", icon: Award },
              { label: "Active Courses", value: "15+", icon: BookOpen },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center gap-1 px-4 text-center">
                <h4 className="text-3xl md:text-4xl font-bold text-white">{stat.value}</h4>
                <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest mt-1">
                  <stat.icon size={14} className="text-orange-500" />
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          3. WHY LEARN WITH US
      ========================================= */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <div className="order-2 lg:order-1 relative">
               {/* Image Container with Glow */}
               <div className="absolute -inset-4 bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl opacity-20 blur-2xl"></div>
               <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <Image 
                    src="/businessman-learning.jpg" 
                    alt="Learning Environment" 
                    width={600} 
                    height={400} 
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                  />
                  {/* Floating Badge */}
                  <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                        <GraduationCap size={20} />
                     </div>
                     <div>
                        <p className="text-white font-bold text-sm">Certified</p>
                        <p className="text-slate-300 text-[10px]">Autodesk Authorized</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <span className="text-orange-500 font-bold text-xs uppercase tracking-widest">Our Methodology</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-6">
                  Theory Meets <br/><span className="text-slate-500">Industry Reality.</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  We don't believe in just teaching tool commands. Our curriculum is built around <strong>real-world project workflows</strong> used by top firms globally.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Live Project Exposure with Real-time Scenarios",
                  "Training by Professionals with 10+ Years Exp",
                  "Placement Assistance & Career Guidance",
                  "Budget Friendly without compromising Quality"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/30 hover:bg-white/[0.07] transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-slate-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          4. TRAINING MODULE (FIXED IMAGE SIZE)
      ========================================= */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           
           <div className="max-w-3xl mx-auto mb-12">
             <h2 className="text-3xl font-bold text-white mb-4">Our Holistic Training Module</h2>
             <p className="text-slate-400">A structured path designed to take you from beginner to job-ready professional.</p>
           </div>

           {/* FIX: Constrained Container 
              We use max-w-5xl to prevent image from becoming too large.
              Added padding and border to make it look like a dashboard.
           */}
           <div className="relative max-w-5xl mx-auto bg-[#0B0F19] rounded-2xl p-2 border border-white/10 shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
              
              <div className="rounded-xl overflow-hidden bg-slate-900 relative group">
                 {/* Image */}
                 <Image
                   src="/training-module.png"
                   alt="Training Module Roadmap"
                   width={1200}
                   height={600}
                   className="w-full h-auto object-contain" // object-contain keeps aspect ratio clean
                 />
                 
                 {/* Optional: Hover Overlay Hint */}
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-white font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                       Comprehensive Syllabus
                    </span>
                 </div>
              </div>
           </div>

        </div>
      </section>

      {/* =========================================
          5. COURSES
      ========================================= */}
      <section id="courses" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-500 font-bold text-xs uppercase tracking-widest">Skill Up</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-3">Featured Courses</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="group relative bg-[#0B0F19] border border-white/5 rounded-3xl p-8 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                   <MonitorPlay size={80} />
                </div>

                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   {course.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">{course.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                   {course.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] uppercase font-bold text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                         {tag}
                      </span>
                   ))}
                </div>

                <button className="w-full py-3 rounded-xl border border-white/10 text-white font-bold text-sm hover:bg-orange-600 hover:border-orange-600 transition-all">
                   View Curriculum
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          6. TESTIMONIALS
      ========================================= */}
      <section className="py-20 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
             <div className="w-12 h-[2px] bg-orange-500"></div>
             <h2 className="text-3xl font-bold text-white">Alumni Success Stories</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-[#0B0F19] p-8 rounded-3xl border border-white/5 relative">
                <Quote className="absolute top-6 right-6 text-white/10" size={40} />
                
                <p className="text-slate-300 text-sm italic leading-relaxed mb-8 relative z-10">
                  "{t.content}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                   <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
                      <Image src={t.image} alt={t.name} width={48} height={48} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h4 className="text-white font-bold text-sm">{t.name}</h4>
                      <p className="text-orange-400 text-xs">{t.position}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          7. CTA FOOTER
      ========================================= */}
      <section className="py-24 text-center">
         <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Start Your Journey Today</h2>
            <p className="text-slate-400 mb-10 text-lg">
               Join thousands of professionals who have advanced their careers with TBES Global.
            </p>
            <div className="flex justify-center gap-6">
               <Link href="/contact" className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors shadow-xl">
                  Contact Admissions
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
};

export default LearningPage;
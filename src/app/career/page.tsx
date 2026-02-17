'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, Clock, Briefcase, Users, Award, Target, 
  ArrowRight, Sparkles, Building2, Search, Zap, 
  ChevronRight, IndianRupee, Send
} from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  department?: string;
  location: string;
  type: string;
  experience?: string;
  salary?: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  qualifications?: string;
  active: boolean;
  status?: string;
  createdAt: string;
}

const CareerPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setJobs(data.filter((job: Job) => job.active !== false));
          } else {
            setJobs([]);
          }
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const benefits = [
    {
      icon: Users,
      title: "World-Class Team",
      desc: "Collaborate with industry veterans on global infrastructure projects.",
      color: "blue"
    },
    {
      icon: Target,
      title: "High-Impact Work",
      desc: "Work on projects that define skylines and shape future cities.",
      color: "red"
    },
    {
      icon: Award,
      title: "Rapid Growth",
      desc: "Clear career paths with regular upskilling and certifications.",
      color: "orange"
    },
    {
      icon: Zap,
      title: "Modern Tech Stack",
      desc: "Access to premium BIM tools (Revit, Navisworks, Tekla) and hardware.",
      color: "yellow"
    }
  ];

  return (
    <div className="min-h-screen bg-[#05080F] text-white font-sans selection:bg-blue-500/30">
      
      {/* =========================================
          1. HERO SECTION
      ========================================= */}
      <section className="relative pt-2 pb-20 lg:pt-2 lg:pb-32 overflow-hidden border-b border-white/5">
        {/* Engineering Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.05]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in zoom-in duration-500">
            <Sparkles size={12} /> We Are Hiring
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
            Build the Future <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">With TBES Global.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light mb-10">
            Join a team of visionaries redefining the AECO industry through innovation, precision, and excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#openings" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 active:scale-95">
              View Openings <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================
          2. CULTURE & BENEFITS
      ========================================= */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Engineers Choose Us</h2>
            <p className="text-slate-400">More than just a job. It's a launchpad for your career.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item, idx) => (
              <div key={idx} className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/5 text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          3. JOB LISTINGS
      ========================================= */}
      <section id="openings" className="py-20 bg-[#020408] border-t border-white/5 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-blue-500 font-bold text-xs uppercase tracking-widest">Opportunities</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Current Openings</h2>
            </div>
            {/* Optional Filter Placeholder */}
            {/* <div className="flex gap-2">...</div> */}
          </div>

          {loading ? (
            /* Skeleton Loading */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-white/5 border border-white/5 animate-pulse"></div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            /* Job Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job._id} className="group flex flex-col bg-[#0B0F19] border border-white/5 rounded-3xl p-6 hover:border-blue-500/50 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] transition-all duration-300">
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                        <Building2 size={12} /> {job.department || 'Engineering'}
                      </p>
                    </div>
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                      <MapPin size={10} /> {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 text-slate-300 text-xs font-medium border border-white/10">
                      <Clock size={10} /> {job.type}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Experience</p>
                      <p className="text-sm text-white font-medium flex items-center gap-1">
                        <Award size={12} className="text-orange-400"/> {job.experience || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Salary</p>
                      <p className="text-sm text-white font-medium flex items-center gap-1">
                        <IndianRupee size={12} className="text-green-400"/> {job.salary || 'Best in Industry'}
                      </p>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Action */}
                  <div className="mt-auto">
                    <button className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                      Apply Position <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State (Friendly) */
            <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 border-dashed rounded-[2rem]">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-6">
                <Search size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Openings Right Now</h3>
              <p className="text-slate-400 text-center max-w-md mb-8">
                We are always looking for exceptional talent. Don't wait for an opening—create one.
              </p>
              <a href="mailto:hr@tbesglobal.com" className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2">
                Drop Your Resume <Send size={16} />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          4. CTA SECTION
      ========================================= */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Can't find what you're looking for?</h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            We are constantly growing. Send your portfolio to our HR team, and we'll keep you on our radar for future roles.
          </p>
          
          <div className="inline-flex flex-col items-center gap-4">
            <a 
              href="mailto:hr@tbesglobal.com"
              className="px-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all flex items-center gap-3 group"
            >
              <div className="p-2 bg-blue-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                <Send size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Email Us At</p>
                <p className="text-lg leading-none">hr@tbesglobal.com</p>
              </div>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CareerPage;
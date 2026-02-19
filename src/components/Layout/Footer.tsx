'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Mail, Phone, MapPin, Linkedin, Twitter, Youtube, 
  Instagram, Facebook, ArrowRight, ExternalLink, Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020408] text-white pt-20 pb-8 relative overflow-hidden border-t border-white/5 w-full">
      
      {/* =========================================
          1. BACKGROUND EFFECTS
      ========================================= */}
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.02] pointer-events-none"></div>
      
      {/* Glow Orbs */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =========================================
            2. MAIN FOOTER CONTENT (Responsive Grid)
        ========================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand Info (Takes up more space) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className=" p-1.5 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all">
                <Image
                  src="/footer_logo.png" 
                  alt="TBES Global Logo"
                  width={36}
                  height={36}
                  className="rounded-lg"
                />
              </div>
              <span className="text-2xl font-black tracking-tight uppercase italic">
                TBES <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 not-italic">GLOBAL</span>
              </span>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-light">
              An innovative BIM & Digital Twin solutions provider, serving architects and contractors globally with ISO-certified precision since 2018.
            </p>
            
            {/* Social Icons with Brand Colors on Hover */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Linkedin, color: 'hover:bg-[#0A66C2] hover:border-[#0A66C2]', link: 'https://www.linkedin.com/company/tbesglobalpvtltd' },
                { icon: Youtube, color: 'hover:bg-[#FF0000] hover:border-[#FF0000]', link: 'https://www.youtube.com/@tbesglobalprivatelimited4604' },
                { icon: Instagram, color: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent', link: 'https://www.instagram.com/tbesglobalprivatelimited/' },
                { icon: Facebook, color: 'hover:bg-[#1877F2] hover:border-[#1877F2]', link: 'https://www.facebook.com/TBESGLOBALPVTLTD/' },
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 transition-all duration-300 ${social.color} hover:text-white hover:-translate-y-1 shadow-lg`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 sm:mt-2">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Company
            </h4>
            <ul className="space-y-4">
              {['About Us', 'Projects', 'Career', 'Learning', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(' ', '')}`} 
                    className="text-slate-400 text-sm hover:text-blue-400 transition-all duration-300 flex items-center group inline-flex"
                  >
                    <ArrowRight size={14} className="mr-0 w-0 opacity-0 group-hover:w-4 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div className="lg:col-span-3 sm:mt-2">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Solutions
            </h4>
            <ul className="space-y-4">
              {['BIM Modeling', 'Scan to BIM', 'MEP Coordination', 'CAD Services', 'Structural Analysis'].map((service) => (
                <li key={service}>
                  <Link 
                    href="/services" 
                    className="text-slate-400 text-sm hover:text-cyan-400 transition-all duration-300 flex items-center group inline-flex"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 mr-3 group-hover:bg-cyan-400 transition-colors"></div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{service}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Details */}
          <div className="lg:col-span-3 sm:mt-2">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Global Support
            </h4>
            <div className="space-y-5">
              <a href="mailto:info@tbesglobal.com" className="flex items-start gap-4 group">
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-colors">
                  <Mail size={16} className="text-blue-400" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Email Us</span>
                  <span className="text-sm text-slate-300 group-hover:text-blue-400 transition-colors">info@tbesglobal.com</span>
                </div>
              </a>
              
              <a href="tel:+916294796582" className="flex items-start gap-4 group">
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 group-hover:bg-green-500/10 group-hover:border-green-500/30 transition-colors">
                  <Phone size={16} className="text-green-400" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Call Us</span>
                  <span className="text-sm text-slate-300 group-hover:text-green-400 transition-colors">+91 629 479 6582</span>
                </div>
              </a>

              <div className="flex items-start gap-4 group">
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                  <MapPin size={16} className="text-purple-400" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Headquarters</span>
                  <span className="text-sm text-slate-300 leading-snug">Durgapur, West Bengal,<br/>India - 713213</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            3. DEVELOPED BY & COPYRIGHT SECTION
        ========================================= */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-slate-500 text-xs font-medium text-center md:text-left">
            © {currentYear} TBES Global Pvt. Ltd. All rights reserved.
          </div>
          
          {/* Nexisparkx Badge */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-500">Crafted with</span>
            <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span className="text-slate-500">by</span>
            <a 
              href="https://nexisparkx.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-400 hover:text-white transition-all bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] group"
            >
              Nexisparkx Technologies
              <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
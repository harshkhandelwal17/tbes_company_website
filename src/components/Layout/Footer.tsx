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
    <footer className="bg-[#05080F] text-white pt-20 pb-8 relative overflow-hidden">
      
      {/* 1. TOP SEPARATION LINE (To distinguish from Contact Section) */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-1.5 rounded-xl shadow-lg">
                <Image
                  src="/footer_logo.png" 
                  alt="TBES Global Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <span className="text-xl font-black tracking-tight uppercase italic">TBES <span className="text-blue-500 not-italic">GLOBAL</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              An innovative BIM & Digital Twin solutions provider, serving architects and contractors globally with ISO-certified precision since 2018.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: Linkedin, color: 'hover:bg-blue-600', link: 'https://www.linkedin.com/company/tbesglobalpvtltd' },
                { icon: Youtube, color: 'hover:bg-red-600', link: 'https://www.youtube.com/@tbesglobalprivatelimited4604' },
                { icon: Instagram, color: 'hover:bg-pink-600', link: 'https://www.instagram.com/tbesglobalprivatelimited/' },
                { icon: Facebook, color: 'hover:bg-blue-700', link: 'https://www.facebook.com/TBESGLOBALPVTLTD/' },
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 transition-all duration-300 ${social.color} hover:text-white hover:-translate-y-1`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-blue-500/30 pb-2 w-fit">Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Projects', 'Career', 'Learning', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(' ', '')}`} 
                    className="text-slate-400 text-sm hover:text-blue-400 transition-colors flex items-center group"
                  >
                    <ArrowRight size={12} className="mr-0 opacity-0 group-hover:mr-2 group-hover:opacity-100 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-blue-500/30 pb-2 w-fit">Solutions</h4>
            <ul className="space-y-3">
              {['BIM Modeling', 'Scan to BIM', 'MEP Coordination', 'CAD Services', 'Structural Analysis'].map((service) => (
                <li key={service}>
                  <Link 
                    href="/services" 
                    className="text-slate-400 text-sm hover:text-blue-400 transition-colors flex items-center group"
                  >
                    <div className="w-1 h-1 rounded-full bg-blue-500/40 mr-2 group-hover:bg-blue-400 transition-colors"></div>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-blue-500/30 pb-2 w-fit">Global Support</h4>
            <div className="space-y-4">
              <a href="mailto:info@tbesglobal.com" className="flex items-start gap-3 group">
                <Mail size={16} className="text-blue-400 mt-1" />
                <span className="text-sm text-slate-400 group-hover:text-blue-400 transition-colors">info@tbesglobal.com</span>
              </a>
              <a href="tel:+916294796582" className="flex items-start gap-3 group">
                <Phone size={16} className="text-blue-400 mt-1" />
                <span className="text-sm text-slate-400 group-hover:text-blue-400 transition-colors">+91 629 479 6582</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-blue-400 mt-1" />
                <span className="text-sm text-slate-400">Durgapur, WB, India - 713213</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. DEVELOPED BY & COPYRIGHT SECTION */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-xs font-medium">
            © {currentYear} TBES Global Pvt. Ltd. All rights reserved.
          </div>
          
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-500">Developed with</span>
            <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span className="text-slate-500">by</span>
            <a 
              href="https://nexisparkx.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-400 hover:text-white transition-all bg-blue-500/5 px-3 py-1.5 rounded-full border border-blue-500/10 hover:border-blue-500/50 group"
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
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight, Phone, Mail, ArrowRight } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll logic for Glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'Learning', href: '/learning' },
    { name: 'Career', href: '/career' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* 1. TOP UTILITY BAR (Desktop Only) - Trust Builder */}
      <div className="hidden md:block bg-slate-900 text-slate-300 text-xs py-2 tracking-wide border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="font-medium">Leading BIM & CAD Solutions Provider</p>
          <div className="flex gap-6">
            <a href="mailto:info@tbesglobal.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={14} /> info@tbesglobal.com
            </a>
            <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} /> +91 987 654 3210
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg py-2 border-b border-slate-100'
            : 'bg-white py-4 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex-shrink-0 z-50 relative">
               <div className={`relative transition-all duration-300 ${scrolled ? 'h-10' : 'h-12'} w-auto`}>
                 <Image
                  src="/logo.png" 
                  alt="TBES Global"
                  width={788}
                  height={485}
                  className="h-full w-auto object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative text-sm font-semibold tracking-wide transition-colors ${
                    isActive(item.href) ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.name}
                  {/* Animated Underline */}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-blue-600 transition-all duration-300 ease-out ${
                     isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              ))}

              {/* CTA Button */}
              <Link
                href="/contact"
                className="ml-4 flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Contact Us <ArrowRight size={16} />
              </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu size={28} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* 3. MOBILE MENU (Slide-over Drawer) */}
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-[300px] bg-white shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <span className="font-bold text-lg text-slate-800">Menu</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex-1 overflow-y-auto py-4 px-2">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-lg text-base font-medium transition-all ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && <ChevronRight size={16} />}
                </Link>
              ))}
            </nav>
          </div>

          {/* Drawer Footer / CTA */}
          <div className="p-5 border-t border-gray-100 bg-gray-50">
             <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full justify-center items-center gap-2 bg-blue-700 text-white px-5 py-3.5 rounded-xl text-base font-semibold shadow-lg hover:bg-blue-800 transition-colors"
              >
                Get a Quote <ChevronRight size={18} />
              </Link>
             
             {/* Mobile Utility Info */}
             <div className="mt-6 space-y-3 text-center">
                <a href="tel:+919876543210" className="block text-sm text-slate-500 hover:text-blue-700 font-medium">
                  +91 987 654 3210
                </a>
                <a href="mailto:info@tbesglobal.com" className="block text-sm text-slate-500 hover:text-blue-700">
                  info@tbesglobal.com
                </a>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};



export default Header;

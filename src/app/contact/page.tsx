'use client';

import { useState } from 'react';
import { 
  Mail, Phone, MapPin, 
  CheckCircle2, ArrowRight, 
  Globe2, MessageSquare, Loader2 
} from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: 'General Inquiry',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const serviceOptions = [
    'BIM Modeling',
    'MEP Coordination',
    'Scan to BIM',
    '3D Rendering',
    'CAD Services',
    'General Inquiry'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          subject: `New Inquiry: ${form.serviceInterest}`,
        })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', company: '', serviceInterest: 'General Inquiry', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    // --------------------------------------------------------------------------
    // ROOT CONTAINER FIX: overflow-x-hidden is critical here to prevent horizontal scroll
    // --------------------------------------------------------------------------
    <div className="min-h-screen w-full bg-[#05080F] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      
      {/* =========================================
          1. BACKGROUND ACCENTS (Responsive Sizing)
      ========================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.05]"></div>
         
         {/* Top Right Blob - Fluid Width */}
         <div className="absolute top-0 right-0 w-[80vw] md:w-[600px] h-[80vw] md:h-[600px] bg-blue-600/10 blur-[60px] md:blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
         
         {/* Bottom Left Blob - Fluid Width */}
         <div className="absolute bottom-0 left-0 w-[70vw] md:w-[500px] h-[70vw] md:h-[500px] bg-purple-600/10 blur-[60px] md:blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-12 lg:pt-32 lg:pb-20">
        
        {/* =========================================
            2. HEADER SECTION
        ========================================= */}
        <div className="text-center mb-10 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 animate-in fade-in zoom-in duration-500">
            <MessageSquare size={12} /> Let's Connect
          </div>
          
          {/* Responsive Heading: Text size scales with screen */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
            Start Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Digital Journey.</span>
          </h1>
          
          <p className="text-sm sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed px-2">
            Ready to optimize your construction workflow? Our engineering team is ready to analyze your project needs.
          </p>
        </div>

        {/* =========================================
            3. MAIN GRID (Stack on Mobile, Grid on Desktop)
        ========================================= */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* --- FORM SECTION (Top on Mobile, Right on Desktop) --- */}
          {/* Using 'order-1' to show form first on mobile if desired, or remove to follow HTML order */}
          <div className="w-full lg:col-span-7 order-1 lg:order-2">
            <div className="w-full bg-[#0B0F19] border border-white/10 rounded-2xl lg:rounded-[2.5rem] p-5 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden">
              
              {/* Form Status Overlay */}
              {status === 'success' ? (
                <div className="absolute inset-0 z-20 bg-[#0B0F19] flex flex-col items-center justify-center text-center p-4 animate-in fade-in zoom-in duration-300">
                   <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={32} className="text-green-500" />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">Received!</h3>
                   <p className="text-slate-400 max-w-xs mb-8 text-sm sm:text-base">
                      We will review your requirements and contact you within 24 hours.
                   </p>
                   <button 
                      onClick={() => setStatus('idle')}
                      className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors text-sm"
                   >
                      Send Another
                   </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 relative z-10 w-full">
                  
                  {/* Name & Email Group */}
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                    <div className="space-y-2 w-full">
                      <label className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${focusedField === 'name' ? 'text-blue-400' : 'text-slate-500'}`}>Full Name</label>
                      <input 
                        type="text" name="name" required placeholder="John Doe"
                        value={form.name} onChange={handleChange}
                        onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all"
                      />
                    </div>

                    <div className="space-y-2 w-full">
                      <label className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${focusedField === 'email' ? 'text-blue-400' : 'text-slate-500'}`}>Email Address</label>
                      <input 
                        type="email" name="email" required placeholder="john@company.com"
                        value={form.email} onChange={handleChange}
                        onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone & Company Group */}
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                    <div className="space-y-2 w-full">
                      <label className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${focusedField === 'phone' ? 'text-blue-400' : 'text-slate-500'}`}>Phone (Optional)</label>
                      <input 
                        type="tel" name="phone" placeholder="+1 (555) 000-0000"
                        value={form.phone} onChange={handleChange}
                        onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all"
                      />
                    </div>

                    <div className="space-y-2 w-full">
                      <label className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${focusedField === 'company' ? 'text-blue-400' : 'text-slate-500'}`}>Company Name</label>
                      <input 
                        type="text" name="company" placeholder="Construct Inc."
                        value={form.company} onChange={handleChange}
                        onFocus={() => setFocusedField('company')} onBlur={() => setFocusedField(null)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 w-full">
                    <label className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${focusedField === 'service' ? 'text-blue-400' : 'text-slate-500'}`}>I'm Interested In</label>
                    <div className="relative w-full">
                      <select 
                        name="serviceInterest"
                        value={form.serviceInterest} onChange={handleChange}
                        onFocus={() => setFocusedField('service')} onBlur={() => setFocusedField(null)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all appearance-none cursor-pointer truncate pr-8"
                      >
                        {serviceOptions.map(opt => <option key={opt} value={opt} className="bg-[#0B0F19] text-white">{opt}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 w-full">
                    <label className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${focusedField === 'message' ? 'text-blue-400' : 'text-slate-500'}`}>Project Details</label>
                    <textarea 
                      name="message" required rows={4} 
                      placeholder="Tell us about your project scope..."
                      value={form.message} onChange={handleChange}
                      onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base sm:text-lg shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? (
                      <> <Loader2 className="animate-spin" size={20}/> Sending... </>
                    ) : (
                      <> Send Inquiry <ArrowRight size={20} /> </>
                    )}
                  </button>

                  <p className="text-center text-[10px] sm:text-xs text-slate-500 mt-4 px-2">
                    By submitting, you agree to our <a href="#" className="text-slate-400 hover:text-white underline">Privacy Policy</a>.
                  </p>

                </form>
              )}
            </div>

            {/* UX Steps: Mobile Stacked, Desktop Horizontal */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-slate-500 text-sm">
               <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold border border-white/10">1</span>
                  <span>Review (24h)</span>
               </div>
               <div className="w-px h-4 sm:w-8 sm:h-px bg-white/10"></div>
               <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold border border-white/10">2</span>
                  <span>Discovery Call</span>
               </div>
               <div className="w-px h-4 sm:w-8 sm:h-px bg-white/10"></div>
               <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold border border-white/10">3</span>
                  <span>Proposal</span>
               </div>
            </div>
          </div>

          {/* --- INFO SECTION (Bottom on Mobile, Left on Desktop) --- */}
          <div className="w-full lg:col-span-5 order-2 lg:order-1 space-y-8 lg:space-y-10">
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Direct Channels</h3>
              
              <a href="mailto:info@tbesglobal.com" className="w-full group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail size={20} />
                </div>
                <div className="min-w-0 overflow-hidden">
                  <p className="text-xs sm:text-sm text-slate-400 mb-0.5">Email Us</p>
                  <p className="text-base sm:text-lg font-bold text-white truncate">info@tbesglobal.com</p>
                </div>
              </a>

              <a href="tel:+916294796582" className="w-full group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
                  <Phone size={20} />
                </div>
                <div className="min-w-0 overflow-hidden">
                  <p className="text-xs sm:text-sm text-slate-400 mb-0.5">Call Us (Mon-Fri)</p>
                  <p className="text-base sm:text-lg font-bold text-white truncate">+91 629 479 6582</p>
                </div>
              </a>

              <div className="w-full group flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-400 mb-0.5">Global HQ</p>
                  <p className="text-base sm:text-lg font-bold text-white leading-snug">
                    Durgapur, West Bengal,<br /> India - 713213
                  </p>
                </div>
              </div>
            </div>

            {/* Global Visual */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-20 sm:p-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none"></div>
               <div className="relative z-10">
                  <Globe2 className="text-blue-400 mb-4" size={28} />
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Global Service Standards</h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                     We deliver ISO-19650 compliant BIM models to clients across the USA, UK, Middle East, and Australia.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                     {['🇺🇸', '🇬🇧', '🇦🇪', '🇦🇺', '🇮🇳'].map(flag => (
                        <span key={flag} className="text-base sm:text-lg bg-white/5 p-2 rounded-lg">{flag}</span>
                     ))}
                  </div>
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
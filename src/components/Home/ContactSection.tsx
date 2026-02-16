'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const ContactSection = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: 'BIM Modeling',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setForm({
          name: '',
          email: '',
          phone: '',
          company: '',
          serviceInterest: 'BIM Modeling',
          subject: '',
          message: ''
        });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send message.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="relative py-20 lg:py-28 bg-[#080C14] overflow-hidden" id="contact">

      {/* Background Tech Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* =========================================
              1. LEFT: Persuasive Info
          ========================================= */}
          <div className="w-full lg:w-1/2 space-y-10">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                Partner With Us
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Let's Build Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Digital Twin.</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-lg mx-auto lg:mx-0">
                Have a complex BIM requirement? Our engineers are ready to discuss your project scope and provide a tailored technical proposal.
              </p>
            </div>

            {/* Direct Contact Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <a href="mailto:info@tbesglobal.com" className="group flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Email Us</p>
                  <p className="text-white font-bold text-lg">info@tbesglobal.com</p>
                </div>
              </a>

              <a href="tel:+916294796582" className="group flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-emerald-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Call Support</p>
                  <p className="text-white font-bold text-lg">+91 629 479 6582</p>
                </div>
              </a>
            </div>

            <div className="flex items-start gap-3 text-slate-500 text-sm justify-center lg:justify-start">
              <MapPin size={18} className="text-blue-500" />
              <p>Benachity, Durgapur, West Bengal, India - 713213</p>
            </div>
          </div>

          {/* =========================================
              2. RIGHT: Modern Glass Form
          ========================================= */}
          <div className="w-full lg:w-1/2">
            <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-blue-500/20 to-transparent">
              <div className="bg-[#0D121F] rounded-[2.4rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">

                {status === 'success' ? (
                  <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 size={44} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">Message Received</h3>
                      <p className="text-slate-400">Our engineering team will contact you within 24 hours.</p>
                    </div>
                    <button
                      onClick={() => setStatus('idle')}
                      className="text-blue-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-2 mx-auto"
                    >
                      Send another message <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Full Name *</label>
                        <input
                          name="name" value={form.name} onChange={handleChange}
                          type="text" required placeholder="John Doe"
                          className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Work Email *</label>
                        <input
                          name="email" value={form.email} onChange={handleChange}
                          type="email" required placeholder="john@company.com"
                          className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Phone & Company Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Phone</label>
                        <input
                          name="phone" value={form.phone} onChange={handleChange}
                          type="tel" placeholder="+1 (555) 000-0000"
                          className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Company</label>
                        <input
                          name="company" value={form.company} onChange={handleChange}
                          type="text" placeholder="Your Company Ltd."
                          className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Service & Subject Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Service Needed</label>
                        <select
                          name="serviceInterest" value={form.serviceInterest} onChange={handleChange}
                          className="w-full bg-[#0D121F] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                        >
                          <option value="BIM Modeling">BIM Modeling</option>
                          <option value="Scan to BIM">Scan to BIM</option>
                          <option value="CAD Services">CAD Services</option>
                          <option value="3D Rendering">3D Rendering</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Subject *</label>
                        <input
                          name="subject" value={form.subject} onChange={handleChange}
                          type="text" required placeholder="Project Inquiry"
                          className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-1">Project Details *</label>
                      <textarea
                        name="message" value={form.message} onChange={handleChange}
                        required rows={3} placeholder="Describe your project scope..."
                        className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-all resize-none placeholder:text-slate-600"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {status === 'loading' ? (
                        <>Processing <Loader2 size={18} className="animate-spin" /></>
                      ) : (
                        <>Send Inquiry <Send size={18} className="group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg text-xs font-medium border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={16} className="shrink-0" />
                        {errorMessage}
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
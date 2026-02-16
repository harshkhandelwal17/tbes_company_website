'use client';

import { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Globe,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: 'General Inquiry',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const serviceOptions = [
    'General Inquiry',
    'BIM Modeling',
    'CAD Services',
    'Scan to BIM',
    '3D Rendering',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
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
          serviceInterest: 'General Inquiry',
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
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/12 w-64 h-64 bg-blue-500 bg-opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/12 w-96 h-96 bg-purple-500 bg-opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Let's Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Something Great</span>
          </h1>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
            Ready to transform your construction projects with advanced BIM technology?
            Our global team of engineers is here to help.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12">

          {/* Contact Form Section (Left - 7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white border-opacity-20 h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-black">Send Us a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Company Name</label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Your Company Ltd."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Service Interest */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">I'm interested in...</label>
                  <select
                    name="serviceInterest"
                    value={form.serviceInterest}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-200 outline-none transition-all cursor-pointer text-gray-700"
                  >
                    {serviceOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Subject *</label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project requirements..."
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-200 outline-none transition-all resize-none"
                    required
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={status === 'sending' || status === 'success'}
                  className={`w-full font-semibold py-4 px-6 rounded-xl transform transition-all duration-200 flex items-center justify-center gap-2
                    ${status === 'success'
                      ? 'bg-green-600 hover:bg-green-700 text-white cursor-default'
                      : 'bg-black hover:bg-gray-900 text-white hover:-translate-y-1 hover:shadow-lg'
                    }
                    ${status === 'sending' ? 'opacity-70 cursor-wait' : ''}
                  `}
                >
                  {status === 'sending' ? (
                    <>Sending...</>
                  ) : status === 'success' ? (
                    <>Message Sent <CheckCircle className="w-5 h-5" /></>
                  ) : (
                    <>Send Message <Send className="w-4 h-4" /></>
                  )}
                </button>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errorMessage}
                  </div>
                )}

                {status === 'success' && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Thank you! We have received your message and will get back to you shortly.
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Info Section (Right - 5 cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Contact Details Card */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 border border-white border-opacity-10">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                {[
                  { icon: <Mail className="w-5 h-5" />, title: 'Email Us', content: 'info@tbesglobal.com', link: 'mailto:info@tbesglobal.com' },
                  { icon: <Phone className="w-5 h-5" />, title: 'Call Us', content: '+91 629-479-6582', link: 'tel:+916294796582' },
                  { icon: <MapPin className="w-5 h-5" />, title: 'Visit Us', content: 'Durgapur, West Bengal, India', link: null },
                  { icon: <Clock className="w-5 h-5" />, title: 'Business Hours', content: 'Mon - Fri: 9:00 AM - 7:00 PM IST', link: null },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="w-12 h-12 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{item.title}</p>
                      {item.link ? (
                        <a href={item.link} className="text-white font-medium hover:text-blue-400 transition-colors">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-white font-medium">{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Reach Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:translate-x-5 group-hover:-translate-y-5 transition-transform duration-500"></div>

              <Globe className="w-12 h-12 mb-6 text-blue-200" />
              <h3 className="text-2xl font-bold mb-4">Global Reach</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                We serve clients worldwide, delivering standardized BIM solutions across different time zones and regional standards.
              </p>

              <div className="flex flex-wrap gap-2">
                {['USA', 'UK', 'Europe', 'Middle East', 'Australia', 'India'].map((region) => (
                  <span key={region} className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-medium">
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Company blurb at bottom */}
        <div className="text-center mt-16 border-t border-gray-800 pt-16">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-white bg-opacity-5 border border-white border-opacity-10 mb-6">
            <Building2 className="w-5 h-5 text-gray-400 mx-2" />
            <span className="text-gray-300 text-sm font-medium pr-2">The BIM Engineering Studio</span>
          </div>
          <p className="text-gray-500 max-w-3xl mx-auto">
            Established in 2018, TBES Global specializes in providing collaborative and coordinated design support
            that helps deliver exceptional results for our clients.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

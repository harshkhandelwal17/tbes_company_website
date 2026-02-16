'use client';

import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Globe } from 'lucide-react';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const reviews = [
    {
      text: "Good job on the project with very little errors!!! Thank you very much and wish your team all the best. The detail in LOD 400 was exceptional.",
      author: "Senior Architect",
      company: "K.M. Design Studio",
      location: "United States"
    },
    {
      text: "I am impressed with the work. It looks better than I thought it could be!!! I definitely look forward to working with TBES again on our next high-rise.",
      author: "Project Manager",
      company: "B.H. Construction",
      location: "United Kingdom"
    },
    {
      text: "Great progress. Thank you guys for the dedicated effort on the MEP coordination. The clash reports were extremely helpful.",
      author: "BIM Lead",
      company: "R.E. Engineering",
      location: "UAE"
    }
  ];

  const next = () => setCurrent(current === reviews.length - 1 ? 0 : current + 1);
  const prev = () => setCurrent(current === 0 ? reviews.length - 1 : current - 1);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest border border-blue-100">
            Global Success Stories
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900">
            Trusted by <span className="text-blue-600">Visionaries.</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden border border-slate-100 shadow-sm">
            
            {/* Background Quote Decoration */}
            <Quote className="absolute top-10 left-10 text-blue-50 w-32 h-32 -z-0" />

            <div className="relative z-10">
              {/* Rating Stars */}
              <div className="flex gap-1 mb-8 justify-center md:justify-start">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed italic mb-10 text-center md:text-left">
                "{reviews[current].text}"
              </p>

              {/* Author Info & Country Badge */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-slate-200 pt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {reviews[current].author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-lg leading-tight">{reviews[current].author}</h4>
                    <p className="text-slate-500 text-sm">{reviews[current].company}</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                  <Globe size={14} className="text-blue-500" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {reviews[current].location}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Arrows (Desktop) */}
            <div className="hidden md:flex absolute bottom-16 right-16 gap-3">
              <button 
                onClick={prev}
                className="p-3 rounded-full border border-slate-200 hover:bg-blue-600 hover:text-white transition-all bg-white shadow-sm active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={next}
                className="p-3 rounded-full border border-slate-200 hover:bg-blue-600 hover:text-white transition-all bg-white shadow-sm active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Controls (Mobile) */}
          <div className="flex md:hidden justify-center items-center gap-6 mt-10">
            <button onClick={prev} className="p-3 text-slate-400 hover:text-blue-600"><ChevronLeft size={24} /></button>
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}
                />
              ))}
            </div>
            <button onClick={next} className="p-3 text-slate-400 hover:text-blue-600"><ChevronRight size={24} /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
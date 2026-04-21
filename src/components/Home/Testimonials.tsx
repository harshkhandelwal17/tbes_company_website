'use client';

import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Globe } from 'lucide-react';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default fallback reviews (original ones)
  const defaultReviews = [
    {
      text: "Good job team . it is really impressive to work with the team!",
      author: "Senior Architect",
      company: "T.J. Design Studio",
      rating: 5
    },
    {
      text: "I am impressed with the work. It looks better than I thought it could be!!! I definitely look forward to work with the team in the future.",
      author: "Project Manager",
      company: "B.H. Construction",
      rating: 5
    },
    {
      text: "Great progress. Thank you guys for the dedicated effort!",
      author: "BIM Lead",
      company: "R.E.",
      rating: 5
    },
    {
      text: "Good job on the project with very little errors!!! Thankyou very much and wish your team all the best!",
      author: "BIM Lead",
      company: "K M",
      rating: 5
    }
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        } else {
          setReviews(defaultReviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews(defaultReviews);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const activeReviews = reviews.length > 0 ? reviews : defaultReviews;

  const next = () => setCurrent((prev) => (prev === activeReviews.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? activeReviews.length - 1 : prev - 1));

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || activeReviews.length <= 1) return;
    const timer = setInterval(() => {
      next();
    }, 5000); // Changes every 5 seconds
    return () => clearInterval(timer);
  }, [current, isPaused, activeReviews.length]);

  return (
    <section className="py-20 lg:py-32 bg-white overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =========================================
            1. SECTION HEADER
        ========================================= */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-blue-100">
            Global Success Stories
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Visionaries</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="max-w-5xl mx-auto h-[450px] bg-slate-50 animate-pulse rounded-[3rem] border border-slate-100 flex items-center justify-center">
            <div className="text-slate-300 font-medium">Loading success stories...</div>
          </div>
        ) : (
          /* =========================================
              2. TESTIMONIAL CARD (Responsive & Fixed)
          ========================================= */
          <div
            className="relative max-w-5xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="bg-slate-50/80 backdrop-blur-sm rounded-[2rem] md:rounded-[3rem] p-6 sm:p-10 md:p-16 relative border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between min-h-[400px] md:min-h-[450px]">

              {/* Background Quote Decoration (Pointer events none taaki click block na ho) */}
              <Quote className="absolute top-8 left-8 md:top-12 md:left-12 text-slate-200 w-24 h-24 md:w-40 md:h-40 -z-0 opacity-50 pointer-events-none transform -rotate-12" />

              <div className="relative z-10 flex-1 flex flex-col justify-center">

                <div className="flex gap-1.5 mb-2 md:mb-10 justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 md:w-6 md:h-6 drop-shadow-sm ${i < (activeReviews[current]?.rating || 5)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-200 fill-slate-200'
                        }`}
                    />
                  ))}
                </div>

                {/* Review Text with Animation Key */}
                <div key={current} className="animate-in fade-in slide-in-from-right-8 duration-500 ease-out">
                  <p className="text-xl sm:text-2xl md:text-2xl lg:text-2xl font-medium text-slate-800 leading-snug md:leading-relaxed tracking-tight">
                    "{activeReviews[current]?.text}"
                  </p>
                </div>

              </div>

              {/* =========================================
                3. FOOTER: AUTHOR & CONTROLS
            ========================================= */}
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 border-t border-slate-200/80 pt-8 mt-8">

                {/* Author Info & Country Badge - Animated */}
                <div key={`author-${current}`} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-blue-500/20 shrink-0">
                      {activeReviews[current]?.author?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold text-base md:text-lg leading-tight">{activeReviews[current]?.author}</h4>
                      <p className="text-slate-500 text-sm">{activeReviews[current]?.company}</p>
                    </div>
                  </div>

                  {/* Vertical Divider (Desktop only) */}
                  <div className="hidden sm:block w-px h-8 bg-slate-300"></div>


                </div>

                {/* Navigation Arrows (Safe from overlapping) */}
                <div className="flex items-center gap-3 self-start md:self-auto">
                  <button
                    onClick={prev}
                    className="p-3.5 rounded-full border border-slate-200 hover:border-blue-600 hover:bg-blue-600 text-slate-600 hover:text-white transition-all bg-white shadow-sm active:scale-95 group"
                    aria-label="Previous Testimonial"
                  >
                    <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={next}
                    className="p-3.5 rounded-full border border-slate-200 hover:border-blue-600 hover:bg-blue-600 text-slate-600 hover:text-white transition-all bg-white shadow-sm active:scale-95 group"
                    aria-label="Next Testimonial"
                  >
                    <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </div>
            </div>

            {/* =========================================
              4. DOT INDICATORS (Below Card)
          ========================================= */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {activeReviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                />
              ))}
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
'use client';

import { Building2, Users2, Layers, Globe2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

// --- Counter Hook (Same as before) ---
const Counter = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={countRef}>{count}</span>;
};

const Stats = () => {
  const stats = [
    {
      icon: Building2,
      value: 200,
      suffix: "+",
      label: "Projects Delivered",
      desc: "Residential & Commercial"
    },
    {
      icon: Layers,
      value: 5,
      suffix: "M+",
      label: "Sq. Ft. Modeled",
      desc: "LOD 300-500 Precision"
    },
    {
      icon: Users2,
      value: 50,
      suffix: "+",
      label: "Happy Clients",
      desc: "USA, UK, UAE & India"
    },
    {
      icon: Globe2,
      value: 100,
      suffix: "%",
      label: "On-Time Delivery",
      desc: "ISO Certified Process"
    }
  ];

  return (
    <section className="relative z-30 px-4 sm:px-6 lg:px-8 pointer-events-none bg-white lg:bg-transparent pb-10 lg:pb-0">
      <div className="max-w-7xl mx-auto">
        
        {/* CHANGE 1: MARGIN LOGIC 
           Mobile: mt-10 (Creates space below Hero, NO overlap)
           Desktop: -mt-24 (Keeps the overlap effect you liked)
        */}
        <div className="relative mt-10 lg:-mt-24 pointer-events-auto">
          
          {/* Main Container */}
          <div className="bg-white rounded-2xl shadow-xl lg:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100 relative group">
            
            {/* Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400"></div>

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            {/* CHANGE 2: GRID & BORDERS 
               Mobile: 2 Columns (2x2 Grid). Borders adjusted so no double borders.
               Desktop: 4 Columns (1 Row).
            */}
            <div className="grid grid-cols-2 lg:grid-cols-4 relative z-10">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                
                return (
                  <div 
                    key={index} 
                    className={`
                      relative p-5 lg:p-10 flex flex-col items-center text-center transition-all duration-300
                      hover:bg-slate-50 cursor-default group/item
                      
                      {/* BORDER LOGIC FOR RESPONSIVENESS */}
                      /* Mobile: Right border on odd items (1st, 3rd) */
                      ${index % 2 === 0 ? 'border-r border-slate-100 lg:border-r-0' : ''}
                      
                      /* Mobile: Bottom border on top row items (1st, 2nd) */
                      ${index < 2 ? 'border-b border-slate-100 lg:border-b-0' : ''}
                      
                      /* Desktop: Right border on everything except last item */
                      ${index !== 3 ? 'lg:border-r lg:border-slate-100' : ''}
                    `}
                  >
                    {/* Hover Glow */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-400/20 blur-xl rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"></div>

                    {/* Icon */}
                    <div className="mb-3 lg:mb-5 relative">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 transition-all duration-300 group-hover/item:bg-blue-600 group-hover/item:text-white group-hover/item:border-blue-500 group-hover/item:shadow-lg group-hover/item:shadow-blue-500/30 group-hover/item:scale-110">
                        <Icon size={20} className="lg:w-6 lg:h-6" strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Number */}
                    <div className="text-2xl lg:text-4xl font-extrabold text-slate-900 mb-1 tracking-tight flex items-center group-hover/item:text-blue-600 transition-colors">
                      <Counter end={stat.value} />
                      <span className="text-blue-500 ml-0.5">{stat.suffix}</span>
                    </div>

                    {/* Label */}
                    <div className="text-xs lg:text-sm font-bold text-slate-800 uppercase tracking-wide mb-1">
                      {stat.label}
                    </div>

                    {/* Description (Hidden on very small screens to save space if needed, currently visible) */}
                    <div className="text-[10px] lg:text-xs text-slate-400 font-medium max-w-[140px] leading-tight">
                      {stat.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Only Decor */}
          <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full bg-slate-900/5 rounded-2xl hidden lg:block"></div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
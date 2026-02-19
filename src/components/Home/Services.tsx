'use client';

import Link from 'next/link';
import {
  ArrowRight, ChevronRight, CheckCircle
} from 'lucide-react';
import DynamicIcon from '@/components/DynamicIcon';

interface Service {
  _id: string;
  slug: string; // Used for ID in the new design? Old design used '01', '02'..
  title: string;
  icon: string;
  description: string;
  outcome?: string;
  order?: number;
}

const Services = ({ services }: { services: Service[] }) => {
  // If no services passed, don't crash, maybe show nothing or generic?
  // We assume services are passed.

  // Sort by order just in case
  const sortedServices = [...services].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Take top 6 or map all? Homepage usually shows a subset or all.
  // The original had 6. Let's show up to 6 or all if reasonable.
  const displayServices = sortedServices.slice(0, 6);

  return (
    <section className="relative py-20 lg:py-4 bg-white overflow-hidden">

      {/* Background Subtle Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <div className="max-w-3xl mb-16 lg:mb-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-12 bg-blue-600"></div>
            <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.3em]">Our Specializations</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-6">
            Engineering the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
              Future of Infrastructure.
            </span>
          </h2>
          <p className="text-slate-500 text-lg lg:text-xl max-w-2xl leading-relaxed">
            We provide end-to-end BIM & CAD solutions that bridge the gap between design intent and construction reality.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-10 lg:gap-y-12">
          {displayServices.map((service, index) => (
            <div
              key={service._id}
              className="group relative flex flex-col bg-slate-50/50 hover:bg-white p-8 lg:p-10 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)]"
            >
              {/* Background ID Number */}
              <span className="absolute top-6 right-8 text-6xl font-black text-slate-100 group-hover:text-blue-50 transition-colors duration-500 select-none">
                0{index + 1}
              </span>

              <div className="relative z-10 flex-1">
                {/* Icon Box */}
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:border-blue-500 mb-8">
                  <DynamicIcon name={service.icon} size={28} />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {service.description.length > 80 ? service.description.substring(0, 80) + '...' : service.description}
                </p>

                {/* Performance Outcome Label */}
                {service.outcome && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-8">
                    <CheckCircle size={12} />
                    {service.outcome}
                  </div>
                )}
              </div>

              {/* Action Link */}
              <Link
                href={`/services/${service.slug}`}
                className="relative z-10 mt-auto inline-flex items-center gap-2 text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-all uppercase tracking-widest"
              >
                Learn More
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 font-medium">Need a custom BIM workflow for your project?</p>
          <div className="flex gap-4">
            <Link
              href="/services"
              className="px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
            >
              View All Services
            </Link>
            <Link
              href="/contact"
              className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
            >
              Request a Consultation
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Services;
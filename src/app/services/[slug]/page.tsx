import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, CheckCircle2,
    TrendingUp, Layers, Phone, Mail, FileText, ArrowRight,
    Search, Workflow, PackageCheck, HelpCircle, ChevronDown, Monitor
} from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import DynamicIcon from '@/components/DynamicIcon';

interface ServiceDocument {
    title: string;
    icon: string;
    description: string;
    details: string[];
    software: string[];
    image: string;
    color?: string;
    slug: string;
    benefits: string[];
    features: string[];
    process: { title: string; description: string }[];
    keyDeliverables: string[];
    faqs: { question: string; answer: string }[];
}

async function getService(slug: string): Promise<ServiceDocument | null> {
    await connectDB();
    const service = await Service.findOne({ slug }).lean();
    if (!service) return null;
    return JSON.parse(JSON.stringify(service)); // Serialize for Next.js
}

export default async function ServiceDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const service = await getService(slug);

    if (!service) {
        notFound();
    }

    // Define benefits statically since they aren't in the DB model yet, 
    // or default to a generic list if not present.
    // For now, we'll use a generic set or map if we needed specific benefits per service type,
    // but let's stick to a generic beneficial text or standard benefits for now to keep it dynamic.
    const benefits = [
        'Standard Compliance',
        'High Precision',
        'Cost-Effective',
        'Timely Delivery'
    ];

    const displayBenefits = service.benefits && service.benefits.length > 0 ? service.benefits : benefits;
    const color = service.color || 'blue';

    // Maps Tailwind color names → actual hex values (CSS vars don't exist in Tailwind at runtime)
    const colorMap: Record<string, { accent: string; gradStart: string; gradEnd: string }> = {
        blue: { accent: '#3b82f6', gradStart: '#2563eb', gradEnd: '#1e3a8a' },
        indigo: { accent: '#6366f1', gradStart: '#4f46e5', gradEnd: '#312e81' },
        emerald: { accent: '#10b981', gradStart: '#059669', gradEnd: '#064e3b' },
        purple: { accent: '#a855f7', gradStart: '#9333ea', gradEnd: '#581c87' },
        orange: { accent: '#f97316', gradStart: '#ea580c', gradEnd: '#7c2d12' },
        rose: { accent: '#f43f5e', gradStart: '#e11d48', gradEnd: '#881337' },
        cyan: { accent: '#06b6d4', gradStart: '#0891b2', gradEnd: '#164e63' },
        slate: { accent: '#64748b', gradStart: '#475569', gradEnd: '#1e293b' },
    };
    const clr = colorMap[color] ?? colorMap['blue'];

    return (
        <div className="min-h-screen bg-[#05080F] text-white font-sans selection:bg-blue-500/30">

            {/* =========================================
            1. IMMERSIVE HERO
        ========================================= */}
            <section className="relative pt-4 pb-20 lg:pt-4 lg:pb-32 overflow-hidden border-b border-white/5">
                {/* Background Grid & Glow */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.05]"></div>

                {/* Service Image Background */}
                {service.image && (
                    <div className="absolute inset-0 z-0">
                        <img src={service.image} alt="" className="w-full h-full object-cover opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#05080F]/80 via-[#05080F] to-[#05080F]"></div>
                    </div>
                )}

                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/services" className="inline-flex items-center text-slate-400 hover:text-white mb-8 group transition-colors text-sm font-medium">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-blue-600 transition-colors">
                            <ArrowLeft size={16} />
                        </div>
                        Back to All Services
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div
                            className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.3)] border border-blue-400/20"
                            style={{ background: `linear-gradient(to bottom right, ${clr.gradStart}, ${clr.gradEnd})` }}
                        >
                            <DynamicIcon name={service.icon} size={40} className="text-white" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="h-px w-8 bg-blue-500"></span>
                                <span className="font-bold text-[10px] uppercase tracking-[0.3em]" style={{ color: clr.accent }}>Advanced BIM Strategy</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">{service.title}</h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
            2. MAIN CONTENT LAYOUT
        ========================================= */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-6">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* --- LEFT CONTENT COLUMN --- */}
                    <div className="lg:col-span-8 space-y-20">

                        {/* Description & Features */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-6">Service Overview</h2>
                                <p className="text-lg text-slate-400 leading-relaxed font-light">
                                    {service.description}
                                </p>
                            </div>

                            {/* Features Grid */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                {service.features?.map((feature, idx) => (
                                    <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start group hover:bg-white/[0.04] transition-colors">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            <TrendingUp size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{feature}</h4>
                                            <p className="text-xs text-slate-500">High-precision delivery ensuring project compliance.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Workflow Timeline */}
                        {service.process && service.process.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-12 flex items-center gap-3">
                                    <Workflow size={24} className="text-blue-500" />
                                    Execution Workflow
                                </h3>
                                <div className="space-y-12 relative before:absolute before:inset-0 before:left-5 before:w-px before:bg-gradient-to-b before:from-blue-500 before:via-blue-500/20 before:to-transparent">
                                    {service.process.map((step, idx) => (
                                        <div key={idx} className="relative pl-12 group">
                                            <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[#05080F] border-2 border-blue-500 flex items-center justify-center text-white font-bold text-sm z-10 group-hover:scale-110 transition-transform">
                                                {idx + 1}
                                            </div>
                                            <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                                            <p className="text-slate-400 leading-relaxed text-sm max-w-2xl">{step.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Deliverables Grid */}
                        {service.keyDeliverables && service.keyDeliverables.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                                    <PackageCheck size={24} className="text-emerald-400" />
                                    The Final Deliverables
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {service.keyDeliverables.map((item, idx) => (
                                        <div key={idx} className="p-5 rounded-2xl bg-[#0B0F19] border border-white/5 text-center group hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all">
                                            <FileText size={24} className="mx-auto text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                                            <span className="text-[11px] font-bold text-slate-300 block leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Software Stack */}
                        {service.software && service.software.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <Monitor size={20} className="text-blue-400" />
                                    Technology Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {service.software.map((item, idx) => (
                                        <span key={idx} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FAQs Accordion */}
                        {service.faqs && service.faqs.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                                    <HelpCircle size={24} className="text-orange-400" />
                                    Frequently Asked Questions
                                </h3>
                                <div className="space-y-4">
                                    {service.faqs.map((faq, idx) => (
                                        <details key={idx} className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01]">
                                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-white/[0.03]">
                                                <span className="font-bold text-slate-200">{faq.question}</span>
                                                <ChevronDown size={20} className="text-slate-500 group-open:rotate-180 transition-transform" />
                                            </summary>
                                            <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4 bg-white/[0.005]">
                                                {faq.answer}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* --- RIGHT SIDEBAR (Sticky) --- */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-8">

                            {/* Service Score Card (Benefits) */}
                            <div className="bg-gradient-to-br from-[#0B0F19] to-[#05080F] border border-blue-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-[100px] rounded-full"></div>
                                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2 relative z-10">
                                    <TrendingUp size={20} className="text-blue-400" />
                                    Business Impact
                                </h3>
                                <div className="space-y-6 relative z-10">
                                    {displayBenefits.map((benefit: string, index: number) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                                <span>{benefit}</span>
                                                <span className="text-blue-400">Guaranteed</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${85 + index * 5}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Card */}
                            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-center space-y-6">
                                <h3 className="text-2xl font-bold text-white">Start Your BIM Journey</h3>
                                <p className="text-blue-100/70 text-sm">Empower your project with industry-leading BIM precision and data extraction.</p>
                                <div className="space-y-4">
                                    <Link href="/contact" className="flex items-center justify-center gap-2 w-full py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-slate-100 transition-colors shadow-xl">
                                        Request A Consultation <ArrowRight size={18} />
                                    </Link>

                                </div>
                            </div>

                            {/* Contact Info Widget */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Support Channels</h4>
                                <ul className="space-y-4">
                                    <li>
                                        <a href="tel:+916294796582" className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                                <Phone size={18} />
                                            </div>
                                            +91 629 479 6582
                                        </a>
                                    </li>
                                    <li>
                                        <a href="mailto:info@tbesglobal.com" className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                                <Mail size={18} />
                                            </div>
                                            info@tbesglobal.com
                                        </a>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* =========================================
            3. BOTTOM NAV (Next Steps)
        ========================================= */}
            <div className="border-t border-white/5 py-12 bg-[#020408]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-500 mb-6">Need global scale? Explore our other technical solutions.</p>
                    <Link href="/services" className="px-8 py-3 rounded-full border border-white/10 text-white font-bold hover:bg-white hover:text-black transition-all">
                        All Services
                    </Link>
                </div>
            </div>

        </div>
    );
}

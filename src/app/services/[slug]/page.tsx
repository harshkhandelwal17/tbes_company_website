import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, CheckCircle2,
    TrendingUp, Layers, Phone, Mail, FileText, ArrowRight
} from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import DynamicIcon from '@/components/DynamicIcon';

interface ServiceDocument {
    title: string;
    icon: string;
    description: string;
    details: string[];
    image: string;
    color?: string;
    slug: string;
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

    const color = service.color || 'blue';

    return (
        <div className="min-h-screen bg-[#05080F] text-white font-sans selection:bg-blue-500/30">

            {/* =========================================
            1. IMMERSIVE HERO
        ========================================= */}
            <section className="relative pt-4 pb-20 lg:pt-4 lg:pb-32 overflow-hidden border-b border-white/5">
                {/* Background Grid & Glow */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.05]"></div>
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
                            style={{ background: `linear-gradient(to bottom right, var(--color-${color}-600, ${color}), var(--color-${color}-800, #1e3a8a))` }}
                        >
                            <DynamicIcon name={service.icon} size={40} className="text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-xs uppercase tracking-[0.2em] mb-2 block" style={{ color: `var(--color-${color}-500, ${color})` }}>Service Overview</span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">{service.title}</h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
            2. CONTENT & SIDEBAR LAYOUT
        ========================================= */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">

                    {/* --- LEFT CONTENT COLUMN --- */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">About this Service</h2>
                            <p className="text-lg text-slate-400 leading-relaxed font-light">
                                {service.description}
                            </p>
                        </div>

                        {/* Capabilities Grid */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                                <Layers size={20} className="text-blue-500" />
                                Key Capabilities
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {service.details.map((detail: string, index: number) => (
                                    <div key={index} className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all group">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span className="text-slate-300 text-sm font-medium">{detail}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits Box */}
                        <div className="bg-gradient-to-br from-blue-900/10 to-transparent border border-blue-500/20 rounded-[2rem] p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-24 bg-blue-500/5 blur-3xl rounded-full"></div>
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2 relative z-10">
                                <TrendingUp size={20} className="text-green-400" />
                                The Business Impact
                            </h3>
                            <div className="space-y-4 relative z-10">
                                {benefits.map((benefit: string, index: number) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="h-px flex-1 bg-gradient-to-r from-green-500/50 to-transparent"></div>
                                        <span className="text-slate-200 font-medium whitespace-nowrap">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* --- RIGHT SIDEBAR (Sticky) --- */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {/* CTA Card */}
                            <div className="bg-[#0B0F19] border border-white/10 rounded-3xl p-8 shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-2">Need a Quote?</h3>
                                <p className="text-slate-400 text-sm mb-6">Get a tailored proposal for your specific project requirements.</p>

                                <div className="space-y-3">
                                    <Link href="/contact" className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                        Get Started <ArrowRight size={18} />
                                    </Link>
                                    <Link href="/contact" className="flex items-center justify-center gap-2 w-full py-3.5 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                        <FileText size={18} /> Download Brochure
                                    </Link>
                                </div>
                            </div>

                            {/* Contact Info Widget */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Contact</h4>
                                <ul className="space-y-4">
                                    <li>
                                        <a href="tel:+916294796582" className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                <Phone size={16} />
                                            </div>
                                            +91 629 479 6582
                                        </a>
                                    </li>
                                    <li>
                                        <a href="mailto:info@tbesglobal.com" className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                <Mail size={16} />
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
                    <p className="text-slate-500 mb-6">Not looking for {service.title}?</p>
                    <Link href="/services" className="text-white font-bold underline decoration-blue-500 underline-offset-4 hover:text-blue-400 transition-colors">
                        Explore other services
                    </Link>
                </div>
            </div>

        </div>
    );
}

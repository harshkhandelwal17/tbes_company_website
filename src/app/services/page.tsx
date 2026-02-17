'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  Box, 
  Layers, 
  Zap, 
  Droplets, 
  Flame, 
  FileText, 
  Scan, 
  MonitorPlay, 
  Cuboid, 
  DraftingCompass 
} from 'lucide-react';

// --- Data Structure for Scalability ---
const servicesData = [
  {
    id: "architectural",
    title: "Architectural Services",
    icon: Box,
    description: "We produce digital models used for coordination with architects and MEP engineers. These BIM models assist through the design lifecycle, generating flawless designs and realistic approaches.",
    details: [
      "Design analysis & clash coordination",
      "Documentation assets",
      "Realistic design approach",
      "Flawless design generation"
    ],
    software: ["Revit", "AutoCAD", "SketchUp"],
    image: "/architectural_services.jpg", // Replace with your actual image path
    color: "blue"
  },
  {
    id: "structural",
    title: "Structural Services",
    icon: Layers,
    description: "We handle structural design approaches including precast & reinforced concrete, steel & composite structures. Our modeling helps visualize impacts and handle critical designing methodologies.",
    details: [
      "Foundation & Roof design",
      "Frame & RCC detailing",
      "Precast & Reinforced concrete",
      "Steel & Composite structures"
    ],
    software: ["Revit", "Tekla", "Robot Structural"],
    image: "/structural_services.jpg",
    color: "indigo"
  },
  {
    id: "mechanical",
    title: "Mechanical Services",
    icon: Zap, // Using Zap as a placeholder, strictly generic machinery icon might be better but Zap works for energy/power context often grouped
    description: "Complete HVAC packages following SMACNA/IPC/UPC standards. We cover modeling, design coordination, clash detection, cost estimation, and value engineering.",
    details: [
      "HVAC Systems (Ducting)",
      "Mechanical Piping",
      "Value Engineering",
      "Cost Estimation"
    ],
    software: ["Revit", "AutoCAD MEP", "Fabrication CADmep"],
    image: "/mechanical_services.jpg",
    color: "orange"
  },
  {
    id: "electrical",
    title: "Electrical Services",
    icon: Zap,
    description: "Specialized modeling of containments including cable trays, bus ducts, lighting, fire alarms, BMS, and ELV services. We provide a one-stop solution for electrical design.",
    details: [
      "Cable Trays & Bus Ducts",
      "Lighting & Power Circuits",
      "Fire Alarm & BMS",
      "ELV Services"
    ],
    software: ["Revit", "AutoCAD", "Dialux"],
    image: "/electrical_services.jpg",
    color: "yellow"
  },
  {
    id: "plumbing",
    title: "Plumbing Services",
    icon: Droplets,
    description: "Expert assistance with Plumbing and venting systems (DWV & Water Supply). We identify and rectify design errors early to prevent costly on-site impacts.",
    details: [
      "Drainage, Waste, Vent (DWV)",
      "Water Supply Systems",
      "Bill of Materials (BOM)",
      "Installation Drawings"
    ],
    software: ["Revit", "AutoCAD", "Navisworks"],
    image: "/plumbing_services.jpg",
    color: "cyan"
  },
  {
    id: "fire-protection",
    title: "Fire Protection",
    icon: Flame,
    description: "Mitigating fire risks through precise 3D modeling. We ensure designs comply with NFPA codes and help clients get necessary authority approvals.",
    details: [
      "NFPA Code Compliance",
      "Suppression Systems",
      "Constructability Analysis",
      "Authority Approvals"
    ],
    software: ["Revit", "AutoCAD", "Navisworks"],
    image: "/fireprotection_services.jpg",
    color: "red"
  },
  {
    id: "coordination",
    title: "Clash Coordination",
    icon: Layers,
    description: "We simplify BIM coordination by ensuring multi-discipline models are viewed from a single platform, resolving clashes quicker and saving millions in rework.",
    details: [
      "Multi-discipline coordination",
      "Conflict Resolution",
      "Pre-construction Analysis",
      "Cost & Time Saving"
    ],
    software: ["Navisworks", "BIM 360", "Revizto"],
    image: "/clash_services.jpg",
    color: "emerald"
  },
  {
    id: "shop-drawing",
    title: "Shop Drawings",
    icon: FileText,
    description: "Detailed component drawings for windows, cabinets, MEP, and fabrication. We identify exactly what materials are needed and how they fit into the building structure.",
    details: [
      "Fabrication Details",
      "MEP Components",
      "Material Identification",
      "Assembly Instructions"
    ],
    software: ["AutoCAD", "Revit"],
    image: "/shopdrawing.jpg",
    color: "slate"
  },
  {
    id: "scan-to-bim",
    title: "Scan to BIM",
    icon: Scan,
    description: "Converting Point Cloud data (LiDAR) into native Revit geometry. Ideal for renovation projects, retailers, and main contractors to analyze real-world objects.",
    details: [
      "Point Cloud Conversion",
      "As-Built Documentation",
      "Renovation Planning",
      "3D Laser Scanning Integration"
    ],
    software: ["Revit", "Recap Pro", "Matterport"],
    image: "/pointcloud.jpg",
    color: "purple"
  },
  {
    id: "rendering",
    title: "3D Rendering",
    icon: MonitorPlay,
    description: "Generating photorealistic images from 2D/3D models using advanced tools like Twinmotion and 3ds Max. We deliver high-level realism for architectural presentations.",
    details: [
      "Photorealistic Visualization",
      "Walkthroughs",
      "Texture & Lighting",
      "Virtual Staging"
    ],
    software: ["Twinmotion", "3ds Max", "Lumion"],
    image: "/rendering.jpg",
    color: "pink"
  },
  {
    id: "family-creation",
    title: "Family Creation",
    icon: Cuboid,
    description: "Developing detailed Revit family components for Architecture, Structure, and MEP. We create standardized file formats for manufacturers and designers.",
    details: [
      "Custom Revit Families",
      "Parametric Modeling",
      "Manufacturer Catalogues",
      "Standardized Assets"
    ],
    software: ["Revit", "AutoCAD"],
    image: "/familycreation.png",
    color: "teal"
  },
  {
    id: "cad-conversion",
    title: "CAD Conversion",
    icon: DraftingCompass,
    description: "Digitizing paper blueprints and hand sketches into accurate CAD formats. Essential for archiving, retrieving, and editing legacy technical data.",
    details: [
      "Paper to CAD",
      "PDF to DWG",
      "Legacy Data Archiving",
      "Blueprint Digitization"
    ],
    software: ["AutoCAD"],
    image: "/cad.jpg",
    color: "zinc"
  }
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* =========================================
          1. HERO SECTION
      ========================================= */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[#05080F] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.1]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
            End-to-End Engineering Solutions
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Services</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            Comprehensive BIM, CAD, and Digital Twin solutions tailored for the modern Architecture, Engineering, and Construction industry.
          </p>
        </div>
      </section>

      {/* =========================================
          2. SERVICES LIST (Zig-Zag Layout)
      ========================================= */}
      <section className="py-20 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 lg:space-y-32">
          
          {servicesData.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={service.id} 
                id={service.id}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center group`}
              >
                
                {/* Visual Side */}
                <div className="w-full lg:w-1/2 relative">
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3] transform transition-transform duration-700 group-hover:scale-[1.02]">
                    {/* Fallback Image / Actual Image */}
                    <div className="absolute inset-0 bg-slate-200">
                         {/* Replace img src with service.image in production */}
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Floating Icon Badge */}
                    <div className="absolute bottom-6 left-6 w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <service.icon size={32} strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  {/* Decorative Blob */}
                  <div className={`absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-${service.color}-500/5 blur-[80px] rounded-full`}></div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-8">
                  <div className="space-y-4">
                    <div className={`text-${service.color}-600 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2`}>
                       <span className={`w-2 h-2 rounded-full bg-${service.color}-500`}></span>
                       Service 0{index + 1}
                    </div>
                    <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 leading-tight">
                      {service.title}
                    </h2>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Key Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                        <CheckCircle2 size={18} className={`text-${service.color}-500 flex-shrink-0`} />
                        <span className="text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="pt-6 border-t border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Powered By</p>
                    <div className="flex flex-wrap gap-2">
                      {service.software.map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                     <Link href="/contact" className="inline-flex items-center text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-colors">
                        Request Proposal <ArrowRight size={16} className="ml-2" />
                     </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================
          3. WHY CHOOSE US (Compact Feature Strip)
      ========================================= */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16">
             <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose TBES?</h2>
             <p className="text-slate-500">We combine technical expertise with innovative solutions to deliver exceptional results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
                { title: "Expert Team", desc: "10+ years of collective industry experience.", icon: "👨‍💻" },
                { title: "Quality Assurance", desc: "Rigorous ISO-certified quality control processes.", icon: "🛡️" },
                { title: "On-Time Delivery", desc: "Committed to meeting deadlines strictly.", icon: "🚀" }
             ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100">
                   <div className="text-4xl mb-4">{item.icon}</div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                   <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* =========================================
          4. CTA (Final Push)
      ========================================= */}
      <section className="py-20 lg:py-32 bg-[#05080F]">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">Ready to Optimize Your Workflow?</h2>
            <p className="text-xl text-slate-400 mb-12">
               Get in touch with our engineering team to discuss how our BIM solutions can reduce costs and improve efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/contact" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                  Start a Project
               </Link>
               <Link href="/projects" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-all">
                  View Case Studies
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
};

export default ServicesPage;
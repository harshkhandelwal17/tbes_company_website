import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';

const initialServices = [
    {
        slug: "architectural",
        title: "Architectural Services",
        icon: "Box",
        description: "We produce digital models used for coordination with architects and MEP engineers. These BIM models assist through the design lifecycle, generating flawless designs and realistic approaches.",
        details: [
            "Design analysis & clash coordination",
            "Documentation assets",
            "Realistic design approach",
            "Flawless design generation"
        ],
        software: ["Revit", "AutoCAD", "SketchUp"],
        image: "/architectural_services.jpg",
        color: "blue",
        outcome: "Reduce on-site rework by 40%",
        order: 1
    },
    {
        slug: "structural",
        title: "Structural Services",
        icon: "Layers",
        description: "We handle structural design approaches including precast & reinforced concrete, steel & composite structures. Our modeling helps visualize impacts and handle critical designing methodologies.",
        details: [
            "Foundation & Roof design",
            "Frame & RCC detailing",
            "Precast & Reinforced concrete",
            "Steel & Composite structures"
        ],
        software: ["Revit", "Tekla", "Robot Structural"],
        image: "/structural_services.jpg",
        color: "indigo",
        outcome: "Optimized Material Usage",
        order: 2
    },
    {
        slug: "mechanical",
        title: "Mechanical Services",
        icon: "Zap",
        description: "Complete HVAC packages following SMACNA/IPC/UPC standards. We cover modeling, design coordination, clash detection, cost estimation, and value engineering.",
        details: [
            "HVAC Systems (Ducting)",
            "Mechanical Piping",
            "Value Engineering",
            "Cost Estimation"
        ],
        software: ["Revit", "AutoCAD MEP", "Fabrication CADmep"],
        image: "/mechanical_services.jpg",
        color: "orange",
        outcome: "Zero Disciplinary Clashes",
        order: 3
    },
    {
        slug: "electrical",
        title: "Electrical Services",
        icon: "Zap",
        description: "Specialized modeling of containments including cable trays, bus ducts, lighting, fire alarms, BMS, and ELV services. We provide a one-stop solution for electrical design.",
        details: [
            "Cable Trays & Bus Ducts",
            "Lighting & Power Circuits",
            "Fire Alarm & BMS",
            "ELV Services"
        ],
        software: ["Revit", "AutoCAD", "Dialux"],
        image: "/electrical_services.jpg",
        color: "yellow",
        outcome: "One-Stop Solution",
        order: 4
    },
    {
        slug: "plumbing",
        title: "Plumbing Services",
        icon: "Droplets",
        description: "Expert assistance with Plumbing and venting systems (DWV & Water Supply). We identify and rectify design errors early to prevent costly on-site impacts.",
        details: [
            "Drainage, Waste, Vent (DWV)",
            "Water Supply Systems",
            "Bill of Materials (BOM)",
            "Installation Drawings"
        ],
        software: ["Revit", "AutoCAD", "Navisworks"],
        image: "/plumbing_services.jpg",
        color: "cyan",
        outcome: "Error Prevention",
        order: 5
    },
    {
        slug: "fire-protection",
        title: "Fire Protection",
        icon: "Flame",
        description: "Mitigating fire risks through precise 3D modeling. We ensure designs comply with NFPA codes and help clients get necessary authority approvals.",
        details: [
            "NFPA Code Compliance",
            "Suppression Systems",
            "Constructability Analysis",
            "Authority Approvals"
        ],
        software: ["Revit", "AutoCAD", "Navisworks"],
        image: "/fireprotection_services.jpg",
        color: "red",
        outcome: "Risk Mitigation",
        order: 6
    },
    {
        slug: "coordination",
        title: "Clash Coordination",
        icon: "Layers",
        description: "We simplify BIM coordination by ensuring multi-discipline models are viewed from a single platform, resolving clashes quicker and saving millions in rework.",
        details: [
            "Multi-discipline coordination",
            "Conflict Resolution",
            "Pre-construction Analysis",
            "Cost & Time Saving"
        ],
        software: ["Navisworks", "BIM 360", "Revizto"],
        image: "/clash_services.jpg",
        color: "emerald",
        outcome: "Save Millions in Rework",
        order: 7
    },
    {
        slug: "shop-drawing",
        title: "Shop Drawings",
        icon: "FileText",
        description: "Detailed component drawings for windows, cabinets, MEP, and fabrication. We identify exactly what materials are needed and how they fit into the building structure.",
        details: [
            "Fabrication Details",
            "MEP Components",
            "Material Identification",
            "Assembly Instructions"
        ],
        software: ["AutoCAD", "Revit"],
        image: "/shopdrawing.jpg",
        color: "slate",
        outcome: "Ready-to-Fabricate Drawings",
        order: 8
    },
    {
        slug: "scan-to-bim",
        title: "Scan to BIM",
        icon: "Scan",
        description: "Converting Point Cloud data (LiDAR) into native Revit geometry. Ideal for renovation projects, retailers, and main contractors to analyze real-world objects.",
        details: [
            "Point Cloud Conversion",
            "As-Built Documentation",
            "Renovation Planning",
            "3D Laser Scanning Integration"
        ],
        software: ["Revit", "Recap Pro", "Matterport"],
        image: "/pointcloud.jpg",
        color: "purple",
        outcome: "99% Accuracy",
        order: 9
    },
    {
        slug: "rendering",
        title: "3D Rendering",
        icon: "MonitorPlay",
        description: "Generating photorealistic images from 2D/3D models using advanced tools like Twinmotion and 3ds Max. We deliver high-level realism for architectural presentations.",
        details: [
            "Photorealistic Visualization",
            "Walkthroughs",
            "Texture & Lighting",
            "Virtual Staging"
        ],
        software: ["Twinmotion", "3ds Max", "Lumion"],
        image: "/rendering.jpg",
        color: "pink",
        outcome: "High-Level Realism",
        order: 10
    },
    {
        slug: "family-creation",
        title: "Family Creation",
        icon: "Cuboid",
        description: "Developing detailed Revit family components for Architecture, Structure, and MEP. We create standardized file formats for manufacturers and designers.",
        details: [
            "Custom Revit Families",
            "Parametric Modeling",
            "Manufacturer Catalogues",
            "Standardized Assets"
        ],
        software: ["Revit", "AutoCAD"],
        image: "/familycreation.png",
        color: "teal",
        outcome: "Asset Reusability",
        order: 11
    },
    {
        slug: "cad-conversion",
        title: "CAD Conversion",
        icon: "DraftingCompass",
        description: "Digitizing paper blueprints and hand sketches into accurate CAD formats. Essential for archiving, retrieving, and editing legacy technical data.",
        details: [
            "Paper to CAD",
            "PDF to DWG",
            "Legacy Data Archiving",
            "Blueprint Digitization"
        ],
        software: ["AutoCAD"],
        image: "/cad.jpg",
        color: "zinc",
        outcome: "Digital Access",
        order: 12
    }
];

export async function GET() {
    try {
        await connectDB();

        // Clear existing to avoid duplicates during dev
        await Service.deleteMany({});

        await Service.insertMany(initialServices);

        return NextResponse.json({ message: 'Services seeded successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

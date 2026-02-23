import mongoose from 'mongoose';
import connectDB from '../src/lib/mongodb';
import Service from '../src/models/Service';

const services = [
    {
        slug: 'architectural-bim',
        title: 'Architectural BIM Services',
        icon: 'Building2',
        description: 'High-fidelity 3D architectural modeling that transforms 2D drafts into intelligent, data-rich BIM models. We focus on design intent, spatial coordination, and construction-ready documentation.',
        details: [
            'Conceptual BIM Modeling',
            'LOD 100 to LOD 500 Modeling',
            'Clash Detection & Coordination',
            'Construction Documentation',
            'As-Built Modeling'
        ],
        software: ['Autodesk Revit', 'Navisworks', 'AutoCAD'],
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070',
        color: 'blue',
        outcome: 'Design Clarity & Zero Rework',
        order: 1,
        benefits: [
            '30% Reduction in onsite conflicts',
            'Improved stakeholder collaboration',
            'Accurate material take-offs',
            'Simplified facility management'
        ],
        features: [
            'Intelligent parametric families',
            'Detailed 4D construction sequencing',
            'High-quality architectural visualization',
            'BIM-integrated scheduling'
        ],
        process: [
            { title: 'Project Input Analysis', description: 'Reviewing 2D CAD files, sketches, or point cloud data to understand project scope.' },
            { title: 'BIM Execution Plan (BEP)', description: 'Defining LOD requirements, standards, and coordination workflows.' },
            { title: '3D Modeling & Coordination', description: 'Developing the architectural model and conducting clash tests with other trades.' },
            { title: 'Documentation & Review', description: 'Extracting plans, sections, and schedules followed by rigorous QA/QC.' }
        ],
        keyDeliverables: [
            'Revit Central Model (.rvt)',
            'Coordinated IFC Files',
            'Clash Detection Reports (.nwd)',
            'High-Definition 2D Drawings'
        ],
        faqs: [
            { question: 'What LOD do you provide?', answer: 'We provide modeling from LOD 100 for conceptual stages up to LOD 500 for facilities management.' },
            { question: 'Can you work with point cloud data?', answer: 'Yes, we specialize in Scan-to-BIM services for renovation and heritage projects.' }
        ]
    },
    {
        slug: 'mep-bim-services',
        title: 'MEP BIM Coordination',
        icon: 'Zap',
        description: 'Comprehensive Mechanical, Electrical, and Plumbing BIM services ensuring clash-free installation and optimized system performance in complex buildings.',
        details: [
            'HVAC Ducting & Piping BIM',
            'Electrical & Fire Protection BIM',
            'MEP Clash Resolution',
            'Spool Drawings',
            'Plant Room Modeling'
        ],
        software: ['Revit MEP', 'Navisworks Manage', 'Fabrication CADmep'],
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070',
        color: 'orange',
        outcome: 'Pre-Construction Efficiency',
        order: 2,
        benefits: [
            'Eliminate site-based duct/pipe rework',
            'Optimize plant room spatial allocation',
            'Streamlined fabrication process',
            'Precise quantity estimation'
        ],
        features: [
            'Fully coordinated MEP systems',
            'Automated clash report generation',
            'Standardized piping tagging',
            'Pressure drop & flow calculations'
        ],
        process: [
            { title: 'Trade Integration', description: 'Consolidating models from mechanical, electrical, and plumbing teams.' },
            { title: 'Clash Resolution', description: 'Systematically resolving overlaps to ensure constructability.' },
            { title: 'Spooling & Sheet Generation', description: 'Creating detailed shop drawings and fabrication spools.' }
        ],
        keyDeliverables: [
            'Coordinated MEP Models',
            'MEP Shop Drawings',
            'Equipment Schedules',
            'Spool Drawings for Prefab'
        ],
        faqs: [
            { question: 'Do you provide clash resolution?', answer: 'Yes, we don’t just find clashes, our engineers resolve them through design coordination.' },
            { question: 'What is your turnaround time?', answer: 'Depends on project scale, but we typically deliver plant room coordination in 3-5 business days.' }
        ]
    },
    {
        slug: 'structural-bim-services',
        title: 'Structural BIM & Detailing',
        icon: 'ShieldCheck',
        description: 'Precision structural BIM services from LOD 300 steel detailing to reinforced concrete (RCC) modeling and rebar detailing.',
        details: [
            'Structural 3D Modeling',
            'Steel Connection Detailing',
            'Rebar Modeling & Detailing',
            'Precast Concrete Detailing',
            'Structural Analysis Integration'
        ],
        software: ['Tekla Structures', 'Revit Structural', 'AutoCAD'],
        image: 'https://images.unsplash.com/photo-1590069230002-70cc6a47ee02?q=80&w=2070',
        color: 'indigo',
        outcome: 'Structural Integrity & Accuracy',
        order: 3,
        benefits: [
            'Reduced material waste',
            'Accurate rebar bending schedules',
            'Precision steel shop drawings',
            'Seamless architectural alignment'
        ],
        features: [
            'High-detail rebar modeling',
            'Automated BOM/BOQ generation',
            'Connection design verification',
            'Standard compliance checking'
        ],
        process: [
            { title: 'Structural Analysis Review', description: 'Translating engineering calcs into 3D structural elements.' },
            { title: 'Detailing & Reinforcement', description: 'Adding connections, plates, and rebars as per design codes.' },
            { title: 'Review & Extraction', description: 'Generating GA drawings and bar bending schedules (BBS).' }
        ],
        keyDeliverables: [
            'Structural BIM Model',
            'Bar Bending Schedules (BBS)',
            'Steel Fabrication Drawings',
            'GA & Connection Details'
        ],
        faqs: [
            { question: 'Can you deliver Tekla models?', answer: 'Yes, we use Tekla Structures for high-detail steel and precast detailing.' },
            { question: 'Do you provide BBS?', answer: 'Yes, we provide automated and accurate Bar Bending Schedules in multiple formats.' }
        ]
    }
];

async function seed() {
    try {
        await connectDB();

        // Delete existing services
        console.log('Deleting old services...');
        await Service.deleteMany({});

        // Insert new services
        console.log('Seeding new advanced services...');
        await Service.insertMany(services);

        console.log('Seeding complete! Successfully added 3 advanced services.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();

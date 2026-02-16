import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const projects = await Project.find({}).sort({ createdAt: -1 });

        const formattedProjects = projects.map(project => {
            let imageUrls: string[] = [];
            try {
                if (project.imageUrls) {
                    const parsed = JSON.parse(project.imageUrls);
                    imageUrls = Array.isArray(parsed) ? parsed : [parsed];
                }
            } catch (error) {
                imageUrls = project.imageUrls ? [project.imageUrls] : [];
            }

            return {
                id: project._id.toString(),
                title: project.title,
                description: project.description,
                location: project.location,
                lod: project.lod,
                sow: project.sow,
                projectType: project.projectType,
                area: project.area,
                imageUrl: imageUrls[0] || null, // Main image for card
                images: imageUrls, // All images for gallery
                createdAt: project.createdAt,
                updatedAt: project.updatedAt
            };
        });

        return NextResponse.json(formattedProjects);
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

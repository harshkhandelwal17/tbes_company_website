import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import Application from '@/models/Application';
import Project from '@/models/Project';
import Contact from '@/models/Contact';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        const [jobsCount, applicationsCount, projectsCount, contactsCount] = await Promise.all([
            Job.countDocuments(),
            Application.countDocuments(),
            Project.countDocuments(),
            Contact.countDocuments(),
        ]);

        return NextResponse.json({
            jobs: jobsCount,
            applications: applicationsCount,
            projects: projectsCount,
            contacts: contactsCount,
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}

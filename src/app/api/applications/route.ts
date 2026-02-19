import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';
import Job from '@/models/Job'; // Ensure Job model is registered

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const applications = await Application.find()
            .populate('jobId', 'title') // Populate job title
            .sort({ createdAt: -1 });

        return NextResponse.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }
}

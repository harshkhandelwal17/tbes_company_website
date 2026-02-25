import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';
import Job from '@/models/Job'; // Keep registered
import { deleteFromCloudinary, extractPublicId } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const applications = await Application.find()
            .populate('jobId', 'title')
            .sort({ createdAt: -1 });
        return NextResponse.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const application = await Application.findById(id);
        if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 });

        // Delete resume PDF from Cloudinary if it was uploaded there
        if (application.resumeUrl && application.resumeUrl.includes('cloudinary.com')) {
            // Resumes are uploaded as 'raw' (PDF files)
            await deleteFromCloudinary(extractPublicId(application.resumeUrl), 'raw');
        }

        await Application.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Application and associated resume deleted successfully.' });
    } catch (error) {
        console.error('Error deleting application:', error);
        return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
    }
}

// Update application status
export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
        }

        const application = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        return NextResponse.json(application);
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }
}

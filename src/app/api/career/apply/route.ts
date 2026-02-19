import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/mail';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';
import Job from '@/models/Job'; // Import Job to ensure it's registered

export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        // Basic Validation
        if (!data.jobId || !data.fullName || !data.email || !data.resumeUrl) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }


        // Fetch Job Details for Email Subject
        const job = await Job.findById(data.jobId);
        const jobTitle = job ? job.title : 'Unknown Job';

        // Create Application
        const application = await Application.create(data);

        // Send Email Notification
        await sendMail({
            replyTo: data.email,
            subject: `New Job Application: ${data.fullName} for ${jobTitle}`,
            html: `
                <h2>New Job Application Received</h2>
                <p><strong>Applicant:</strong> ${data.fullName}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
                <p><strong>Applying For:</strong> ${jobTitle}</p>
                <p><strong>Resume:</strong> <a href="${data.resumeUrl}" target="_blank">View Resume</a></p>
                ${data.coverLetter ? `<br/><h3>Cover Letter:</h3><p>${data.coverLetter.replace(/\n/g, '<br/>')}</p>` : ''}
                <br/>
                <p><small>Application ID: ${application._id}</small></p>
            `
        });

        return NextResponse.json({
            success: true,
            message: 'Application submitted successfully',
            application,
        });
    } catch (error: any) {
        console.error('Application submission error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

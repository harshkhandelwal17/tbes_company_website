import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/mail';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, serviceInterest, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields (Name, Email, Subject, Message)' },
        { status: 400 }
      );
    }

    // Connect to Database
    await connectDB();

    // Save to MongoDB
    const newContact = await Contact.create({
      name,
      email,
      phone,
      company,
      serviceInterest: serviceInterest || 'General Inquiry',
      subject,
      message,
      status: 'New'
    });

    // Send Email
    await sendMail({
      replyTo: email,
      subject: `New Contact Inquiry: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Service Interest:</strong> ${serviceInterest || 'General Inquiry'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <br/>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br/>')}</p>
        <br/>
        <p><small>Saved to Database ID: ${newContact._id}</small></p>
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry received and saved successfully.'
    });

  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

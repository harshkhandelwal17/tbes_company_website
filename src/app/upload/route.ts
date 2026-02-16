import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const file = formData.get('cv') as File;

  if (!name || !email || !file) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Career Form" <${process.env.EMAIL_USER}>`,
    to: process.env.TO_EMAIL,
    subject: `New Job Application from ${name}`,
    text: `You received a new job application.\n\nName: ${name}\nEmail: ${email}`,
    attachments: [
      {
        filename: file.name,
        content: buffer,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

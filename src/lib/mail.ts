import nodemailer from 'nodemailer';

export const sendMail = async ({
    to,
    subject,
    html,
    replyTo,
}: {
    to?: string;
    subject: string;
    html: string;
    replyTo?: string;
}) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to || process.env.TO_EMAIL || process.env.EMAIL_USER,
        replyTo: replyTo,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${mailOptions.to}`);
    } catch (error) {
        console.error('Email sending failed:', error);
        // Don't throw error to prevent blocking main flow, but log it
    }
};

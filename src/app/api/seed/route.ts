import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcrypt';

export async function GET() {
    await connectDB();

    const email = "admin@tbes.com"; // Default email
    const password = "admin"; // Default password

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.create({
            email,
            password: hashedPassword
        });

        return NextResponse.json({ message: "Admin created successfully", email, password });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

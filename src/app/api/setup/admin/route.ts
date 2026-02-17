import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import connectDB from '@/lib/mongodb'
import Admin from '@/models/Admin'

export async function GET() {
    try {
        await connectDB()

        const email = 'admin@tbesglobal.com'
        const password = 'admin123' // Default password

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email })
        if (existingAdmin) {
            return NextResponse.json({ message: 'Admin already exists', email })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create admin
        const newAdmin = await Admin.create({
            email,
            password: hashedPassword,
        })

        return NextResponse.json({
            success: true,
            message: 'Admin created successfully',
            credentials: {
                email,
                password,
            },
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

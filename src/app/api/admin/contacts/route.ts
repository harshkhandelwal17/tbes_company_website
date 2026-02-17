import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const contacts = await Contact.find({}).sort({ createdAt: -1 });
        return NextResponse.json(contacts);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await Contact.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Contact deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await connectDB();
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        return NextResponse.json(updatedContact);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import { deleteFromCloudinary, extractPublicId } from '@/lib/cloudinary';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        const query = isObjectId ? { _id: id } : { slug: id };
        const service = await Service.findOne(query);
        if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        return NextResponse.json(service);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const service = await Service.findByIdAndUpdate(id, body, { new: true });
        if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        return NextResponse.json(service);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const service = await Service.findById(id);
        if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

        // Delete service image from Cloudinary if it exists
        if (service.image && service.image.includes('cloudinary.com')) {
            await deleteFromCloudinary(extractPublicId(service.image), 'image');
        }

        await Service.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Service and associated image deleted successfully.' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

// GET all reviews
export async function GET() {
    try {
        await connectDB();
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        return NextResponse.json(reviews);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST a new review
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const newReview = await Review.create(body);
        return NextResponse.json(newReview, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

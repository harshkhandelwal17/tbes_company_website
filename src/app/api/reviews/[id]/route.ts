import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

// GET a single review
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();
        const review = await Review.findById(id);
        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }
        return NextResponse.json(review);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT (update) a review
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();
        const body = await req.json();
        const updatedReview = await Review.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!updatedReview) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }
        return NextResponse.json(updatedReview);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE a review
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();
        const deletedReview = await Review.findByIdAndDelete(id);
        if (!deletedReview) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Review deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUploadUrl } from '@/lib/r2';
import { verifyAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        // 1. Auth Check (Actual verification of admin-token)
        const isAdmin = await verifyAdmin();

        const { filename, contentType, folder } = await req.json();

        if (!filename || !contentType || !folder) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Security: Only allow specific folders for public (non-admin) users
        const publicAllowedFolders = ['tbes-resumes', 'tbes-cover-photos', 'tbes-supporting-docs'];
        if (!isAdmin && !publicAllowedFolders.includes(folder)) {
            return NextResponse.json({ error: 'Unauthorized folder access' }, { status: 401 });
        }

        // 2. Generate unique key
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `${folder}/${timestamp}-${random}-${sanitizedFilename}`;

        // 3. Generate presigned URL
        const presignedUrl = await generatePresignedUploadUrl(key, contentType);

        // 4. Construct the final public URL
        const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, '') || '';
        const publicUrl = `${publicBase}/${key}`;

        return NextResponse.json({
            presignedUrl,
            publicUrl,
            key
        });
    } catch (error: any) {
        console.error('[API Upload] Error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}

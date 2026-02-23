import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

// Allow large file uploads (200MB)
export const config = {
    api: {
        bodyParser: false,
    },
};

// Next.js App Router: increase body size limit
export const maxDuration = 60; // seconds

// Ensure upload directory exists
function ensureModelDir() {
    const modelDir = path.join(process.cwd(), 'public/uploads/models');
    if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir, { recursive: true });
    }
}

// Allowed 3D model extensions
const ALLOWED_EXTENSIONS = ['fbx', 'obj', 'gltf', 'glb', 'stl', 'step', 'iges', 'ifc', '3ds', 'dae', 'rvt', 'nwd', 'nwc'];
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('model') as File;

        if (!file || file.size === 0) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
                { status: 400 }
            );
        }

        // Validate extension
        const originalName = file.name || 'model';
        const extension = originalName.split('.').pop()?.toLowerCase() || '';
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            return NextResponse.json(
                { error: `Invalid file type (.${extension}). Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` },
                { status: 400 }
            );
        }

        ensureModelDir();

        // Save file
        const buffer = Buffer.from(await file.arrayBuffer());
        const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${safeName}`;
        const filepath = path.join(process.cwd(), 'public/uploads/models', filename);
        await writeFile(filepath, buffer);

        const modelUrl = `/uploads/models/${filename}`;

        return NextResponse.json({
            success: true,
            modelUrl,
            modelType: extension,
            fileName: originalName,
            fileSize: file.size,
        });
    } catch (error) {
        console.error('Error uploading 3D model:', error);
        return NextResponse.json(
            { error: 'Failed to upload model', details: (error as Error).message },
            { status: 500 }
        );
    }
}

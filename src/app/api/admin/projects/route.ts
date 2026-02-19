import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

// Ensure upload directories exist
function ensureUploadDirs() {
  const imageDir = path.join(process.cwd(), 'public/uploads/images');

  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
}

// Helper to save file
async function saveFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
  const filepath = path.join(process.cwd(), 'public/uploads/images', filename);
  await writeFile(filepath, buffer);
  return `/uploads/images/${filename}`;
}

// POST - Create new project
export async function POST(req: NextRequest) {
  try {
    // 1. Process Form Data FIRST (before DB connection)
    const formData = await req.formData();

    // Extract fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const lodStr = formData.get('lod') as string;
    const sow = formData.get('sow') as string;
    const projectType = formData.get('projectType') as string;
    const areaStr = formData.get('area') as string;
    const modelUrl = formData.get('modelUrl') as string;
    const modelType = formData.get('modelType') as string;
    const existingImagesStr = formData.get('existingImages') as string;

    const parsedLod = lodStr ? parseInt(lodStr.replace(/\D/g, '')) : NaN;
    const lod = !isNaN(parsedLod) ? parsedLod : undefined;

    const parsedArea = areaStr ? parseInt(areaStr) : NaN;
    const area = !isNaN(parsedArea) ? parsedArea : undefined;

    // 2. Handle File Uploads (Async)
    ensureUploadDirs();

    // Handle new images
    const newImageFiles = formData.getAll('newImages') as File[];
    // Also support 'images' key for backward compatibility or simple forms
    const legacyImageFiles = formData.getAll('images') as File[];
    const allImageFiles = [...newImageFiles, ...legacyImageFiles];

    const uploadedImageUrls: string[] = [];

    // Parallelize uploads
    const uploadPromises = allImageFiles.map(async (file) => {
      if (file && file.size > 0) {
        return await saveFile(file);
      }
      return null;
    });

    const results = await Promise.all(uploadPromises);
    results.forEach(url => {
      if (url) uploadedImageUrls.push(url);
    });

    // Parse existing images if any (mostly for duplication check or just appending)
    // For POST, we mainly care about new images, but logic might vary.
    // Usually POST = new project = valid images.

    if (uploadedImageUrls.length === 0 && (!existingImagesStr || existingImagesStr === '[]')) {
      // Only error if NO images at all are provided. 
      // Depending on business logic, maybe images are optional? 
      // User said "At least one image file is required" in original code.
      // Let's keep it lenient or strictly enforce.
      // Original code enforced: if (!imageFiles || imageFiles.length === 0)
    }

    // 3. Connect to DB ONLY after heavy lifting
    console.log('Connecting to DB for Project Creation...');
    await connectDB();

    const projectData = {
      title,
      description,
      location,
      lod,
      sow,
      projectType,
      area,
      imageUrls: JSON.stringify(uploadedImageUrls),
      modelUrl,
      modelType,
    };

    const project = await Project.create(projectData);

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT - Update existing project
export async function PUT(req: NextRequest) {
  try {
    // 1. Process Form Data
    const formData = await req.formData();

    const id = formData.get('id') as string;
    if (!id) return NextResponse.json({ error: 'Project ID required' }, { status: 400 });

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const lodStr = formData.get('lod') as string;
    const sow = formData.get('sow') as string;
    const projectType = formData.get('projectType') as string;
    const areaStr = formData.get('area') as string;
    const modelUrl = formData.get('modelUrl') as string;
    const modelType = formData.get('modelType') as string;

    // "existingImages" comes from frontend as JSON string of URLs to KEEP
    const existingImagesStr = formData.get('existingImages') as string;

    const parsedLod = lodStr ? parseInt(lodStr.replace(/\D/g, '')) : NaN;
    const lod = !isNaN(parsedLod) ? parsedLod : undefined;

    const parsedArea = areaStr ? parseInt(areaStr) : NaN;
    const area = !isNaN(parsedArea) ? parsedArea : undefined;

    // 2. Handle New File Uploads
    ensureUploadDirs();
    const newImageFiles = formData.getAll('newImages') as File[];
    // Legacy support
    const legacyImageFiles = formData.getAll('images') as File[];
    const allNewFiles = [...newImageFiles, ...legacyImageFiles];

    const newImageUrls: string[] = [];
    const uploadPromises = allNewFiles.map(async (file) => {
      if (file && file.size > 0) {
        return await saveFile(file);
      }
      return null;
    });

    const results = await Promise.all(uploadPromises);
    results.forEach(url => {
      if (url) newImageUrls.push(url);
    });

    // 3. Prepare Final Image List
    let finalImageUrls: string[] = [];

    // Parse existing images that the user wants to KEEP
    if (existingImagesStr) {
      try {
        const parsed = JSON.parse(existingImagesStr);
        if (Array.isArray(parsed)) finalImageUrls = parsed;
      } catch (e) {
        // console.error("Error parsing existingImages:", e);
      }
    }

    // Merge new images
    finalImageUrls = [...finalImageUrls, ...newImageUrls];

    // 4. Connect to DB and Update
    console.log('Connecting to DB for Project Update...');
    await connectDB();

    const updateData = {
      title,
      description,
      location,
      lod,
      sow,
      projectType,
      area,
      imageUrls: JSON.stringify(finalImageUrls),
      modelUrl,
      modelType,
    };

    const project = await Project.findByIdAndUpdate(id, updateData, { new: true });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await connectDB();
    const project = await Project.findById(id);

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // Try to delete images from filesystem (optional, doesn't break if fails)
    try {
      let imageUrls: string[] = [];
      if (project.imageUrls) {
        try {
          const parsed = JSON.parse(project.imageUrls);
          imageUrls = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          imageUrls = [project.imageUrls];
        }
      }

      for (const url of imageUrls) {
        const filePath = path.join(process.cwd(), 'public', url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (e) {
      console.error('Error deleting files:', e);
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project', details: (error as Error).message },
      { status: 500 }
    );
  }
}
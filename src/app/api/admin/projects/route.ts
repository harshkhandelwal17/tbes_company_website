import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { uploadToR2, deleteFromR2, extractR2Key } from '@/lib/r2';

// POST - Create new project (images → R2)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const lodStr = formData.get('lod') as string;
    const sow = formData.get('sow') as string;
    const projectType = formData.get('projectType') as string;
    const areaStr = formData.get('area') as string;
    const modelUrl = formData.get('modelUrl') as string;
    const modelType = formData.get('modelType') as string;

    const parsedLod = lodStr ? parseInt(lodStr.replace(/\D/g, '')) : NaN;
    const lod = !isNaN(parsedLod) ? parsedLod : undefined;
    const parsedArea = areaStr ? parseInt(areaStr) : NaN;
    const area = !isNaN(parsedArea) ? parsedArea : undefined;

    // Upload images to R2
    const allImageFiles = [
      ...(formData.getAll('newImages') as File[]),
      ...(formData.getAll('images') as File[]),
    ];

    const uploadedImageUrls: string[] = [];

    await Promise.all(
      allImageFiles.map(async (file) => {
        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 10000);
          const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const key = `tbes-projects/${timestamp}-${random}-${sanitizedFilename}`;

          const publicUrl = await uploadToR2(buffer, key, file.type || 'image/jpeg');
          uploadedImageUrls.push(publicUrl);
        }
      })
    );

    await connectDB();

    const project = await Project.create({
      title, description, location, lod, sow, projectType, area,
      imageUrls: JSON.stringify(uploadedImageUrls),
      modelUrl,
      modelType,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT - Update existing project (keeps existing R2 images + uploads new ones)
export async function PUT(req: NextRequest) {
  try {
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
    const existingImagesStr = formData.get('existingImages') as string;

    const parsedLod = lodStr ? parseInt(lodStr.replace(/\D/g, '')) : NaN;
    const lod = !isNaN(parsedLod) ? parsedLod : undefined;
    const parsedArea = areaStr ? parseInt(areaStr) : NaN;
    const area = !isNaN(parsedArea) ? parsedArea : undefined;

    // Parse existing R2 URLs to keep
    let keepUrls: string[] = [];
    if (existingImagesStr) {
      try {
        const parsed = JSON.parse(existingImagesStr);
        if (Array.isArray(parsed)) keepUrls = parsed;
      } catch { /* ignore */ }
    }

    // Upload new images to R2
    const allNewFiles = [
      ...(formData.getAll('newImages') as File[]),
      ...(formData.getAll('images') as File[]),
    ];

    const newImageUrls: string[] = [];
    await Promise.all(
      allNewFiles.map(async (file) => {
        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 10000);
          const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const key = `tbes-projects/${timestamp}-${random}-${sanitizedFilename}`;

          const publicUrl = await uploadToR2(buffer, key, file.type || 'image/jpeg');
          newImageUrls.push(publicUrl);
        }
      })
    );

    // Find URLs that were removed and delete from R2
    await connectDB();
    const existing = await Project.findById(id);
    if (existing?.imageUrls) {
      let oldUrls: string[] = [];
      try { oldUrls = JSON.parse(existing.imageUrls); } catch { /* ignore */ }
      const removedUrls = oldUrls.filter(u => !keepUrls.includes(u));
      await Promise.all(
        removedUrls.map(u => {
          const key = extractR2Key(u);
          if (key) return deleteFromR2(key);
          return Promise.resolve();
        })
      );
    }

    // Also handle old model deletion if it changed
    if (existing?.modelUrl && existing.modelUrl !== modelUrl) {
      const oldModelKey = extractR2Key(existing.modelUrl);
      if (oldModelKey) await deleteFromR2(oldModelKey);
    }

    const finalImageUrls = [...keepUrls, ...newImageUrls];

    const project = await Project.findByIdAndUpdate(
      id,
      {
        title, description, location, lod, sow, projectType, area,
        imageUrls: JSON.stringify(finalImageUrls),
        modelUrl, modelType,
      },
      { new: true }
    );

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE - Delete project + cleanup ALL R2 assets (images + 3D model)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await connectDB();
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // 1. Delete project images from R2
    if (project.imageUrls) {
      let imageUrls: string[] = [];
      try { imageUrls = JSON.parse(project.imageUrls); } catch { /* ignore */ }

      await Promise.all(
        imageUrls.map(url => {
          const key = extractR2Key(url);
          if (key) return deleteFromR2(key);
          return Promise.resolve();
        })
      );
    }

    // 2. Delete 3D model from R2
    if (project.modelUrl) {
      const modelKey = extractR2Key(project.modelUrl);
      if (modelKey) await deleteFromR2(modelKey);
    }

    // 3. Delete from DB
    await Project.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Project and all associated files deleted.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project', details: (error as Error).message },
      { status: 500 }
    );
  }
}

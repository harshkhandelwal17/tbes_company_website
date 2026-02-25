import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '@/lib/cloudinary';

// POST - Create new project (images → Cloudinary)
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

    // Upload images to Cloudinary
    const allImageFiles = [
      ...(formData.getAll('newImages') as File[]),
      ...(formData.getAll('images') as File[]),
    ];

    const uploadedImageUrls: string[] = [];

    await Promise.all(
      allImageFiles.map(async (file) => {
        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const { secure_url } = await uploadToCloudinary(buffer, 'tbes-projects', 'image');
          uploadedImageUrls.push(secure_url);
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

// PUT - Update existing project (keeps existing Cloudinary images + uploads new ones)
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

    // Parse existing Cloudinary URLs to keep
    let keepUrls: string[] = [];
    if (existingImagesStr) {
      try {
        const parsed = JSON.parse(existingImagesStr);
        if (Array.isArray(parsed)) keepUrls = parsed;
      } catch { /* ignore */ }
    }

    // Upload new images to Cloudinary
    const allNewFiles = [
      ...(formData.getAll('newImages') as File[]),
      ...(formData.getAll('images') as File[]),
    ];

    const newImageUrls: string[] = [];
    await Promise.all(
      allNewFiles.map(async (file) => {
        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const { secure_url } = await uploadToCloudinary(buffer, 'tbes-projects', 'image');
          newImageUrls.push(secure_url);
        }
      })
    );

    // Find URLs that were removed (were in DB but not in keepUrls) and delete from Cloudinary
    await connectDB();
    const existing = await Project.findById(id);
    if (existing?.imageUrls) {
      let oldUrls: string[] = [];
      try { oldUrls = JSON.parse(existing.imageUrls); } catch { /* ignore */ }
      const removedUrls = oldUrls.filter(u => !keepUrls.includes(u));
      await Promise.all(
        removedUrls.map(u => deleteFromCloudinary(extractPublicId(u), 'image'))
      );
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

// DELETE - Delete project + cleanup ALL Cloudinary assets (images + 3D model)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await connectDB();
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // 1. Delete project images from Cloudinary
    if (project.imageUrls) {
      let imageUrls: string[] = [];
      try { imageUrls = JSON.parse(project.imageUrls); } catch { /* ignore */ }

      await Promise.all(
        imageUrls.map(url => deleteFromCloudinary(extractPublicId(url), 'image'))
      );
    }

    // 2. Delete 3D model from Cloudinary (stored as 'raw')
    if (project.modelUrl && project.modelUrl.includes('cloudinary.com')) {
      await deleteFromCloudinary(extractPublicId(project.modelUrl), 'raw');
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
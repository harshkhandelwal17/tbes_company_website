import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import fs from 'fs';
import path from 'path';

// Ensure upload directories exist
function ensureUploadDirs() {
  const imageDir = path.join(process.cwd(), 'public/uploads/images');

  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
}

// POST - Create new project
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    console.log('POST request received');
    ensureUploadDirs();

    const formData = await req.formData();
    // console.log('FormData keys:', Array.from(formData.keys()));

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const lodStr = formData.get('lod') as string;
    const sow = formData.get('sow') as string;
    const projectType = formData.get('projectType') as string;
    const areaStr = formData.get('area') as string;
    const modelUrl = formData.get('modelUrl') as string;
    const modelType = formData.get('modelType') as string;

    // Validate and parse numbers
    const lod = lodStr ? parseInt(lodStr) : undefined;
    const area = areaStr ? parseInt(areaStr) : undefined;

    // Get all image files
    const imageFiles = formData.getAll('images') as File[];

    // console.log('Image files received:', imageFiles.map(file => file.name));

    if (!imageFiles || imageFiles.length === 0) {
      return NextResponse.json(
        { error: 'At least one image file is required' },
        { status: 400 }
      );
    }

    // Save all image files
    const imageUrls: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];

      // Skip if not a valid file
      if (!imageFile || imageFile.size === 0) {
        // console.log(`Skipping invalid file at index ${i}`);
        continue;
      }

      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const imageFileName = `${Date.now()}-${i}-${imageFile.name}`;
      const imagePath = path.join(process.cwd(), 'public/uploads/images', imageFileName);
      fs.writeFileSync(imagePath, imageBuffer);

      const imageUrl = `/uploads/images/${imageFileName}`;
      imageUrls.push(imageUrl);
      // console.log(`Image ${i + 1} saved:`, imagePath);
    }

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid image files were processed' },
        { status: 400 }
      );
    }

    // Prepare data for database
    const projectData = {
      title,
      description,
      location,
      lod,
      sow,
      projectType,
      area,
      imageUrls: JSON.stringify(imageUrls), // Store multiple images as JSON string
      modelUrl,
      modelType,
    };

    console.log('Creating project with data:', projectData);

    // Create project in database
    const project = await Project.create(projectData);

    console.log('Project created successfully:', project);
    return NextResponse.json(project);
  } catch (error) {
    console.error('Detailed error creating project:', error);

    // More specific error handling
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to create project',
          details: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

// PUT - Update existing project
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    console.log('PUT request received');
    ensureUploadDirs();

    const formData = await req.formData();
    // console.log('FormData keys:', Array.from(formData.keys()));

    const id = formData.get('id') as string; // ID is now string (ObjectId)
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const lodStr = formData.get('lod') as string;
    const sow = formData.get('sow') as string;
    const projectType = formData.get('projectType') as string;
    const areaStr = formData.get('area') as string;

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Validate and parse numbers
    const lod = lodStr ? parseInt(lodStr) : undefined;
    const area = areaStr ? parseInt(areaStr) : undefined;

    // Get new image files (optional for updates)
    const imageFiles = formData.getAll('images') as File[];
    const replaceImages = formData.get('replaceImages') === 'true'; // Flag to determine if we should replace all images

    // Get existing project
    console.log('Looking for project with ID:', id);
    const existingProject = await Project.findById(id);

    if (!existingProject) {
      console.log('Project not found with ID:', id);
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // console.log('Found existing project:', existingProject);

    let imageUrls: string[] = [];

    // Parse existing imageUrls from JSON string
    try {
      if (existingProject.imageUrls) {
        const parsed = JSON.parse(existingProject.imageUrls);
        imageUrls = Array.isArray(parsed) ? parsed : [parsed];
      }
    } catch (error) {
      // If it's not JSON, treat as single URL
      imageUrls = existingProject.imageUrls ? [existingProject.imageUrls] : [];
    }

    // Handle image updates
    if (imageFiles.length > 0) {
      if (replaceImages) {
        // Delete old images
        for (const imageUrl of imageUrls) {
          const oldImagePath = path.join(process.cwd(), 'public', imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            // console.log('Old image deleted:', oldImagePath);
          }
        }
        imageUrls = []; // Reset array
      }

      // Add new images
      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];

        // Skip if not a valid file
        if (!imageFile || imageFile.size === 0) {
          // console.log(`Skipping invalid file at index ${i}`);
          continue;
        }

        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const imageFileName = `${Date.now()}-${i}-${imageFile.name}`;
        const imagePath = path.join(process.cwd(), 'public/uploads/images', imageFileName);
        fs.writeFileSync(imagePath, imageBuffer);

        const imageUrl = `/uploads/images/${imageFileName}`;
        imageUrls.push(imageUrl);
        // console.log(`New image ${i + 1} saved:`, imagePath);
      }
    }

    // Prepare update data
    const updateData = {
      title,
      description,
      location,
      lod,
      sow,
      projectType,
      area,
      imageUrls: JSON.stringify(imageUrls), // Store as JSON string
      modelUrl,
      modelType,
    };

    console.log('Updating project with data:', updateData);

    // Update project in database
    const project = await Project.findByIdAndUpdate(id, updateData, { new: true });

    console.log('Project updated successfully:', project);
    return NextResponse.json(project);
  } catch (error) {
    console.error('Detailed error updating project:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to update project',
          details: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    console.log('DELETE request received');
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    console.log('Delete request for ID:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Get project to delete files
    const project = await Project.findById(id);

    if (!project) {
      console.log('Project not found for deletion:', id);
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // console.log('Found project for deletion:', project);

    // Delete all image files
    let imageUrls: string[] = [];

    // Parse imageUrls from JSON string
    try {
      if (project.imageUrls) {
        const parsed = JSON.parse(project.imageUrls);
        imageUrls = Array.isArray(parsed) ? parsed : [parsed];
      }
    } catch (error) {
      // If it's not JSON, treat as single URL
      imageUrls = project.imageUrls ? [project.imageUrls] : [];
    }

    if (imageUrls.length > 0) {
      for (const imageUrl of imageUrls) {
        const imagePath = path.join(process.cwd(), 'public', imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          // console.log('Image file deleted:', imagePath);
        }
      }
    }

    // Delete from database
    await Project.findByIdAndDelete(id);

    console.log('Project deleted successfully from database');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Detailed error deleting project:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to delete project',
          details: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
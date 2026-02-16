const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up database...');
  
  // Create upload directories
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const imagesDir = path.join(uploadsDir, 'images');
  const modelsDir = path.join(uploadsDir, 'models');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }
  
  console.log('Upload directories created successfully!');
  
  // Create sample project (optional)
  const sampleProject = await prisma.project.findFirst();
  
  if (!sampleProject) {
    console.log('Creating sample project...');
    
    // Create a placeholder image
    const placeholderImage = path.join(imagesDir, 'sample-project.jpg');
    const placeholderModel = path.join(modelsDir, 'sample-project.fbx');
    
    // You can add actual sample files here if needed
    
    await prisma.project.create({
      data: {
        title: 'Sample Office Building',
        description: 'A modern office complex with sustainable design features',
        location: 'France',
        lod: 350,
        sow: 'Architecture 3D modeling',
        projectType: 'Office building',
        area: 15000,
        imageUrl: '/uploads/images/sample-project.jpg',
        fbxUrl: '/uploads/models/sample-project.fbx',
      },
    });
    
    console.log('Sample project created!');
  }
  
  console.log('Database setup completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
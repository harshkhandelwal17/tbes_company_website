import { Project } from '@/types';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ProjectCardProps {
  project: Project;
}

// Helper function to parse SOW back into trades and services
const parseSOW = (sow: string) => {
  if (!sow) return { trades: [], services: [] };
  
  // Assuming SOW format is "Trade1, Trade2 | Service1, Service2"
  const parts = sow.split(' | ');
  const trades = parts[0] ? parts[0].split(', ').map(t => t.trim()) : [];
  const services = parts[1] ? parts[1].split(', ').map(s => s.trim()) : [];
  
  return { trades, services };
};

// Helper function to convert sqm to sqft
const convertSqmToSqft = (sqm: number): number => {
  return Math.round(sqm * 10.764);
};

// Helper function to convert softwareUsed string to array
const getSoftwareUsedArray = (softwareUsed: string | null | undefined | string[]): string[] => {
  if (!softwareUsed) return [];
  
  // If it's already an array, return it
  if (Array.isArray(softwareUsed)) return softwareUsed;
  
  // If it's a string, split it
  if (typeof softwareUsed === 'string') {
    return softwareUsed.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
  
  return [];
};

// Helper function to get all project images
const getProjectImages = (project: Project): string[] => {
  const images: string[] = [];
  
  // Add main image if exists
  if (project.imageUrl) {
    images.push(project.imageUrl);
  }
  
  // Add additional images if they exist (with type safety)
  // Option 1: Use type assertion if you know the property exists
  if ((project as any).images && Array.isArray((project as any).images)) {
    images.push(...(project as any).images);
  }
  
  // Option 2: Check for other possible image properties in your Project type
  // Uncomment and modify based on your actual Project type structure:
  
  // if (project.galleryImages && Array.isArray(project.galleryImages)) {
  //   images.push(...project.galleryImages);
  // }
  
  // if (project.additionalImages && Array.isArray(project.additionalImages)) {
  //   images.push(...project.additionalImages);
  // }
  
  // if (project.projectImages && Array.isArray(project.projectImages)) {
  //   images.push(...project.projectImages);
  // }
  
  return images;
};

// Image Gallery Modal Component
const ImageGallery = ({ images, isOpen, onClose, initialIndex = 0 }: {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Main Image */}
      <div className="max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
        <div className="relative w-full h-full">
          <Image
            src={images[currentIndex]}
            alt={`Project image ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
          />
        </div>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-md overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 relative rounded overflow-hidden border-2 ${
                index === currentIndex ? 'border-white' : 'border-transparent'
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const { trades, services } = parseSOW(project.sow || '');
  const areaSqft = convertSqmToSqft(project.area || 0);
  const softwareUsedArray = getSoftwareUsedArray(project.softwareUsed);
  const projectImages = getProjectImages(project);
  
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide images on hover
  useEffect(() => {
    if (!isHovered || projectImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, [isHovered, projectImages.length]);

  const openGallery = (index: number = 0) => {
    setIsGalleryOpen(true);
    setCurrentImageIndex(index);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0); // Reset to first image when not hovering
        }}
      >
        
        {/* MAIN CONTAINER - Natural height (no forced aspect ratio) */}
        <div className="flex">
          
          {/* LEFT SIDE - Text Content */}
          <div className="flex-1 p-6">
            
            {/* PROJECT TITLE */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {project.title}
            </h3>
            
            {/* PROJECT DESCRIPTION */}
            {project.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
            )}

            {/* PROJECT DETAILS LIST */}
            <div className="space-y-2 text-sm">
              
              {/* Location */}
              {project.location && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium">{project.location}</span>
                </div>
              )}
              
              {/* LOD */}
              {project.lod && (
                <div className="flex justify-between">
                  <span className="text-gray-500">LOD:</span>
                  <span className="font-medium">{project.lod}</span>
                </div>
              )}
              
              {/* Project Type */}
              {project.projectType && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium">{project.projectType}</span>
                </div>
              )}
              
              {/* Area - Both units */}
              {project.area && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Area:</span>
                  <span className="font-medium">
                    {project.area.toLocaleString()} sqm ({areaSqft.toLocaleString()} sqft)
                  </span>
                </div>
              )}

              {/* Trades */}
              {trades.length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">Trades:</span>
                  <div className="text-right max-w-[60%]">
                    <div className="flex flex-wrap gap-1 justify-end">
                      {trades.map((trade, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {trade}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Services */}
              {services.length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">Services:</span>
                  <div className="text-right max-w-[60%]">
                    <div className="flex flex-wrap gap-1 justify-end">
                      {services.map((service, index) => (
                        <span
                          key={index}
                          className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Software Used */}
              {softwareUsedArray.length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">Software:</span>
                  <div className="text-right max-w-[60%]">
                    <div className="flex flex-wrap gap-1 justify-end">
                      {softwareUsedArray.map((software, index) => (
                        <span
                          key={index}
                          className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                        >
                          {software}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback for old SOW format if parsing fails */}
              {trades.length === 0 && services.length === 0 && project.sow && (
                <div className="flex justify-between">
                  <span className="text-gray-500">SOW:</span>
                  <span className="font-medium text-right max-w-[60%]">{project.sow}</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - Image with Gallery */}
          <div className="w-2/5 p-4">
            <div 
              className="h-64 w-full relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openGallery(currentImageIndex)}
            >
              {projectImages.length > 0 ? (
                <>
                  <Image
                    src={projectImages[currentImageIndex]}
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-300 group-hover:scale-105"
                    sizes="200px"
                    onError={(e) => {
                      console.log('Image failed to load:', projectImages[currentImageIndex]);
                    }}
                  />
                  
                  {/* Image count indicator */}
                  {projectImages.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {currentImageIndex + 1}/{projectImages.length}
                    </div>
                  )}
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                      <p className="text-xs">View Gallery</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs">No Image</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGallery
        images={projectImages}
        isOpen={isGalleryOpen}
        onClose={closeGallery}
        initialIndex={currentImageIndex}
      />
    </>
  );
}
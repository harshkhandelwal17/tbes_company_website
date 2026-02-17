'use client';

import { Project } from '@/types';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
// Make sure this path is correct based on your file structure
import ThreeDViewer from './ThreeDViewer'; 
import { 
  MapPin, Layers, Ruler, Box, ArrowUpRight, 
  X, ChevronLeft, ChevronRight, Maximize2, Cuboid,
  Image as ImageIcon
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

// --- Helper Functions ---
const parseSOW = (sow: string) => {
  if (!sow) return { trades: [], services: [] };
  const parts = sow.split(' | ');
  const trades = parts[0] ? parts[0].split(', ').map(t => t.trim()) : [];
  const services = parts[1] ? parts[1].split(', ').map(s => s.trim()) : [];
  return { trades, services };
};

const convertSqmToSqft = (sqm: number): number => Math.round(sqm * 10.764);

const getSoftwareUsedArray = (softwareUsed: string | null | undefined | string[]): string[] => {
  if (!softwareUsed) return [];
  if (Array.isArray(softwareUsed)) return softwareUsed;
  if (typeof softwareUsed === 'string') return softwareUsed.split(',').map(s => s.trim()).filter(s => s.length > 0);
  return [];
};

const getProjectImages = (project: Project): string[] => {
  const images: string[] = [];
  if (project.imageUrl) images.push(project.imageUrl);
  if ((project as any).images && Array.isArray((project as any).images)) images.push(...(project as any).images);
  return images;
};

// --- Image Gallery Modal Component ---
const ImageGallery = ({ images, isOpen, onClose, initialIndex = 0 }: { images: string[]; isOpen: boolean; onClose: () => void; initialIndex?: number; }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync internal state when modal opens
  useEffect(() => { setCurrentIndex(initialIndex); }, [initialIndex, isOpen]);

  const nextImage = useCallback(() => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)), [images.length]);
  const prevImage = useCallback(() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)), [images.length]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextImage, prevImage, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
         <span className="text-white/70 text-sm font-mono tracking-widest uppercase">
            Gallery View • {currentIndex + 1} / {images.length}
         </span>
         <button 
            onClick={onClose} 
            className="p-3 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white transition-all"
         >
            <X size={24} />
         </button>
      </div>

      {/* Navigation & Image */}
      <div className="relative w-full h-[80vh] flex items-center justify-center px-4 md:px-12 group/gallery">
        <button 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 z-50 p-4 rounded-full bg-white/5 hover:bg-blue-600 text-white transition-all hidden md:flex hover:scale-110 active:scale-95"
        >
          <ChevronLeft size={32} />
        </button>
        
        <div className="relative w-full h-full max-w-7xl">
          <Image 
            src={images[currentIndex]} 
            alt="Gallery Project View" 
            fill 
            className="object-contain drop-shadow-2xl" 
            priority
            quality={100}
          />
        </div>

        <button 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 z-50 p-4 rounded-full bg-white/5 hover:bg-blue-600 text-white transition-all hidden md:flex hover:scale-110 active:scale-95"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Thumbnails Strip */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 overflow-x-auto max-w-[90vw] p-3 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-md">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
            className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
              idx === currentIndex 
                ? 'border-blue-500 scale-105 opacity-100 ring-4 ring-blue-500/20' 
                : 'border-transparent opacity-40 hover:opacity-100'
            }`}
          >
             <Image src={img} alt="thumb" fill className="object-cover" sizes="64px" />
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Main Project Card Component ---
export default function ProjectCard({ project }: ProjectCardProps) {
  const { trades, services } = parseSOW(project.sow || '');
  const areaSqft = convertSqmToSqft(project.area || 0);
  const softwareUsedArray = getSoftwareUsedArray(project.softwareUsed);
  const projectImages = getProjectImages(project);

  // States
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [show3DModal, setShow3DModal] = useState(false);
  
  const has3DModel = !!project.modelUrl;

  // Handlers
  const openGallery = (e?: React.MouseEvent, index: number = 0) => {
    e?.stopPropagation();
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  return (
    <>
      <div 
        className="group relative bg-[#0B0F19] rounded-[2rem] border border-white/5 overflow-hidden hover:border-blue-500/40 hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.3)] transition-all duration-500 flex flex-col h-full cursor-pointer"
        onClick={() => openGallery()}
      >
        
        {/* =========================================
            1. IMAGE HEADER
        ========================================= */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
          
          {/* 3D Indicator Badge (Pulsing) */}
          {has3DModel && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600/90 backdrop-blur-md text-white shadow-lg border border-indigo-400/30 animate-pulse">
               <Cuboid size={14} className="animate-spin-slow" />
               <span className="text-[10px] font-bold uppercase tracking-wide">3D View</span>
            </div>
          )}

          {/* Location Badge */}
          {project.location && (
             <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-200 border border-white/10 shadow-lg">
                <MapPin size={12} className="text-blue-400"/>
                <span className="text-[10px] font-bold uppercase tracking-wider">{project.location}</span>
             </div>
          )}

          {/* Main Image */}
          {projectImages.length > 0 ? (
            <Image
              src={projectImages[0]}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 space-y-2">
               <ImageIcon size={48} strokeWidth={1} />
               <p className="text-xs font-mono uppercase">No Preview Available</p>
            </div>
          )}

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>

          {/* Hover Action Overlay */}
          <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
             <div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                <Maximize2 size={16} /> Open Gallery
             </div>
          </div>
        </div>

        {/* =========================================
            2. CONTENT BODY
        ========================================= */}
        <div className="p-6 flex flex-col flex-grow relative z-10 -mt-2">
          
          {/* Project Type Tag */}
          <div className="flex items-center justify-between mb-3">
             <span className="inline-block px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                {project.projectType || 'Engineering'}
             </span>
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-1 group-hover:translate-x-1">
                <ArrowUpRight size={16} />
             </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white leading-snug mb-4 group-hover:text-blue-400 transition-colors line-clamp-2">
             {project.title}
          </h3>

          {/* Engineering Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
             {/* LOD Box */}
             <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                   <Layers size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-wider">LOD Level</span>
                </div>
                <p className="text-sm font-bold text-white">{project.lod ? `LOD ${project.lod}` : 'N/A'}</p>
             </div>

             {/* Area Box */}
             <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                   <Ruler size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-wider">Area</span>
                </div>
                <p className="text-sm font-bold text-white truncate">
                   {project.area ? `${(project.area / 1000).toFixed(1)}k Sq.Ft` : 'N/A'}
                </p>
             </div>
          </div>

          {/* Footer: Tech Stack & 3D Button */}
          <div className="mt-auto space-y-4">
             {/* Tech Stack Chips */}
             {softwareUsedArray.length > 0 && (
                <div className="flex flex-wrap gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                   {softwareUsedArray.slice(0, 3).map((soft, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-medium text-slate-300 border border-white/5">
                         {soft}
                      </span>
                   ))}
                   {softwareUsedArray.length > 3 && (
                      <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-slate-400 border border-white/5">
                         +{softwareUsedArray.length - 3}
                      </span>
                   )}
                </div>
             )}

             {/* Interactive 3D Button (Only shows if model exists) */}
             {has3DModel && (
                <button
                   onClick={(e) => {
                      e.stopPropagation();
                      setShow3DModal(true);
                   }}
                   className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] relative overflow-hidden group/btn z-20"
                >
                   <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                   <Cuboid size={16} className="relative z-10" /> 
                   <span className="relative z-10">Launch 3D Model</span>
                </button>
             )}
          </div>
        </div>
      </div>

      {/* =========================================
          3. FULL SCREEN 3D MODAL (Cinema Mode)
      ========================================= */}
      {show3DModal && project.modelUrl && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in zoom-in-95 duration-300">
           
           {/* Header Overlay */}
           <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-start bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none">
              <div className="pointer-events-auto">
                 <h2 className="text-white font-bold text-xl drop-shadow-md">{project.title}</h2>
                 <p className="text-blue-400 text-xs font-mono mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Interactive 3D View • LOD {project.lod}
                 </p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShow3DModal(false); }}
                className="pointer-events-auto p-3 bg-white/10 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md border border-white/10 transition-all hover:rotate-90"
              >
                 <X size={24} />
              </button>
           </div>

           {/* 3D Viewer Container */}
           <div className="flex-1 w-full h-full relative bg-[#05080F]">
              <ThreeDViewer 
                 modelUrl={project.modelUrl} 
                 modelType={project.modelType || 'glb'} 
                 className="w-full h-full" 
              />
              
              {/* Controls Guide */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 text-slate-300 text-xs font-medium flex gap-6 shadow-2xl pointer-events-none select-none">
                 <span className="flex items-center gap-2"><span className="text-white">🖱️ Left:</span> Rotate</span>
                 <span className="w-px h-4 bg-white/20"></span>
                 <span className="flex items-center gap-2"><span className="text-white">🖱️ Right:</span> Pan</span>
                 <span className="w-px h-4 bg-white/20"></span>
                 <span className="flex items-center gap-2"><span className="text-white">🖱️ Scroll:</span> Zoom</span>
              </div>
           </div>
        </div>
      )}

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
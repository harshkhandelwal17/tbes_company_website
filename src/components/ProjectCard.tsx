'use client';

import { Project } from '@/types';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import ThreeDViewer from './ThreeDViewer';
import {
   MapPin, Layers, Ruler, ArrowUpRight,
   X, ChevronLeft, ChevronRight, Maximize2, Cuboid,
   Image as ImageIcon, FileText, Wrench, Monitor, Building2
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

const getSoftwareUsedArray = (softwareUsed: string | null | undefined | string[]): string[] => {
   if (!softwareUsed) return [];
   if (Array.isArray(softwareUsed)) return softwareUsed;
   if (typeof softwareUsed === 'string') return softwareUsed.split(',').map(s => s.trim()).filter(s => s.length > 0);
   return [];
};

const getProjectImages = (project: Project): string[] => {
   const imagesArray = (project as any).images;
   if (imagesArray && Array.isArray(imagesArray) && imagesArray.length > 0) {
      return imagesArray.filter((img: any) => typeof img === 'string' && img.trim() !== '');
   }
   if (project.imageUrl) return [project.imageUrl];
   return [];
};

// --- Image Gallery Modal (clean, images only) ---
const ImageGallery = ({
   images, isOpen, onClose, initialIndex = 0,
}: {
   images: string[];
   isOpen: boolean;
   onClose: () => void;
   initialIndex?: number;
}) => {
   const [currentIndex, setCurrentIndex] = useState(initialIndex);

   useEffect(() => { setCurrentIndex(initialIndex); }, [initialIndex, isOpen]);

   const nextImage = useCallback(() => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)), [images.length]);
   const prevImage = useCallback(() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)), [images.length]);

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

   if (!isOpen || !images || images.length === 0) return null;

   return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
         {/* Top Bar */}
         <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-50">
            <span className="text-slate-500 text-sm font-mono tracking-widest uppercase">
               Gallery • {currentIndex + 1} / {images.length}
            </span>
            <button onClick={onClose} className="p-3 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-600 transition-all">
               <X size={24} />
            </button>
         </div>

         {/* Navigation & Image */}
         <div className="relative w-full h-[80vh] flex items-center justify-center px-4 md:px-16">
            <button
               onClick={(e) => { e.stopPropagation(); prevImage(); }}
               className="absolute left-4 z-50 p-4 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition-all hidden md:flex hover:scale-110 active:scale-95"
            >
               <ChevronLeft size={32} />
            </button>
            <div className="relative w-full h-full max-w-7xl media-no-save" onContextMenu={e => e.preventDefault()}>
               {images[currentIndex] && (
                  <Image src={images[currentIndex]} alt="Project" fill className="object-contain" priority sizes="100vw" draggable={false} />
               )}
            </div>
            <button
               onClick={(e) => { e.stopPropagation(); nextImage(); }}
               className="absolute right-4 z-50 p-4 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition-all hidden md:flex hover:scale-110 active:scale-95"
            >
               <ChevronRight size={32} />
            </button>
         </div>

         {/* Thumbnails */}
         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 overflow-x-auto max-w-[90vw] p-3 bg-slate-100 rounded-2xl border border-slate-200">
            {images.map((img, idx) => (
               <button key={idx} onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                  onContextMenu={e => e.preventDefault()}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${idx === currentIndex ? 'border-blue-500 scale-105 ring-4 ring-blue-500/20' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                  {img && <Image src={img} alt="thumb" fill className="object-cover pointer-events-none" sizes="64px" draggable={false} />}
               </button>
            ))}
         </div>
      </div>
   );
};

// --- Project Detail Modal ---
const ProjectDetailModal = ({ project, isOpen, onClose }: { project: Project; isOpen: boolean; onClose: () => void; }) => {
   const { trades, services } = parseSOW(project.sow || '');
   const softwareUsedArray = getSoftwareUsedArray(project.softwareUsed);

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => { if (isOpen && e.key === 'Escape') onClose(); };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, onClose]);

   if (!isOpen) return null;

   return (
      <div
         className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
         onClick={onClose}
      >
         <div
            className="relative bg-[#0D1120] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/60 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
         >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0D1120]/95 backdrop-blur-md border-b border-white/5 px-6 py-5 flex items-start justify-between gap-4">
               <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20 mb-2">
                     {project.projectType || 'Engineering'}
                  </span>
                  <h2 className="text-xl font-bold text-white leading-snug">{project.title}</h2>
                  {project.location && (
                     <div className="flex items-center gap-1.5 mt-1.5 text-slate-400 text-xs">
                        <MapPin size={12} className="text-blue-400" />
                        <span>{project.location}</span>
                     </div>
                  )}
               </div>
               <button
                  onClick={onClose}
                  className="shrink-0 p-2 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/60 transition-all mt-1"
               >
                  <X size={20} />
               </button>
            </div>

            <div className="px-6 py-6 space-y-6">

               {/* Stats Row */}
               <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                     <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                        <Layers size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">LOD Level</span>
                     </div>
                     <p className="text-lg font-bold text-white">{project.lod ? `LOD ${project.lod}` : 'N/A'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                     <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                        <Ruler size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Area</span>
                     </div>
                     <p className="text-lg font-bold text-white">
                        {project.area ? `${(project.area / 1000).toFixed(1)}k Sq.M` : 'N/A'}
                     </p>
                  </div>
               </div>

               {/* Description */}
               {project.description && (
                  <div>
                     <div className="flex items-center gap-2 mb-3">
                        <FileText size={14} className="text-blue-400" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400">Description</h4>
                     </div>
                     <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{project.description}</p>
                  </div>
               )}

               {/* Scope of Work */}
               {(trades.length > 0 || services.length > 0) && (
                  <div>
                     <div className="flex items-center gap-2 mb-3">
                        <Wrench size={14} className="text-emerald-400" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Scope of Work</h4>
                     </div>
                     <div className="space-y-3">
                        {trades.length > 0 && (
                           <div>
                              
                              <div className="flex flex-wrap gap-2">
                                 {trades.map((t, i) => (
                                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/20">{t}</span>
                                 ))}
                              </div>
                           </div>
                        )}
                        {services.length > 0 && (
                           <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Services</p>
                              <div className="flex flex-wrap gap-2">
                                 {services.map((s, i) => (
                                    <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 text-xs font-medium border border-blue-500/20">{s}</span>
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {/* Software Used */}
               {softwareUsedArray.length > 0 && (
                  <div>
                     <div className="flex items-center gap-2 mb-3">
                        <Monitor size={14} className="text-indigo-400" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Software Used</h4>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {softwareUsedArray.map((s, i) => (
                           <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-medium border border-indigo-500/20">{s}</span>
                        ))}
                     </div>
                  </div>
               )}

            </div>
         </div>
      </div>
   );
};

// --- Main Project Card Component ---
export default function ProjectCard({ project }: ProjectCardProps) {
   const softwareUsedArray = getSoftwareUsedArray(project.softwareUsed);
   const projectImages = getProjectImages(project);

   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const [isDetailOpen, setIsDetailOpen] = useState(false);
   const [show3DModal, setShow3DModal] = useState(false);

   const has3DModel = !!project.modelUrl;

   const openGallery = (e: React.MouseEvent, index: number = 0) => {
      e.stopPropagation();
      if (projectImages.length === 0) return;
      setCurrentImageIndex(index);
      setIsGalleryOpen(true);
   };

   const openDetail = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsDetailOpen(true);
   };

   return (
      <>
         <div className="group relative bg-[#0B0F19] rounded-[2rem] border border-white/5 overflow-hidden hover:border-blue-500/40 hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.3)] transition-all duration-500 flex flex-col h-full">

            {/* =========================================
                1. IMAGE SECTION — click = gallery
            ========================================= */}
            <div
               className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900 cursor-pointer media-no-save"
               onClick={(e) => openGallery(e)}
               onContextMenu={e => e.preventDefault()}
            >
               {/* 3D Badge */}
               {has3DModel && (
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600/90 backdrop-blur-md text-white shadow-lg border border-indigo-400/30 animate-pulse">
                     <Cuboid size={14} />
                     <span className="text-[10px] font-bold uppercase tracking-wide">3D View</span>
                  </div>
               )}

               {/* Location Badge */}
               {project.location && (
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-200 border border-white/10 shadow-lg">
                     <MapPin size={12} className="text-blue-400" />
                     <span className="text-[10px] font-bold uppercase tracking-wider">{project.location}</span>
                  </div>
               )}

               {/* Main Image */}
               {projectImages.length > 0 ? (
                  <Image
                     src={projectImages[0]}
                     alt={project.title}
                     fill
                     className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
               ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 space-y-2">
                     <ImageIcon size={48} strokeWidth={1} />
                     <p className="text-xs font-mono uppercase">No Preview</p>
                  </div>
               )}

               {/* Gradient Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-500" />

               {/* Hover hint */}
               {projectImages.length > 0 && (
                  <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                     <div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                        <Maximize2 size={16} /> View Gallery
                     </div>
                  </div>
               )}

               {/* Image count badge */}
               {projectImages.length > 1 && (
                  <div className="absolute bottom-3 right-3 z-20 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white/70 text-[10px] font-mono border border-white/10">
                     1 / {projectImages.length}
                  </div>
               )}
            </div>

            {/* =========================================
                2. CONTENT SECTION — click = detail modal
            ========================================= */}
            <div
               className="p-6 flex flex-col flex-grow relative z-10 cursor-pointer"
               onClick={openDetail}
            >
               {/* Project Type Tag + Arrow */}
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

               {/* Stats */}
               <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                     <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Layers size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">LOD</span>
                     </div>
                     <p className="text-sm font-bold text-white">{project.lod ? `LOD ${project.lod}` : 'N/A'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                     <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Ruler size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Area</span>
                     </div>
                     <p className="text-sm font-bold text-white truncate">
                        {project.area ? `${(project.area / 1000).toFixed(1)}k Sq.M` : 'N/A'}
                     </p>
                  </div>
               </div>

               {/* "View Details" hint text */}
               <p className="text-[11px] text-slate-500 group-hover:text-blue-400/60 transition-colors mb-4">
                  Click for description &amp; scope of work →
               </p>

               {/* Software chips */}
               <div className="mt-auto space-y-4">
                  {softwareUsedArray.length > 0 && (
                     <div className="flex flex-wrap gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        {softwareUsedArray.slice(0, 3).map((soft, idx) => (
                           <span key={idx} className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-medium text-slate-300 border border-white/5">{soft}</span>
                        ))}
                        {softwareUsedArray.length > 3 && (
                           <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-slate-400 border border-white/5">+{softwareUsedArray.length - 3}</span>
                        )}
                     </div>
                  )}

                  {/* 3D Button */}
                  {has3DModel && (
                     <button
                        onClick={(e) => { e.stopPropagation(); setShow3DModal(true); }}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] relative overflow-hidden group/btn z-20"
                     >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                        <Cuboid size={16} className="relative z-10" />
                        <span className="relative z-10">Launch 3D Model</span>
                     </button>
                  )}
               </div>
            </div>
         </div>

         {/* =========================================
             3. GALLERY MODAL (images only)
         ========================================= */}
         <ImageGallery
            images={projectImages}
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
            initialIndex={currentImageIndex}
         />

         {/* =========================================
             4. DETAIL MODAL (all project info)
         ========================================= */}
         <ProjectDetailModal
            project={project}
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
         />

         {/* =========================================
             5. 3D MODAL
         ========================================= */}
         {show3DModal && project.modelUrl && (
            <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in zoom-in-95 duration-300">
               <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-start bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none">
                  <div className="pointer-events-auto">
                     <h2 className="text-white font-bold text-xl drop-shadow-md">{project.title}</h2>
                     <p className="text-blue-400 text-xs font-mono mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
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
               <div className="flex-1 w-full h-full relative bg-[#05080F]">
                  <ThreeDViewer modelUrl={project.modelUrl} modelType={project.modelType || 'glb'} className="w-full h-full" />
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 text-slate-300 text-xs font-medium flex gap-6 shadow-2xl pointer-events-none select-none">
                     <span className="flex items-center gap-2"><span className="text-white">🖱️ Left:</span> Rotate</span>
                     <span className="w-px h-4 bg-white/20" />
                     <span className="flex items-center gap-2"><span className="text-white">🖱️ Right:</span> Pan</span>
                     <span className="w-px h-4 bg-white/20" />
                     <span className="flex items-center gap-2"><span className="text-white">🖱️ Scroll:</span> Zoom</span>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}
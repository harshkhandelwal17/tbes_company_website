'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, Edit2, Trash2, X, Image as ImageIcon,
  MapPin, Save, UploadCloud,
  Cuboid, Cpu, FolderKanban, CheckCircle2, FileCode, Loader2, Database
} from 'lucide-react';

// --- Types ---
interface Project {
  id: string;
  title: string;
  location: string;
  projectType: string;
  area: number;
  lod: string;
  sow: string;
  softwareUsed: string;
  description?: string;
  images?: string[];
  modelUrl?: string;
  status?: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // UI States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '', location: '', projectType: 'Commercial',
    area: 0, lod: 'LOD 300', description: '',
    sow: '', softwareUsed: '', status: 'active',
    images: [], // Stores URLs of existing images
    modelUrl: '' // Stores URL of existing model
  });

  // File Handling States (For NEW uploads)
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [newModelFile, setNewModelFile] = useState<File | null>(null);

  // --- Progress Bar State ---
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- Fetch Data ---
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleOpenForm = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        ...project,
        lod: (typeof project.lod === 'number' || !String(project.lod).startsWith('LOD')) ? `LOD ${project.lod}` : project.lod,
        images: project.images || [],
        modelUrl: project.modelUrl || ''
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '', location: '', projectType: 'Commercial',
        area: 0, lod: 'LOD 300', description: '',
        sow: '', softwareUsed: '', status: 'active',
        images: [], modelUrl: ''
      });
    }
    // Reset New Files & Progress
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setNewModelFile(null);
    setUploadProgress(0);
    setIsFormOpen(true);
  };

  // --- 1. Image Handlers ---
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setNewImageFiles(prev => [...prev, ...newFiles]);
      setNewImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const removeExistingImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== indexToRemove)
    }));
  };

  // --- 2. Model Handlers ---
  const handleModelSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewModelFile(e.target.files[0]);
    }
  };

  const removeNewModel = () => {
    setNewModelFile(null);
  };

  const removeExistingModel = () => {
    setFormData(prev => ({ ...prev, modelUrl: '' }));
  };

  // --- Submit with Progress Simulation ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    // 1. Simulate Progress (0% to 90%)
    // Since standard fetch doesn't support upload progress, we simulate it for UX
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 400); // Updates every 400ms

    try {
      const uploadData = new FormData();

      // Basic Fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          uploadData.append('existingImages', JSON.stringify(value));
        } else if (key !== 'modelUrl') {
          if (value !== undefined && value !== null) uploadData.append(key, value.toString());
        }
      });

      // Handle Model Logic
      if (formData.modelUrl) {
        uploadData.append('existingModelUrl', formData.modelUrl);
      }

      if (editingProject) uploadData.append('id', editingProject.id);

      // Append NEW Files
      newImageFiles.forEach((file) => uploadData.append('newImages', file));
      if (newModelFile) uploadData.append('newModel', newModelFile);

      const url = '/api/admin/projects';
      const method = editingProject ? 'PUT' : 'POST';

      // 2. Real Upload Request
      const res = await fetch(url, { method, body: uploadData });

      // 3. Complete Progress
      clearInterval(interval);
      setUploadProgress(100);

      if (res.ok) {
        await fetchProjects();
        // Small delay to show 100% before closing
        setTimeout(() => setIsFormOpen(false), 500);
      } else {
        alert('Failed to save project');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full text-white overflow-x-hidden pb-20">

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Project Gallery</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your portfolio, 3D models (FBX/GLB), and details.</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95"
        >
          <Plus size={20} /> Add Project
        </button>
      </div>

      <div className="relative group mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 bg-[#09090b] border border-white/[0.08] rounded-xl pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
        />
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-80 bg-zinc-900 rounded-[1.5rem] animate-pulse"></div>)}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
          <FolderKanban className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
          <p className="text-zinc-500">No projects found. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div key={project.id} className="group bg-[#09090b] border border-white/[0.08] rounded-[1.5rem] overflow-hidden hover:border-white/[0.2] transition-all duration-300 flex flex-col">
              <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                {project.images && project.images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700"><ImageIcon size={40} /></div>
                )}
                {project.modelUrl && (
                  <div className="absolute top-4 left-4 z-10 px-2 py-1 rounded-md bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <Cuboid size={12} /> 3D Model
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded backdrop-blur-md mb-2 inline-block">{project.projectType}</span>
                  <h3 className="text-lg font-bold text-white leading-tight truncate">{project.title}</h3>
                  <div className="flex items-center gap-1 text-zinc-400 text-xs mt-1"><MapPin size={12} /> {project.location}</div>
                </div>
              </div>
              <div className="p-5 mt-auto">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5"><p className="text-[10px] text-zinc-500 uppercase font-bold">Area</p><p className="text-sm font-medium text-zinc-200">{Number(project.area).toLocaleString()}</p></div>
                  <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5"><p className="text-[10px] text-zinc-500 uppercase font-bold">LOD</p><p className="text-sm font-medium text-zinc-200">{project.lod}</p></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenForm(project)} className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"><Edit2 size={14} /> Edit</button>
                  <button onClick={() => handleDelete(project.id)} className="w-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =======================
          4. FORM MODAL
      ======================== */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in" onClick={() => !isSubmitting && setIsFormOpen(false)} />

          <div className="relative w-full max-w-4xl bg-[#0c0c0e] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0c0c0e] rounded-t-3xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h2>
              {!isSubmitting && (
                <button onClick={() => setIsFormOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">

              {/* --- UPLOAD PROGRESS OVERLAY --- */}
              {isSubmitting && (
                <div className="absolute inset-0 z-20 bg-[#0c0c0e]/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 transition-all duration-300">
                  <div className="w-full max-w-md space-y-6 text-center">

                    <div className="flex flex-col items-center justify-center gap-4 text-blue-400 mb-2">
                      {/* Large Spinner */}
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-white">{uploadProgress}%</div>
                      </div>
                      <span className="text-2xl font-bold text-white animate-pulse">Uploading Assets...</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-zinc-300">Please do not close this window.</p>
                      <p className="text-xs text-zinc-500">Large 3D models may take a few minutes.</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/10 pb-2">Basic Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-zinc-400">Project Title *</label>
                      <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">Location *</label>
                      <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">Project Type</label>
                      <select value={formData.projectType} onChange={(e) => setFormData({ ...formData, projectType: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all">
                        {['Commercial', 'Residential', 'Industrial', 'Infrastructure', 'Healthcare', 'Educational'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/10 pb-2">Technical Specs</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">Total Area (sqm)</label>
                      <input type="number" value={formData.area} onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">LOD Level</label>
                      <select value={formData.lod} onChange={(e) => setFormData({ ...formData, lod: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all">
                        {['LOD 100', 'LOD 200', 'LOD 300', 'LOD 350', 'LOD 400', 'LOD 500'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-zinc-400">Software Used</label>
                      <input type="text" value={formData.softwareUsed} onChange={(e) => setFormData({ ...formData, softwareUsed: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-zinc-400">Scope of Work (SOW)</label>
                      <input type="text" value={formData.sow} onChange={(e) => setFormData({ ...formData, sow: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all" placeholder="e.g. BIM Modeling & Coordination" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-zinc-400">Description</label>
                      <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all resize-none" />
                    </div>
                  </div>
                </div>

                {/* --- MEDIA SECTION --- */}
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/10 pb-2">Media Assets</h3>

                  {/* 1. Images */}
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-zinc-400">Project Images</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {/* Existing Images */}
                      {formData.images?.map((src, idx) => (
                        <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-white/20 group">
                          <img src={src} alt="existing" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => removeExistingImage(idx)} className="p-1.5 bg-red-600 rounded-full text-white hover:bg-red-500"><Trash2 size={14} /></button>
                          </div>
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 rounded text-[9px] text-white backdrop-blur-sm">Saved</span>
                        </div>
                      ))}
                      {/* New Images */}
                      {newImagePreviews.map((src, idx) => (
                        <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-blue-500/50 group">
                          <img src={src} alt="new" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => removeNewImage(idx)} className="p-1.5 bg-red-600 rounded-full text-white hover:bg-red-500"><X size={14} /></button>
                          </div>
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-blue-600 rounded text-[9px] text-white backdrop-blur-sm">New</span>
                        </div>
                      ))}
                      {/* Upload Button */}
                      <label className="aspect-square border-2 border-dashed border-white/10 rounded-xl hover:bg-white/5 hover:border-blue-500/50 cursor-pointer flex flex-col items-center justify-center text-zinc-500 hover:text-blue-400 transition-all">
                        <Plus size={24} />
                        <span className="text-[10px] mt-1 font-medium">Add Image</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageSelection} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* 2. 3D Model */}
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                      <Cuboid size={14} className="text-indigo-400" /> 3D Model
                    </label>

                    {newModelFile ? (
                      <div className="flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl animate-in fade-in">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><FileCode size={20} /></div>
                          <div>
                            <p className="text-sm font-bold text-white truncate max-w-[200px]">{newModelFile.name}</p>
                            <p className="text-xs text-indigo-300">{(newModelFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload</p>
                          </div>
                        </div>
                        <button type="button" onClick={removeNewModel} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><X size={18} /></button>
                      </div>
                    ) : formData.modelUrl ? (
                      <div className="flex items-center justify-between p-4 bg-zinc-900 border border-white/10 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/5 rounded-lg text-zinc-300"><Database size={20} /></div>
                          <div>
                            <p className="text-sm font-bold text-white">Current 3D Model</p>
                            <p className="text-xs text-zinc-500 text-ellipsis max-w-[200px] overflow-hidden whitespace-nowrap">{formData.modelUrl.split('/').pop()}</p>
                          </div>
                        </div>
                        <button type="button" onClick={removeExistingModel} className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-all">Remove & Replace</button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 hover:border-indigo-500/30 transition-all relative group cursor-pointer">
                        <input type="file" accept=".glb,.gltf,.fbx,.obj" onChange={handleModelSelection} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="flex flex-col items-center gap-2 text-zinc-400 group-hover:text-indigo-400 transition-colors">
                          <Cuboid size={28} />
                          <div>
                            <p className="text-sm font-bold text-zinc-300 group-hover:text-white">Upload 3D Asset</p>
                            <p className="text-xs text-zinc-500 mt-1">.FBX, .OBJ, .GLB supported</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-white/10 bg-[#0c0c0e] rounded-b-3xl">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2
                  ${isSubmitting
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white active:scale-[0.98]'}`}
              >
                {isSubmitting ? 'Processing...' : <><Save size={18} /> Save Project</>}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
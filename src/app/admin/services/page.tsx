'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Loader2, Search,
  Settings, Box, X, Save, ArrowRight, CheckCircle2
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Service {
  _id: string;
  slug: string;
  title: string;
  icon: string;
  description: string;
  details: string[];
  software: string[];
  image: string;
  color: string;
  outcome: string;
  order: number;
  active: boolean;
  // New Fields
  benefits: string[];
  features: string[];
  process: { title: string; description: string }[];
  keyDeliverables: string[];
  faqs: { question: string; answer: string }[];
}

const COLORS = [
  { name: 'blue', hex: '#3b82f6' },
  { name: 'indigo', hex: '#6366f1' },
  { name: 'emerald', hex: '#10b981' },
  { name: 'purple', hex: '#a855f7' },
  { name: 'orange', hex: '#f97316' },
  { name: 'rose', hex: '#f43f5e' },
  { name: 'cyan', hex: '#06b6d4' },
  { name: 'slate', hex: '#64748b' }
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<Omit<Service, '_id'>>({
    slug: '', title: '', icon: 'Box', description: '',
    details: [''], software: [''], image: '',
    color: 'blue', outcome: 'Enhanced Efficiency', order: 0, active: true,
    benefits: [''], features: [''], process: [{ title: '', description: '' }],
    keyDeliverables: [''], faqs: [{ question: '', answer: '' }],
  });

  // Image Upload States
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services?all=true');
      const data = await res.json();
      if (Array.isArray(data)) {
        setServices(data.sort((a, b) => a.order - b.order));
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) setServices(services.filter((s) => s._id !== id));
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  // --- Form Handlers ---
  const handleOpenForm = (service?: Service) => {
    if (service) {
      setEditingId(service._id);
      setForm({
        ...service,
        benefits: service.benefits || [''],
        features: service.features || [''],
        process: (service.process && service.process.length > 0) ? service.process : [{ title: '', description: '' }],
        keyDeliverables: service.keyDeliverables || [''],
        faqs: (service.faqs && service.faqs.length > 0) ? service.faqs : [{ question: '', answer: '' }],
        details: service.details || [''],
        software: service.software || [''],
      });
    } else {
      setEditingId(null);
      setForm({
        slug: '', title: '', icon: 'Box', description: '',
        details: [''], software: [''], image: '',
        color: 'blue', outcome: '', order: services.length + 1, active: true,
        benefits: [''], features: [''], process: [{ title: '', description: '' }],
        keyDeliverables: [''], faqs: [{ question: '', answer: '' }],
      });
    }
    setPendingImageFile(null);
    setImagePreview(service?.image || '');
    setIsFormOpen(true);
  };

  // Handle Image Selection (Local Preview only)
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageUploadError('');
    setImageUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let finalImageUrl = form.image;

    try {
      // 1. Upload image to R2 IF a new one was selected
      if (pendingImageFile) {
        setIsImageUploading(true);
        setImageUploadProgress(10);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: pendingImageFile.name,
            contentType: pendingImageFile.type || 'image/jpeg',
            folder: 'tbes-services'
          })
        });

        if (!uploadRes.ok) throw new Error('Failed to get upload URL');
        const { presignedUrl, publicUrl } = await uploadRes.json();

        const progressInterval = setInterval(() => {
          setImageUploadProgress(prev => Math.min(prev + 15, 90));
        }, 300);

        const r2Res = await fetch(presignedUrl, { method: 'PUT', body: pendingImageFile });
        clearInterval(progressInterval);

        if (!r2Res.ok) throw new Error('R2 Upload failed');

        finalImageUrl = publicUrl;
        setImageUploadProgress(100);
        setIsImageUploading(false);
      }

      // 2. Submit Service Data
      const url = editingId ? `/api/services/${editingId}` : '/api/services';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          image: finalImageUrl,
          details: (form.details || []).filter(d => d.trim() !== ''),
          software: (form.software || []).filter(s => s.trim() !== ''),
          benefits: (form.benefits || []).filter(b => b.trim() !== ''),
          features: (form.features || []).filter(f => f.trim() !== ''),
          keyDeliverables: (form.keyDeliverables || []).filter(k => k.trim() !== ''),
          process: (form.process || []).filter(p => p.title.trim() !== '' && p.description.trim() !== ''),
          faqs: (form.faqs || []).filter(f => f.question.trim() !== '' && f.answer.trim() !== ''),
        }),
      });

      if (res.ok) {
        await fetchServices();
        setIsFormOpen(false);
      } else {
        alert('Failed to save service.');
      }
    } catch (error: any) {
      console.error(error);
      setImageUploadError(error.message);
    } finally {
      setIsSubmitting(false);
      setIsImageUploading(false);
    }
  };

  const handleArrayChange = (field: 'details' | 'software' | 'benefits' | 'features' | 'keyDeliverables', index: number, value: string) => {
    const newArray = [...(form[field] || [])];
    newArray[index] = value;
    setForm({ ...form, [field]: newArray });
  };

  const addArrayItem = (field: 'details' | 'software' | 'benefits' | 'features' | 'keyDeliverables') => {
    setForm({ ...form, [field]: [...(form[field] || []), ''] });
  };

  const removeArrayItem = (field: 'details' | 'software' | 'benefits' | 'features' | 'keyDeliverables', index: number) => {
    const newArray = [...(form[field] || [])];
    newArray.splice(index, 1);
    setForm({ ...form, [field]: newArray });
  };

  const handleComplexArrayChange = (field: 'process' | 'faqs', index: number, subField: string, value: string) => {
    const newArray = [...(form[field] || [])] as any[];
    newArray[index] = { ...newArray[index], [subField]: value };
    setForm({ ...form, [field]: newArray });
  };

  const addComplexItem = (field: 'process' | 'faqs') => {
    const newItem = field === 'process' ? { title: '', description: '' } : { question: '', answer: '' };
    setForm({ ...form, [field]: [...(form[field] || []), newItem] as any });
  };

  const removeComplexItem = (field: 'process' | 'faqs', index: number) => {
    const newArray = [...(form[field] || [])];
    newArray.splice(index, 1);
    setForm({ ...form, [field]: newArray });
  };

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full text-white overflow-x-hidden pb-20">

      {/* =======================
          1. HEADER & ACTIONS
      ======================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Services Platform</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage offerings, capabilities, and website visibility.</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95"
        >
          <Plus size={20} /> Create Service
        </button>
      </div>

      <div className="relative group mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
        <input
          type="text"
          placeholder="Search services by title or slug..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 bg-[#09090b] border border-white/[0.08] rounded-xl pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
        />
      </div>

      {/* =======================
          2. SERVICES GRID
      ======================== */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-zinc-900 rounded-[1.5rem] animate-pulse"></div>)}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
          <Settings className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
          <p className="text-zinc-500">No services configured yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            // Dynamically render icon if it exists in lucide-react, otherwise fallback
            // @ts-ignore
            const IconComponent = LucideIcons[service.icon] || Box;
            const themeColor = COLORS.find(c => c.name === service.color)?.hex || '#3b82f6';

            return (
              <div key={service._id} className="group bg-[#09090b] border border-white/[0.08] rounded-[1.5rem] overflow-hidden hover:border-white/[0.2] transition-all duration-300 flex flex-col relative">

                {/* Active/Draft Badge */}
                <div className={`absolute top-4 right-4 z-10 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${service.active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-zinc-800/80 text-zinc-400 border-zinc-700'
                  }`}>
                  {service.active ? 'Live' : 'Draft'}
                </div>

                {/* Card Header with Color Splash & Image */}
                <div className="relative h-44 overflow-hidden">
                  {service.image ? (
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                      <Box size={40} className="text-zinc-800" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent"></div>
                  <div className="absolute top-[-50px] left-[-50px] w-32 h-32 blur-[50px] opacity-20 rounded-full" style={{ backgroundColor: themeColor }}></div>
                  <div className="absolute bottom-4 left-6 flex items-center gap-4 z-10 w-full pr-12">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0" style={{ backgroundColor: `${themeColor}20`, color: themeColor, border: `1px solid ${themeColor}40` }}>
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">{service.title}</h3>
                      <p className="text-[10px] text-zinc-500 font-mono tracking-wider">/{service.slug}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 pt-4 flex-1 flex flex-col">
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-6 flex-1">{service.description}</p>

                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className="bg-white/[0.03] px-3 py-2 rounded-lg border border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold">Order</span>
                      <span className="text-sm font-bold text-white">{service.order}</span>
                    </div>
                    <div className="bg-white/[0.03] px-3 py-2 rounded-lg border border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold">Tools</span>
                      <span className="text-sm font-bold text-white">{service.software.length}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-white/[0.08]">
                    <button onClick={() => handleOpenForm(service)} className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(service._id)} className="w-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =======================
          3. DRAWER FORM (Create / Edit)
      ======================== */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={() => !isSubmitting && setIsFormOpen(false)} />

          <div className="relative w-full md:max-w-2xl bg-[#0c0c0e] h-full shadow-2xl border-l border-white/10 animate-in slide-in-from-right duration-300 flex flex-col">

            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0c0c0e] z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {editingId ? <><Edit2 size={20} className="text-blue-500" /> Edit Service</> : <><Plus size={20} className="text-blue-500" /> New Service</>}
              </h2>
              {!isSubmitting && (
                <button onClick={() => setIsFormOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              <form id="serviceForm" onSubmit={handleSubmit} className="space-y-8">

                {/* --- Section 1: Basic Info --- */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Core Identity</h3>
                    <span className="text-[10px] text-zinc-600"><span className="text-red-400">*</span> Required fields</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-zinc-400">Service Title <span className="text-red-400">*</span></label>
                      <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all" placeholder="e.g. BIM Modeling" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">URL Slug <span className="text-red-400">*</span></label>
                      <input type="text" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-blue-500 focus:outline-none transition-all" placeholder="bim-modeling" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400 flex justify-between">Icon Name <span className="text-red-400">*</span> <a href="https://lucide.dev/icons" target="_blank" className="text-blue-400 hover:underline text-[10px]">Lucide refs</a></label>
                      <input type="text" required value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all" placeholder="e.g. Box, Layers, Zap" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Description <span className="text-red-400">*</span></label>
                    <textarea rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all resize-none" placeholder="What does this service provide..." />
                  </div>
                </div>

                {/* --- Section 2: Visuals & Control --- */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/10 pb-2">Visuals & Control</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-zinc-400">Service Banner Image <span className="text-zinc-600">(Optional)</span></label>
                      <div className="flex flex-col gap-4">
                        {imagePreview && (
                          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group/img">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => { setForm({ ...form, image: '' }); setImagePreview(''); setPendingImageFile(null); }}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelection}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className={`flex flex-col items-center justify-center gap-3 w-full py-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all bg-zinc-900 border-white/5 hover:bg-zinc-800 hover:border-white/20`}
                          >
                            <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                              <LucideIcons.Upload size={20} />
                            </div>
                            <p className="text-sm text-zinc-400"><span className="text-blue-500 font-bold">Click to upload</span> or drag and drop</p>
                            <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">SVG, PNG, JPG (MAX. 5MB)</p>
                          </label>
                          {imageUploadError && <p className="text-xs text-red-400 mt-2">{imageUploadError}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-zinc-400">Brand Color Theme</label>
                      <div className="flex flex-wrap gap-3 bg-zinc-900 p-4 rounded-xl border border-white/10">
                        {COLORS.map((c) => (
                          <button
                            key={c.name} type="button"
                            onClick={() => setForm({ ...form, color: c.name })}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${form.color === c.name ? 'ring-2 ring-white scale-110 shadow-lg' : 'hover:scale-110 opacity-60 hover:opacity-100'}`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          >
                            {form.color === c.name && <CheckCircle2 size={18} className="text-white drop-shadow-md" />}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-2 font-medium uppercase tracking-widest text-center">This color sets the theme for icon background and highlights</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">Display Order <span className="text-zinc-600">(Optional)</span></label>
                      <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">Status</label>
                      <select value={form.active ? 'true' : 'false'} onChange={(e) => setForm({ ...form, active: e.target.value === 'true' })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all cursor-pointer">
                        <option value="true">Live (Visible)</option>
                        <option value="false">Draft (Hidden)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-zinc-400">Outcome/Impact Text</label>
                      <input type="text" value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all" placeholder="e.g. Save Millions in Rework" />
                    </div>
                  </div>
                </div>

                {/* --- Section 3: Arrays & Advanced Data --- */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Advanced Technical Data</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Features/Details */}
                    <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
                      <h3 className="text-sm font-bold text-white mb-4">Key Features</h3>
                      <div className="space-y-3 mb-4">
                        {form.details.map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input type="text" value={item} onChange={(e) => handleArrayChange('details', idx, e.target.value)} className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" placeholder="Add feature..." />
                            <button type="button" onClick={() => removeArrayItem('details', idx)} className="p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg"><X size={16} /></button>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={() => addArrayItem('details')} className="w-full py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"><Plus size={16} /> Add Feature</button>
                    </div>

                    {/* Software */}
                    <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
                      <h3 className="text-sm font-bold text-white mb-4">Software Used</h3>
                      <div className="space-y-3 mb-4">
                        {form.software.map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input type="text" value={item} onChange={(e) => handleArrayChange('software', idx, e.target.value)} className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" placeholder="e.g. Revit" />
                            <button type="button" onClick={() => removeArrayItem('software', idx)} className="p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg"><X size={16} /></button>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={() => addArrayItem('software')} className="w-full py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"><Plus size={16} /> Add Software</button>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
                    <h3 className="text-sm font-bold text-white mb-4">Benefits</h3>
                    <div className="space-y-3 mb-4">
                      {form.benefits.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input type="text" value={item} onChange={(e) => handleArrayChange('benefits', idx, e.target.value)} className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" placeholder="e.g. 100% Clash Discovery" />
                          <button type="button" onClick={() => removeArrayItem('benefits', idx)} className="p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => addArrayItem('benefits')} className="w-full py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"><Plus size={16} /> Add Benefit</button>
                  </div>

                  {/* Key Deliverables */}
                  <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
                    <h3 className="text-sm font-bold text-white mb-4">Key Deliverables</h3>
                    <div className="space-y-3 mb-4">
                      {form.keyDeliverables.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input type="text" value={item} onChange={(e) => handleArrayChange('keyDeliverables', idx, e.target.value)} className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" placeholder="e.g. BIM Model" />
                          <button type="button" onClick={() => removeArrayItem('keyDeliverables', idx)} className="p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => addArrayItem('keyDeliverables')} className="w-full py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"><Plus size={16} /> Add Deliverable</button>
                  </div>

                  {/* Process Steps */}
                  <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
                    <h3 className="text-sm font-bold text-white mb-4">Process / Workflow Steps</h3>
                    <div className="space-y-4 mb-4">
                      {form.process.map((step, idx) => (
                        <div key={idx} className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl space-y-3 relative group">
                          <button type="button" onClick={() => removeComplexItem('process', idx)} className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                          <input type="text" value={step.title} onChange={(e) => handleComplexArrayChange('process', idx, 'title', e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-white focus:border-blue-500 outline-none" placeholder="Step Title" />
                          <textarea value={step.description} onChange={(e) => handleComplexArrayChange('process', idx, 'description', e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:border-blue-500 outline-none resize-none" rows={2} placeholder="Step description..." />
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => addComplexItem('process')} className="w-full py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"><Plus size={16} /> Add Step</button>
                  </div>

                  {/* FAQs */}
                  <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
                    <h3 className="text-sm font-bold text-white mb-4">FAQs</h3>
                    <div className="space-y-4 mb-4">
                      {form.faqs.map((faq, idx) => (
                        <div key={idx} className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl space-y-3 relative group">
                          <button type="button" onClick={() => removeComplexItem('faqs', idx)} className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                          <input type="text" value={faq.question} onChange={(e) => handleComplexArrayChange('faqs', idx, 'question', e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-white focus:border-blue-500 outline-none" placeholder="Question" />
                          <textarea value={faq.answer} onChange={(e) => handleComplexArrayChange('faqs', idx, 'answer', e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:border-blue-500 outline-none resize-none" rows={2} placeholder="Answer" />
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => addComplexItem('faqs')} className="w-full py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"><Plus size={16} /> Add FAQ</button>
                  </div>
                </div>

              </form>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-white/10 bg-[#0c0c0e] sticky bottom-0 z-10 flex gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="serviceForm"
                disabled={isSubmitting || isImageUploading}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex flex-col items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      <span>{isImageUploading ? `Uploading Photo... ${imageUploadProgress}%` : 'Saving Service...'}</span>
                    </div>
                    {isImageUploading && (
                      <div className="w-48 h-1 bg-white/20 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-white transition-all duration-300" style={{ width: `${imageUploadProgress}%` }}></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save size={18} /> Save Service
                  </div>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
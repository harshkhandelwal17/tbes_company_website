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
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
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
      setForm(service);
    } else {
      setEditingId(null);
      setForm({
        slug: '', title: '', icon: 'Box', description: '',
        details: [''], software: [''], image: '',
        color: 'blue', outcome: '', order: services.length + 1, active: true,
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingId ? `/api/services/${editingId}` : '/api/services';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          details: form.details.filter(d => d.trim() !== ''),
          software: form.software.filter(s => s.trim() !== '')
        }),
      });

      if (res.ok) {
        await fetchServices();
        setIsFormOpen(false);
      } else {
        alert('Failed to save service.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArrayChange = (field: 'details' | 'software', index: number, value: string) => {
    const newArray = [...form[field]];
    newArray[index] = value;
    setForm({ ...form, [field]: newArray });
  };

  const addArrayItem = (field: 'details' | 'software') => {
    setForm({ ...form, [field]: [...form[field], ''] });
  };

  const removeArrayItem = (field: 'details' | 'software', index: number) => {
    const newArray = [...form[field]];
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
          {[1,2,3].map(i => <div key={i} className="h-64 bg-zinc-900 rounded-[1.5rem] animate-pulse"></div>)}
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
                <div className={`absolute top-4 right-4 z-10 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${
                   service.active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-zinc-800/80 text-zinc-400 border-zinc-700'
                }`}>
                  {service.active ? 'Live' : 'Draft'}
                </div>

                {/* Card Header with Color Splash */}
                <div className="p-6 pb-0 relative overflow-hidden">
                   <div className="absolute top-[-50px] left-[-50px] w-32 h-32 blur-[50px] opacity-20 rounded-full" style={{ backgroundColor: themeColor }}></div>
                   <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 relative z-10 shadow-lg" style={{ backgroundColor: `${themeColor}20`, color: themeColor }}>
                      <IconComponent size={28} />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-1 relative z-10">{service.title}</h3>
                   <p className="text-xs text-zinc-500 font-mono relative z-10">/{service.slug}</p>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
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
                {editingId ? <><Edit2 size={20} className="text-blue-500"/> Edit Service</> : <><Plus size={20} className="text-blue-500"/> New Service</>}
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
                   <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/10 pb-2">Core Identity</h3>
                   
                   <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 md:col-span-2">
                         <label className="text-xs font-medium text-zinc-400">Service Title *</label>
                         <input type="text" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all" placeholder="e.g. BIM Modeling" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs font-medium text-zinc-400">URL Slug *</label>
                         <input type="text" required value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-blue-500 focus:outline-none transition-all" placeholder="bim-modeling" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs font-medium text-zinc-400 flex justify-between">Icon Name <a href="https://lucide.dev/icons" target="_blank" className="text-blue-400 hover:underline">Lucide refs</a></label>
                         <input type="text" required value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all" placeholder="e.g. Box, Layers, Zap" />
                      </div>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">Description *</label>
                      <textarea rows={3} required value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all resize-none" placeholder="What does this service provide..." />
                   </div>
                </div>

                {/* --- Section 2: Visuals & Control --- */}
                <div className="space-y-4">
                   <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/10 pb-2">Visuals & Control</h3>
                   
                   <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 md:col-span-2">
                         <label className="text-xs font-medium text-zinc-400">Brand Color</label>
                         <div className="flex flex-wrap gap-3 bg-zinc-900 p-4 rounded-xl border border-white/10">
                            {COLORS.map((c) => (
                               <button
                                  key={c.name} type="button"
                                  onClick={() => setForm({ ...form, color: c.name })}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${form.color === c.name ? 'ring-2 ring-white scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                                  style={{ backgroundColor: c.hex }}
                                  title={c.name}
                               >
                                  {form.color === c.name && <CheckCircle2 size={14} className="text-white drop-shadow-md" />}
                               </button>
                            ))}
                         </div>
                      </div>
                      
                      <div className="space-y-1.5">
                         <label className="text-xs font-medium text-zinc-400">Display Order</label>
                         <input type="number" value={form.order} onChange={(e) => setForm({...form, order: Number(e.target.value)})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs font-medium text-zinc-400">Status</label>
                         <select value={form.active ? 'true' : 'false'} onChange={(e) => setForm({...form, active: e.target.value === 'true'})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all cursor-pointer">
                            <option value="true">Live (Visible)</option>
                            <option value="false">Draft (Hidden)</option>
                         </select>
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                         <label className="text-xs font-medium text-zinc-400">Outcome/Impact Text</label>
                         <input type="text" value={form.outcome} onChange={(e) => setForm({...form, outcome: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all" placeholder="e.g. Save Millions in Rework" />
                      </div>
                   </div>
                </div>

                {/* --- Section 3: Arrays --- */}
                <div className="grid md:grid-cols-2 gap-6">
                   {/* Features/Details */}
                   <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
                      <h3 className="text-sm font-bold text-white mb-4">Key Features</h3>
                      <div className="space-y-3 mb-4">
                         {form.details.map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                               <input type="text" value={item} onChange={(e) => handleArrayChange('details', idx, e.target.value)} className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" placeholder="Add feature..." />
                               <button type="button" onClick={() => removeArrayItem('details', idx)} className="p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg"><X size={16}/></button>
                            </div>
                         ))}
                      </div>
                      <button type="button" onClick={() => addArrayItem('details')} className="w-full py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"><Plus size={16}/> Add Feature</button>
                   </div>

                   {/* Software */}
                   <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
                      <h3 className="text-sm font-bold text-white mb-4">Software Used</h3>
                      <div className="space-y-3 mb-4">
                         {form.software.map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                               <input type="text" value={item} onChange={(e) => handleArrayChange('software', idx, e.target.value)} className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" placeholder="e.g. Revit" />
                               <button type="button" onClick={() => removeArrayItem('software', idx)} className="p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg"><X size={16}/></button>
                            </div>
                         ))}
                      </div>
                      <button type="button" onClick={() => addArrayItem('software')} className="w-full py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"><Plus size={16}/> Add Software</button>
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
                disabled={isSubmitting}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Service</>}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
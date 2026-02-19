'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  Search, FileText, Calendar, Mail, Phone, 
  Briefcase, Download, Trash2, X, User, 
  ChevronRight, ExternalLink, Filter 
} from 'lucide-react';

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string;
  jobId: {
    _id: string;
    title: string;
  } | null; // Handle if job is deleted
  createdAt: string;
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  // Drawer State
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (Array.isArray(data)) {
        setApplications(data);
      }
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this application?')) return;
    try {
      // Assuming you have a delete endpoint logic in your API
      const res = await fetch(`/api/applications?id=${id}`, { method: 'DELETE' }); 
      if (res.ok) {
        setApplications(prev => prev.filter(a => a._id !== id));
        if (selectedApp?._id === id) closeDrawer();
      }
    } catch (error) {
      console.error('Error deleting application', error);
    }
  };

  const openDrawer = (app: Application) => {
    setSelectedApp(app);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedApp(null), 300);
  };

  // --- Filtering Logic ---
  const uniqueRoles = useMemo(() => {
    const roles = new Set(applications.map(app => app.jobId?.title || 'Unknown Role'));
    return ['All', ...Array.from(roles)];
  }, [applications]);

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'All' || (app.jobId?.title || 'Unknown Role') === roleFilter;

    return matchesSearch && matchesRole;
  });

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen w-full  text-white overflow-x-hidden pb-20">
      
      {/* =======================
          1. HEADER & STATS
      ======================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Talent Pool</h1>
          <p className="text-zinc-400 text-sm mt-1">Review and manage job applications.</p>
        </div>
        
        {/* Quick Stat */}
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-900/20 border border-blue-500/20 rounded-xl">
           <div className="p-2 bg-blue-500 rounded-lg text-white">
              <FileText size={18} />
           </div>
           <div>
              <p className="text-xs text-blue-300 font-bold uppercase">Total Applications</p>
              <p className="text-lg font-bold text-white leading-none">{applications.length}</p>
           </div>
        </div>
      </div>

      {/* =======================
          2. FILTERS
      ======================== */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative group flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search candidate name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-[#09090b] border border-white/[0.08] rounded-xl pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Role Filter Dropdown */}
        <div className="relative min-w-[200px]">
           <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
           <select 
             value={roleFilter}
             onChange={(e) => setRoleFilter(e.target.value)}
             className="w-full h-12 bg-[#09090b] border border-white/[0.08] rounded-xl pl-12 pr-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500/50"
           >
             {uniqueRoles.map(role => (
               <option key={role} value={role} className="bg-[#09090b]">{role}</option>
             ))}
           </select>
           <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 rotate-90 pointer-events-none" />
        </div>
      </div>

      {/* =======================
          3. APPLICATIONS GRID
      ======================== */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-zinc-900 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
             <User size={32} className="text-zinc-600" />
          </div>
          <p className="text-zinc-500">No applications found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map(app => (
            <div 
              key={app._id} 
              onClick={() => openDrawer(app)}
              className="group bg-[#09090b] border border-white/[0.08] rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl relative overflow-hidden"
            >
              {/* Top Row: Date & Role */}
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                       {app.jobId?.title || 'Unknown Role'}
                    </span>
                 </div>
                 <span className="text-xs text-zinc-500">{formatDate(app.createdAt)}</span>
              </div>

              {/* Candidate Info */}
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-lg border border-white/5 group-hover:border-blue-500/50 transition-colors">
                    {app.fullName.charAt(0)}
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate max-w-[180px]">
                       {app.fullName}
                    </h3>
                    <p className="text-xs text-zinc-500 truncate max-w-[180px]">{app.email}</p>
                 </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                 <span className="text-xs text-zinc-400 flex items-center gap-1 group-hover:text-white transition-colors">
                    Review Application <ChevronRight size={12} />
                 </span>
                 {app.resumeUrl && <FileText size={16} className="text-zinc-600 group-hover:text-blue-400 transition-colors" />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =======================
          4. DETAIL DRAWER
      ======================== */}
      {isDrawerOpen && selectedApp && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" 
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <div className="relative w-full md:max-w-lg bg-[#0c0c0e] h-full shadow-2xl border-l border-white/10 animate-in slide-in-from-right duration-300 flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-[#0c0c0e] z-10">
              <div>
                 <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Applicant Profile</p>
                 <h2 className="text-xl font-bold text-white leading-tight">{selectedApp.fullName}</h2>
                 <p className="text-sm text-zinc-500 mt-1 flex items-center gap-2">
                    Applied for <span className="text-zinc-300">{selectedApp.jobId?.title || 'Unknown Role'}</span>
                 </p>
              </div>
              <button onClick={closeDrawer} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
               
               {/* Contact Info */}
               <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                     <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400"><Mail size={16}/></div>
                     <div className="overflow-hidden">
                        <p className="text-xs text-zinc-500 uppercase font-bold">Email</p>
                        <a href={`mailto:${selectedApp.email}`} className="text-sm text-blue-400 hover:underline truncate block">{selectedApp.email}</a>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                     <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400"><Phone size={16}/></div>
                     <div>
                        <p className="text-xs text-zinc-500 uppercase font-bold">Phone</p>
                        <a href={`tel:${selectedApp.phone}`} className="text-sm text-zinc-200 hover:text-white">{selectedApp.phone}</a>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                     <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400"><Calendar size={16}/></div>
                     <div>
                        <p className="text-xs text-zinc-500 uppercase font-bold">Applied On</p>
                        <p className="text-sm text-zinc-200">{formatDate(selectedApp.createdAt)}</p>
                     </div>
                  </div>
               </div>

               {/* Resume Section */}
               <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Resume / CV</h3>
                  <a 
                     href={selectedApp.resumeUrl} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center justify-between p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 hover:border-blue-500/40 transition-all group"
                  >
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-lg text-white">
                           <FileText size={20} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-blue-100">Applicant_Resume.pdf</p>
                           <p className="text-xs text-blue-300">Click to view document</p>
                        </div>
                     </div>
                     <ExternalLink size={18} className="text-blue-400 group-hover:text-white transition-colors" />
                  </a>
               </div>

               {/* Cover Letter */}
               {selectedApp.coverLetter && (
                  <div>
                     <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Cover Letter</h3>
                     <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-zinc-300 text-sm leading-7 whitespace-pre-wrap">
                        {selectedApp.coverLetter}
                     </div>
                  </div>
               )}

            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/10 bg-[#0c0c0e] sticky bottom-0 z-10 flex gap-3">
               <a 
                  href={`mailto:${selectedApp.email}`} 
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
               >
                  <Mail size={16} /> Contact Candidate
               </a>
               <button 
                  onClick={() => handleDelete(selectedApp._id)} 
                  className="px-4 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors active:scale-[0.98]"
                  title="Reject Application"
               >
                  <Trash2 size={18} />
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
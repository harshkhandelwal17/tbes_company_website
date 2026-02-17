'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Project, FilterOptions, FILTER_OPTIONS } from '@/types';
import ProjectCard from '../../components/ProjectCard';
import { 
  Search, Filter, X, MapPin, Layers, Briefcase, 
  LayoutGrid, ChevronDown, Check, Building2, SlidersHorizontal 
} from 'lucide-react';

export default function ProjectsPage() {
  // --- State ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Custom Dropdown State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mobile Drawer State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    location: 'All',
    lod: 'All',
    sow: 'All',
    projectType: 'All',
    area: 'All'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // --- Click Outside to Close Dropdown ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        if (Array.isArray(data)) setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // --- Filtering Logic ---
  useEffect(() => {
    let result = [...projects];

    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(lowerQ) || 
        p.location.toLowerCase().includes(lowerQ)
      );
    }

    if (filters.location !== 'All') result = result.filter(p => p.location === filters.location);
    if (filters.lod !== 'All') result = result.filter(p => String(p.lod) === filters.lod);
    if (filters.sow !== 'All') result = result.filter(p => p.sow === filters.sow);
    if (filters.projectType !== 'All') result = result.filter(p => p.projectType === filters.projectType);
    if (filters.area !== 'All') {
      const [min, max] = filters.area.includes('-') 
        ? filters.area.split('-').map(Number) 
        : filters.area === '100000+' ? [100000, Infinity] : [0, Infinity];
      result = result.filter(p => p.area >= min && p.area < max);
    }

    setFilteredProjects(result);
  }, [projects, filters, searchQuery]);

  // --- Stats ---
  const stats = useMemo(() => ({
    total: projects.length,
    displayed: filteredProjects.length,
    area: projects.reduce((acc, curr) => acc + (curr.area || 0), 0)
  }), [projects, filteredProjects]);

  // --- Handlers ---
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setActiveDropdown(null); // Close dropdown on selection
  };

  const clearAllFilters = () => {
    setFilters({ location: 'All', lod: 'All', sow: 'All', projectType: 'All', area: 'All' });
    setSearchQuery('');
  };

  // Helper for Dropdown Label
  const getLabel = (key: string) => {
    switch(key) {
      case 'projectType': return 'Project Type';
      case 'sow': return 'Scope';
      case 'lod': return 'LOD Level';
      default: return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  // Helper for Icon
  const getIcon = (key: string) => {
    switch(key) {
      case 'location': return <MapPin size={14} />;
      case 'projectType': return <Building2 size={14} />;
      case 'lod': return <Layers size={14} />;
      case 'sow': return <Briefcase size={14} />;
      case 'area': return <LayoutGrid size={14} />;
      default: return <Filter size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white font-sans selection:bg-blue-500/30">
      
      {/* =========================================
          1. HERO SECTION (Clean & Modern)
      ========================================= */}
      <section className="relative pb-12 pt-2 lg:pb-16 bg-[#05080F] border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.05]"></div>
        
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                Global Engineering Portfolio
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Work.</span>
              </h1>
              <p className="text-slate-400 mt-2 text-lg font-light max-w-xl">
                Discover how we bring complex engineering visions to life through precision BIM modeling.
              </p>
            </div>
            
            {/* Live Stats */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Projects</p>
              </div>
              <div className="h-10 w-px bg-white/10"></div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{(stats.area / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Sq.Ft Modeled</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. STICKY FILTER BAR (The "Control Center")
      ========================================= */}
      <div className="sticky top-14 z-40 bg-[#020408]/80 backdrop-blur-xl border-y border-white/5 shadow-2xl">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-blue-500/50 focus:outline-none transition-all"
              />
            </div>

            {/* Desktop Filters (Custom Dropdowns) */}
            <div className="hidden lg:flex items-center gap-2" ref={dropdownRef}>
              {(['projectType', 'location', 'lod', 'sow', 'area'] as const).map((key) => (
                <div key={key} className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
                    className={`h-11 px-4 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                      filters[key] !== 'All' 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {getIcon(key)}
                    {getLabel(key)}
                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === key ? 'rotate-180' : ''}`} />
                  </button>

                  {/* CUSTOM DROPDOWN MENU */}
                  {activeDropdown === key && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-[#0B0F19] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="max-h-64 overflow-y-auto custom-scrollbar p-1">
                        <button
                          onClick={() => handleFilterChange(key, 'All')}
                          className="w-full text-left px-4 py-3 text-sm flex items-center justify-between rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                        >
                          All Categories
                          {filters[key] === 'All' && <Check size={14} className="text-blue-500" />}
                        </button>
                        
                        {FILTER_OPTIONS[`${key}s` as keyof typeof FILTER_OPTIONS]?.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleFilterChange(key, option)}
                            className="w-full text-left px-4 py-3 text-sm flex items-center justify-between rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                          >
                            {option}
                            {filters[key] === option && <Check size={14} className="text-blue-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Clear Button */}
              {(Object.values(filters).some(v => v !== 'All') || searchQuery) && (
                <button 
                  onClick={clearAllFilters}
                  className="h-11 w-11 flex items-center justify-center bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all ml-2"
                  title="Reset Filters"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden w-full h-11 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold rounded-xl active:scale-95 transition-transform"
            >
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>

          {/* Active Filter Tags (Chips) */}
          {(Object.values(filters).some(v => v !== 'All') || searchQuery) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t border-white/5">
              <span className="text-xs text-slate-500 py-1">Active:</span>
              {Object.entries(filters).map(([key, value]) => {
                if (value === 'All') return null;
                return (
                  <button 
                    key={key}
                    onClick={() => handleFilterChange(key as keyof FilterOptions, 'All')}
                    className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all group"
                  >
                    {key}: <span className="text-white">{value}</span>
                    <X size={12} className="group-hover:scale-110" />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          3. PROJECTS GRID
      ========================================= */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {loading ? (
          /* SKELETON LOADING */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[#0B0F19] border border-white/5 rounded-[1.5rem] p-4 h-[380px] animate-pulse">
                <div className="w-full h-48 bg-white/5 rounded-xl mb-4"></div>
                <div className="h-5 w-3/4 bg-white/5 rounded-full mb-3"></div>
                <div className="h-4 w-1/2 bg-white/5 rounded-full mb-6"></div>
                <div className="flex gap-2 mt-auto">
                   <div className="h-8 w-16 bg-white/5 rounded-lg"></div>
                   <div className="h-8 w-16 bg-white/5 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          /* GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-32 bg-white/[0.02] border border-white/5 border-dashed rounded-[2rem]">
            <div className="w-24 h-24 bg-[#0B0F19] border border-white/10 rounded-full flex items-center justify-center text-slate-600 mb-6">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-slate-400 mb-8 max-w-md text-center">
              We couldn't find any projects matching your criteria. Try adjusting your filters.
            </p>
            <button 
              onClick={clearAllFilters}
              className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {/* =========================================
          4. MOBILE FILTER DRAWER (Fixed Overlay)
      ========================================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="bg-[#0B0F19] w-full max-w-lg rounded-t-[2rem] border-t border-white/10 shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-20 duration-300">
            
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="text-blue-500" /> Filter Projects
              </h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               {(['projectType', 'location', 'lod', 'sow', 'area'] as const).map((key) => (
                 <div key={key} className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{getLabel(key)}</label>
                    <div className="grid grid-cols-2 gap-2">
                       <button
                         onClick={() => handleFilterChange(key, 'All')}
                         className={`px-3 py-3 text-xs font-bold rounded-lg border transition-all ${
                            filters[key] === 'All' 
                            ? 'bg-blue-600 border-blue-600 text-white' 
                            : 'bg-white/5 border-white/10 text-slate-400'
                         }`}
                       >
                         All
                       </button>
                       {FILTER_OPTIONS[`${key}s` as keyof typeof FILTER_OPTIONS]?.map(opt => (
                         <button
                           key={opt}
                           onClick={() => handleFilterChange(key, opt)}
                           className={`px-3 py-3 text-xs font-bold rounded-lg border transition-all truncate ${
                              filters[key] === opt
                              ? 'bg-blue-600 border-blue-600 text-white' 
                              : 'bg-white/5 border-white/10 text-slate-400'
                           }`}
                         >
                           {opt}
                         </button>
                       ))}
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-6 border-t border-white/5 bg-[#05080F] flex gap-4">
              <button 
                onClick={clearAllFilters}
                className="flex-1 py-4 bg-white/5 text-slate-300 font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-colors"
              >
                View Results
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
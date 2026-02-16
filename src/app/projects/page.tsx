'use client';

import { useState, useEffect } from 'react';
import { Project, FilterOptions, FILTER_OPTIONS } from '@/types';
import ProjectCard from '../../components/ProjectCard';
import FilterDropdown from '../../components/FilterDropdown';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    location: 'All',
    lod: 'All',
    sow: 'All',
    projectType: 'All',
    area: 'All'
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, filters]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = projects;

    if (filters.location !== 'All') {
      filtered = filtered.filter(p => p.location === filters.location);
    }
    if (filters.lod !== 'All') {
      filtered = filtered.filter(p => p.lod.toString() === filters.lod);
    }
    if (filters.sow !== 'All') {
      filtered = filtered.filter(p => p.sow === filters.sow);
    }
    if (filters.projectType !== 'All') {
      filtered = filtered.filter(p => p.projectType === filters.projectType);
    }
    if (filters.area !== 'All') {
      const [min, max] = filters.area.includes('-') 
        ? filters.area.split('-').map(Number)
        : filters.area === '30000+' 
          ? [30000, Infinity]
          : [0, Infinity];
      filtered = filtered.filter(p => p.area >= min && (max === Infinity || p.area < max));
    }

    setFilteredProjects(filtered);
  };

  const handleFilterChange = (filterType: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const closeThreeDViewer = () => {
    setSelectedProject(null);
  };

  const clearAllFilters = () => {
    setFilters({
      location: 'All',
      lod: 'All',
      sow: 'All',
      projectType: 'All',
      area: 'All'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-white"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-800 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-white font-medium">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="relative bg-black shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white tracking-wide">PROJECTS</h1>
            <div className="mt-4 w-24 h-1 bg-white mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto">
              Explore our comprehensive collection of Projects
            </p>
          </div>
        </div>
      </header>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
          <div className="bg-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                Filter Projects
              </h2>
              <button
                onClick={clearAllFilters}
                className="text-white hover:text-black hover:bg-white border border-white text-sm font-medium px-3 py-1 rounded-full transition-colors duration-200"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {(['location', 'lod', 'sow', 'projectType', 'area'] as (keyof FilterOptions)[]).map(key => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-semibold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <FilterDropdown
                    label=""
                    options={FILTER_OPTIONS[key + 's' as keyof typeof FILTER_OPTIONS] || []}
                    value={filters[key]}
                    onChange={(value) => handleFilterChange(key, value)}
                  />
                </div>
              ))}
            </div>

            {/* Active Filters */}
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (value !== 'All') {
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-black border border-white"
                      >
                        {key}: {value}
                        <button
                          onClick={() => handleFilterChange(key as keyof FilterOptions, 'All')}
                          className="ml-2 text-black hover:text-gray-700"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Project List */}
        <div className="mt-8 space-y-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="transform hover:scale-[1.02] transition-all duration-300">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="mt-12 text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="w-24 h-24 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-white mb-2">No Projects Found</h3>
              <p className="text-gray-400 mb-6">
                We couldn't find any projects matching your current filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

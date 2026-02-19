'use client'

import { useState, useEffect } from 'react'
import { 
  Briefcase, MapPin, Clock, DollarSign, 
  Plus, Search, Edit2, Trash2, Save, 
  X, ChevronLeft, CheckCircle, AlertCircle 
} from 'lucide-react'

interface Job {
  _id: string
  title: string
  department?: string
  location: string
  type: string
  experience?: string
  description: string
  requirements?: string[]
  responsibilities?: string[]
  salary?: string
  createdAt: string
  status?: string
}

export default function AdminCareerPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  
  // UI States
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Omit<Job, '_id' | 'createdAt'>>({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    experience: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    salary: '',
    status: 'active'
  })

  // --- Load Jobs ---
  useEffect(() => {
    loadJobs()
  }, [])

  // --- Search Logic ---
  useEffect(() => {
    if (!searchQuery) {
      setFilteredJobs(jobs)
    } else {
      const lowerQ = searchQuery.toLowerCase()
      setFilteredJobs(jobs.filter(j => 
        j.title.toLowerCase().includes(lowerQ) || 
        j.location.toLowerCase().includes(lowerQ)
      ))
    }
  }, [searchQuery, jobs])

  const loadJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
        setFilteredJobs(data)
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  // --- Form Handlers ---
  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: 'requirements' | 'responsibilities', index: number, value: string) => {
    const newArray = [...(formData[field] || [])]
    newArray[index] = value
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field: 'requirements' | 'responsibilities') => {
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), ''] }))
  }

  const removeArrayItem = (field: 'requirements' | 'responsibilities', index: number) => {
    const newArray = (formData[field] || []).filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const filteredData = {
      ...formData,
      requirements: (formData.requirements || []).filter(req => req.trim() !== ''),
      responsibilities: (formData.responsibilities || []).filter(resp => resp.trim() !== '')
    }

    try {
      const url = editingId ? `/api/jobs?id=${editingId}` : '/api/jobs'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filteredData)
      })

      if (response.ok) {
        await loadJobs()
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save job:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (_id: string) => {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/jobs?id=${_id}`, { method: 'DELETE' })
        if (response.ok) {
          loadJobs()
        }
      } catch (error) {
        console.error('Failed to delete job:', error)
      }
    }
  }

  const startEdit = (job: Job) => {
    setEditingId(job._id)
    setFormData({
      title: job.title,
      department: job.department || '',
      location: job.location,
      type: job.type,
      experience: job.experience || '',
      description: job.description,
      requirements: job.requirements || [''],
      responsibilities: job.responsibilities || [''],
      salary: job.salary || '',
      status: job.status || 'active'
    })
    setView('form')
  }

  const resetForm = () => {
    setView('list')
    setEditingId(null)
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      experience: '',
      description: '',
      requirements: [''],
      responsibilities: [''],
      salary: '',
      status: 'active'
    })
  }

  return (
    <div className="space-y-8">
      
      {/* =======================
          VIEW: LIST (Dashboard)
      ======================== */}
      {view === 'list' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Header & Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Career Management</h1>
              <p className="text-zinc-400 text-sm mt-1">Manage job openings and requirements.</p>
            </div>
            
            <button
              onClick={() => { resetForm(); setView('form'); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95"
            >
              <Plus size={18} /> Post New Job
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search jobs by title or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-[#09090b] border border-white/[0.08] rounded-xl pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Jobs Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-48 bg-zinc-900 rounded-2xl animate-pulse"></div>)}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-zinc-600">
                <Briefcase size={24} />
              </div>
              <p className="text-zinc-500">No jobs found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredJobs.map(job => (
                <div key={job._id} className="group bg-[#09090b] border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] transition-all relative overflow-hidden">
                  
                  {/* Status Indicator */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent -mr-10 -mt-10 rounded-bl-full transition-colors ${job.status === 'active' ? 'from-green-500/10' : 'from-red-500/10'}`}></div>

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                      <p className="text-sm text-zinc-500 mt-1 flex items-center gap-2">
                        <Briefcase size={12} /> {job.department || 'General'}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      job.status === 'active' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {job.status || 'Active'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6 relative z-10">
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
                      <MapPin size={12} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
                      <Clock size={12} /> {job.type}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
                        <DollarSign size={12} /> {job.salary}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] relative z-10">
                    <span className="text-xs text-zinc-600">Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => startEdit(job)}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Edit Job"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteJob(job._id)}
                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =======================
          VIEW: FORM (Add/Edit)
      ======================== */}
      {view === 'form' && (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8 duration-300">
          
          {/* Form Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={resetForm}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Job' : 'Create New Job'}</h2>
                <p className="text-sm text-zinc-500">Fill in the details below to post a position.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Basic Info */}
            <div className="bg-[#09090b] border border-white/[0.08] p-6 md:p-8 rounded-2xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/[0.08] pb-4">Job Details</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase">Job Title</label>
                  <input type="text" required value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-800 transition-all placeholder:text-zinc-600"
                    placeholder="e.g. Senior BIM Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase">Department</label>
                  <input type="text" value={formData.department} onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-800 transition-all placeholder:text-zinc-600"
                    placeholder="e.g. Engineering"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase">Location</label>
                  <input type="text" required value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-800 transition-all placeholder:text-zinc-600"
                    placeholder="e.g. Remote / New York"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase">Employment Type</label>
                  <select value={formData.type} onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-800 transition-all cursor-pointer"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase">Experience</label>
                  <input type="text" value={formData.experience} onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-800 transition-all placeholder:text-zinc-600"
                    placeholder="e.g. 3-5 Years"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase">Salary (Optional)</label>
                  <input type="text" value={formData.salary} onChange={(e) => handleInputChange('salary', e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-800 transition-all placeholder:text-zinc-600"
                    placeholder="e.g. $80k - $100k"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase">Status</label>
                  <select value={formData.status} onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-800 transition-all cursor-pointer"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase">Description</label>
                <textarea rows={5} required value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-800 transition-all placeholder:text-zinc-600 resize-y"
                  placeholder="Detailed job description..."
                />
              </div>
            </div>

            {/* Section 2: Requirements & Responsibilities */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Requirements */}
              <div className="bg-[#09090b] border border-white/[0.08] p-6 rounded-2xl flex flex-col h-full">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex justify-between items-center">
                  Requirements
                  <span className="text-xs bg-white/10 px-2 py-1 rounded text-zinc-400">{formData.requirements?.length || 0} Items</span>
                </h3>
                <div className="space-y-3 flex-1">
                  {formData.requirements?.map((req, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" value={req} onChange={(e) => handleArrayChange('requirements', i, e.target.value)}
                        className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        placeholder="Add requirement..."
                      />
                      <button type="button" onClick={() => removeArrayItem('requirements', i)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => addArrayItem('requirements')} className="mt-4 w-full py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Requirement
                </button>
              </div>

              {/* Responsibilities */}
              <div className="bg-[#09090b] border border-white/[0.08] p-6 rounded-2xl flex flex-col h-full">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex justify-between items-center">
                  Responsibilities
                  <span className="text-xs bg-white/10 px-2 py-1 rounded text-zinc-400">{formData.responsibilities?.length || 0} Items</span>
                </h3>
                <div className="space-y-3 flex-1">
                  {formData.responsibilities?.map((resp, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" value={resp} onChange={(e) => handleArrayChange('responsibilities', i, e.target.value)}
                        className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        placeholder="Add responsibility..."
                      />
                      <button type="button" onClick={() => removeArrayItem('responsibilities', i)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => addArrayItem('responsibilities')} className="mt-4 w-full py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Responsibility
                </button>
              </div>

            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-white/[0.08]">
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} /> {loading ? 'Saving...' : 'Save Job'}
              </button>
              <button 
                type="button" 
                onClick={resetForm}
                className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors active:scale-95"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  )
}
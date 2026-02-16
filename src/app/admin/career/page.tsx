'use client'

import { useState, useEffect } from 'react'

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string // Full-time, Part-time, Contract
  experience: string
  description: string
  requirements: string[]
  responsibilities: string[]
  salary: string
  posted: string
  status: 'active' | 'inactive'
}

export default function AdminPanel() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isAddingJob, setIsAddingJob] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [formData, setFormData] = useState<Omit<Job, 'id' | 'posted'>>({
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

  // Load jobs on component mount
  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const response = await fetch('/api/admin/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: 'requirements' | 'responsibilities', index: number, value: string) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field: 'requirements' | 'responsibilities') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const removeArrayItem = (field: 'requirements' | 'responsibilities', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const filteredData = {
      ...formData,
      requirements: formData.requirements.filter(req => req.trim() !== ''),
      responsibilities: formData.responsibilities.filter(resp => resp.trim() !== '')
    }

    try {
      const url = editingJob ? `/api/admin/jobs/${editingJob.id}` : '/api/admin/jobs'
      const method = editingJob ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filteredData)
      })

      if (response.ok) {
        loadJobs()
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save job:', error)
    }
  }

  const deleteJob = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' })
        if (response.ok) {
          loadJobs()
        }
      } catch (error) {
        console.error('Failed to delete job:', error)
      }
    }
  }

  const startEdit = (job: Job) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      salary: job.salary,
      status: job.status
    })
    setIsAddingJob(true)
  }

  const resetForm = () => {
    setIsAddingJob(false)
    setEditingJob(null)
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Job Management Admin Panel</h1>
            <button
              onClick={() => setIsAddingJob(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Job
            </button>
          </div>

          {/* Job Form Modal/Section */}
          {isAddingJob && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                {editingJob ? 'Edit Job' : 'Add New Job'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Required</label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="e.g., 2-4 years"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Salary Range</label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => handleInputChange('salary', e.target.value)}
                      placeholder="e.g., ₹5-8 LPA"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Job Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium mb-2">Requirements</label>
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter requirement"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('requirements', index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Add Requirement
                  </button>
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="block text-sm font-medium mb-2">Responsibilities</label>
                  {formData.responsibilities.map((resp, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter responsibility"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('responsibilities', index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('responsibilities')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Add Responsibility
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'inactive')}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingJob ? 'Update Job' : 'Create Job'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Jobs List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Current Job Openings</h2>
            {jobs.length === 0 ? (
              <p className="text-gray-500">No jobs posted yet.</p>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="border rounded-lg p-4 bg-white shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="mr-4">📍 {job.location}</span>
                        <span className="mr-4">🏢 {job.department}</span>
                        <span className="mr-4">⏰ {job.type}</span>
                        <span className="mr-4">💼 {job.experience}</span>
                        {job.salary && <span className="mr-4">💰 {job.salary}</span>}
                      </div>
                      <p className="text-gray-700 mt-2">{job.description.substring(0, 200)}...</p>
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {job.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">Posted: {job.posted}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(job)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  description: string
  requirements: string[]
  responsibilities: string[]
  salary: string
  posted: string
  status: 'active' | 'inactive'
}

interface JobApplicationFormProps {
  job: Job
  isOpen: boolean
  onClose: () => void
}

export default function JobApplicationForm({ job, isOpen, onClose }: JobApplicationFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    currentPosition: '',
    currentCompany: '',
    experience: '',
    expectedSalary: '',
    noticePeriod: '',
    coverLetter: '',
    linkedin: '',
    portfolio: '',
    howDidYouHear: ''
  })
  const [resume, setResume] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!allowedTypes.includes(file.type)) {
        setStatus('Please upload only PDF, DOC, or DOCX files.')
        return
      }

      if (file.size > maxSize) {
        setStatus('File size must be less than 5MB.')
        return
      }

      setResume(file)
      setStatus('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('Submitting application...')

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value)
      })
      
      // Add job details
      submitData.append('jobId', job.id)
      submitData.append('jobTitle', job.title)
      submitData.append('department', job.department)
      
      // Add resume file
      if (resume) {
        submitData.append('resume', resume)
      }

      const response = await fetch('/api/job-application', {
        method: 'POST',
        body: submitData,
      })

      if (response.ok) {
        setStatus('Application submitted successfully! We will contact you soon.')
        setTimeout(() => {
          onClose()
          resetForm()
        }, 2000)
      } else {
        const errorData = await response.json()
        setStatus(errorData.message || 'Failed to submit application. Please try again.')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setStatus('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      currentPosition: '',
      currentCompany: '',
      experience: '',
      expectedSalary: '',
      noticePeriod: '',
      coverLetter: '',
      linkedin: '',
      portfolio: '',
      howDidYouHear: ''
    })
    setResume(null)
    setStatus('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">Apply for Position</h2>
              <div className="text-lg text-gray-700">
                <span className="font-semibold">{job.title}</span> • {job.department} • {job.location}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-black mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-black mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-black mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Current Position</label>
                  <input
                    type="text"
                    name="currentPosition"
                    value={formData.currentPosition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Current Company</label>
                  <input
                    type="text"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Total Experience *</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 years"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Expected Salary</label>
                  <input
                    type="text"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                    placeholder="e.g., ₹8 LPA"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Notice Period</label>
                  <select
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                  >
                    <option value="">Select notice period</option>
                    <option value="Immediate">Immediate</option>
                    <option value="15 days">15 days</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                    <option value="More than 3 months">More than 3 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">How did you hear about us?</label>
                  <select
                    name="howDidYouHear"
                    value={formData.howDidYouHear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                  >
                    <option value="">Select an option</option>
                    <option value="Company Website">Company Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Job Portal">Job Portal</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-black mb-4">Professional Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Portfolio/Website</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-black mb-4">Resume *</h3>
              <div className="border-dashed border-2 border-gray-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="resume-upload"
                  required
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center text-white text-xl">
                    📄
                  </div>
                  <div>
                    <span className="text-black font-medium">Click to upload your resume</span>
                    <p className="text-sm text-gray-600 mt-1">PDF, DOC, DOCX up to 5MB</p>
                  </div>
                </label>
                {resume && (
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <p className="text-green-800 font-medium">✓ {resume.name}</p>
                    <p className="text-green-600 text-sm">{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-black mb-4">Cover Letter</h3>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={6}
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 transition-all duration-200 resize-vertical"
              />
            </div>

            {/* Status Message */}
            {status && (
              <div className={`p-4 rounded-xl text-center font-medium ${
                status.includes('successfully') ? 'bg-green-100 text-green-800' : 
                status.includes('error') || status.includes('Failed') ? 'bg-red-100 text-red-800' : 
                'bg-blue-100 text-blue-800'
              }`}>
                {status}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-gray-800 to-black text-white font-semibold py-4 px-6 rounded-xl hover:from-gray-900 hover:to-gray-800 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200 focus:ring-4 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:text-black transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
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

interface JobCardProps {
  job: Job
  onApply: (job: Job) => void
}

export default function JobCard({ job, onApply }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time':
        return 'bg-green-100 text-green-800'
      case 'part-time':
        return 'bg-blue-100 text-blue-800'
      case 'contract':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white border-opacity-20 transform hover:-translate-y-2 transition-all duration-300">
      {/* Job Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-black mb-2">{job.title}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
              {job.type}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {job.department}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            Posted: {formatDate(job.posted)}
          </div>
          {job.salary && (
            <div className="text-lg font-semibold text-green-600 mt-1">
              {job.salary}
            </div>
          )}
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center text-white text-xs">📍</span>
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center text-white text-xs">💼</span>
            <span>{job.experience}</span>
          </div>
        </div>

        <div className="text-gray-700 leading-relaxed">
          <p className={`${!isExpanded ? 'line-clamp-3' : ''}`}>
            {job.description}
          </p>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            {/* Requirements */}
            {job.requirements.length > 0 && (
              <div>
                <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center text-white text-xs">✓</span>
                  Requirements
                </h4>
                <ul className="space-y-1 ml-8">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities.length > 0 && (
              <div>
                <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center text-white text-xs">📋</span>
                  Responsibilities
                </h4>
                <ul className="space-y-1 ml-8">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-black transition-colors duration-200 text-sm font-medium"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={() => onApply(job)}
            className="bg-gradient-to-r from-gray-800 to-black text-white font-semibold py-3 px-8 rounded-xl hover:from-gray-900 hover:to-gray-800 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200 focus:ring-4 focus:ring-gray-300"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Job Card Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Job ID: {job.id}</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Active
          </span>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
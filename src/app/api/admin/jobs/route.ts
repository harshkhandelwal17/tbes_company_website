import { NextRequest, NextResponse } from 'next/server'

// Mock database - Replace with your actual database
let jobs = [
  {
    id: '1',
    title: 'Senior BIM Modeler',
    department: 'BIM Engineering',
    location: 'Durgapur, West Bengal',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'We are looking for an experienced BIM Modeler to join our team and work on cutting-edge construction projects.',
    requirements: [
      'Bachelor\'s degree in Civil Engineering, Architecture, or related field',
      '3+ years of experience in BIM modeling',
      'Proficiency in Revit, AutoCAD, and Navisworks',
      'Strong understanding of construction processes'
    ],
    responsibilities: [
      'Create detailed 3D BIM models for construction projects',
      'Collaborate with architects and engineers',
      'Ensure model accuracy and compliance with standards',
      'Participate in design coordination meetings'
    ],
    salary: '₹6-9 LPA',
    posted: new Date().toISOString(),
    status: 'active' as const
  }
]

export async function GET() {
  try {
    return NextResponse.json(jobs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const newJob = {
      id: Date.now().toString(),
      ...data,
      posted: new Date().toISOString()
    }
    
    jobs.push(newJob)
    
    return NextResponse.json(newJob, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}
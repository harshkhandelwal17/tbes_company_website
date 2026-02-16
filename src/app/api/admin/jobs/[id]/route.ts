// 2. /api/admin/jobs/[id]/route.ts - Individual job management
import { NextRequest, NextResponse } from 'next/server'
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await request.json()
    
    const jobIndex = jobs.findIndex(job => job.id === id)
    if (jobIndex === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }
    
    jobs[jobIndex] = { ...jobs[jobIndex], ...data }
    
    return NextResponse.json(jobs[jobIndex])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    const jobIndex = jobs.findIndex(job => job.id === id)
    if (jobIndex === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }
    
    jobs.splice(jobIndex, 1)
    
    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
  }
}
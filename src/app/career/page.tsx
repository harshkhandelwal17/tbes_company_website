'use client';

import { useState, useEffect } from 'react';
import {
  MapPin, Clock, Briefcase, Users, Award, Target,
  ArrowRight, Sparkles, Building2, Search, Zap,
  ChevronRight, IndianRupee, Send, X, FileText, CheckCircle2, UploadCloud,
  BookOpen, Image as ImageIcon, Paperclip, Trash2
} from 'lucide-react';

// Helper: format experience string
function formatExperience(exp?: string): string {
  if (!exp) return 'Not specified';
  // If already contains 'year' (case-insensitive), return as-is
  if (/year/i.test(exp)) return exp;
  // If purely numeric, append " Years"
  if (/^\d+$/.test(exp.trim())) return `${exp.trim()} Years`;
  // e.g. "5+", "3-5" — append " Years"
  if (/^[\d+\-–]+$/.test(exp.trim())) return `${exp.trim()} Years`;
  return exp;
}

// --- JOB DESCRIPTION MODAL ---
const JobDescriptionModal = ({ job, onClose, onApply }: { job: Job; onClose: () => void; onApply: () => void }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div
        className="bg-[#0B0F19] border border-white/10 rounded-[2rem] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start sticky top-0 bg-[#0B0F19] rounded-t-[2rem] z-10">
          <div>
            <span className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-1 block">Full Job Description</span>
            <h2 className="text-2xl font-bold text-white leading-tight">{job.title}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-slate-400 text-xs">
              <span className="flex items-center gap-1"><MapPin size={10} className="text-blue-400" /> {job.location}</span>
              <span className="flex items-center gap-1"><Clock size={10} className="text-purple-400" /> {job.type}</span>
              {job.experience && <span className="flex items-center gap-1"><Award size={10} className="text-orange-400" /> {formatExperience(job.experience)}</span>}
            </div>
            <div className="mt-2 text-xs text-slate-500 font-mono">
              <span className="font-semibold text-slate-400">Job ID:</span> {job.jobCode ? job.jobCode : job._id}
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen size={14} className="text-blue-400" /> About the Role
            </h3>
            <p className="text-slate-300 text-sm leading-7 whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText size={14} className="text-green-400" /> Responsibilities
              </h3>
              <ul className="space-y-2">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-green-400 mt-1 shrink-0">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Award size={14} className="text-orange-400" /> Requirements
              </h3>
              <ul className="space-y-2">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-orange-400 mt-1 shrink-0">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications */}
          {job.qualifications && (
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Briefcase size={14} className="text-purple-400" /> Qualifications
              </h3>
              <p className="text-slate-300 text-sm leading-7">{job.qualifications}</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 sticky bottom-0 bg-[#0B0F19] rounded-b-[2rem]">
          <button
            onClick={() => { onClose(); onApply(); }}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Apply for this Position <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface Job {
  _id: string;
  jobCode?: string;
  title: string;
  department?: string;
  location: string;
  type: string;
  experience?: string;
  salary?: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  qualifications?: string;
  active: boolean;
  status?: string;
  createdAt: string;
}

// --- MODERN APPLICATION MODAL ---
const ApplicationModal = ({ job, onClose }: { job: Job; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetterUrl: '',
    resumeUrl: '',
    additionalDocuments: [] as string[],
  });
    // Cover Letter Upload Handler
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [coverUploadProgress, setCoverUploadProgress] = useState(0);
    const handleCoverLetterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        alert('Only PDF or Word files allowed for cover letter.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Cover letter size should be less than 5MB');
        return;
      }
      setIsUploadingCover(true);
      setCoverUploadProgress(0);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'tbes-coverletters' })
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to get upload URL');
        const { presignedUrl, publicUrl } = await res.json();
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) setCoverUploadProgress(Math.round((event.loaded / event.total) * 100));
          };
          xhr.onload = () => { if (xhr.status >= 200 && xhr.status < 300) resolve(); else reject(new Error('Upload failed')); };
          xhr.onerror = () => reject(new Error('Network error during upload'));
          xhr.onabort = () => reject(new Error('Upload aborted'));
          xhr.open('PUT', presignedUrl);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.send(file);
        });
        setFormData(prev => ({ ...prev, coverLetterUrl: publicUrl }));
        setCoverUploadProgress(100);
      } catch (error: any) {
        setCoverUploadProgress(0);
        alert(error.message || 'Something went wrong during cover letter upload.');
      } finally {
        setIsUploadingCover(false);
      }
    };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // Removed cover photo upload state
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docProgress, setDocProgress] = useState(0);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Resume size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Get presigned URL
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || 'application/pdf',
          folder: 'tbes-resumes'
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to get upload URL');
      }

      const { presignedUrl, publicUrl } = await res.json();

      // 2. Upload directly to R2 using XMLHttpRequest for progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error('R2 Upload failed'));
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.onabort = () => reject(new Error('Upload aborted'));

        xhr.open('PUT', presignedUrl);
        xhr.setRequestHeader('Content-Type', file.type || 'application/pdf');
        xhr.send(file);
      });

      setFormData(prev => ({ ...prev, resumeUrl: publicUrl }));
      setUploadProgress(100);
      setIsUploading(false);

    } catch (error: any) {
      setIsUploading(false);
      setUploadProgress(0);
      alert(error.message || "Something went wrong during upload.");
    }
  };

  // Cover photo upload removed

  // Additional documents upload handler
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (formData.additionalDocuments.length + files.length > 5) { alert('Max 5 additional documents allowed'); return; }
    setIsUploadingDoc(true); setDocProgress(0);
    try {
      const uploaded: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) { alert(`${file.name} exceeds 10MB limit`); continue; }
        const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/octet-stream', folder: 'tbes-supporting-docs' }) });
        if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
        const { presignedUrl, publicUrl } = await res.json();
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (ev) => { if (ev.lengthComputable) setDocProgress(Math.round(((i / files.length) + (ev.loaded / ev.total) / files.length) * 100)); };
          xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error('Upload failed'));
          xhr.onerror = () => reject(new Error('Network error'));
          xhr.open('PUT', presignedUrl);
          xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
          xhr.send(file);
        });
        uploaded.push(publicUrl);
      }
      setFormData(prev => ({ ...prev, additionalDocuments: [...prev.additionalDocuments, ...uploaded] }));
      setDocProgress(100);
    } catch (err: any) { alert(err.message || 'Document upload failed'); }
    finally { setIsUploadingDoc(false); e.target.value = ''; }
  };

  const removeAdditionalDoc = (index: number) => {
    setFormData(prev => ({ ...prev, additionalDocuments: prev.additionalDocuments.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resumeUrl) {
      alert("Please upload your resume.");
      return;
    }
    if (!formData.coverLetterUrl) {
      alert("Please upload your cover letter (PDF or Word).");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/career/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job._id, ...formData }),
      });

      if (res.ok) {
        setSubmitStatus('success');
        setTimeout(onClose, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
        <div className="bg-[#0B0F19] border border-green-500/30 p-8 rounded-3xl max-w-sm w-full text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-green-500/5"></div>
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Application Sent!</h3>
          <p className="text-slate-400 relative z-10">We'll review your profile and get back to you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-center sm:items-center bg-black/90 backdrop-blur-md p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#0B0F19] w-full max-w-2xl rounded-none sm:rounded-[2rem] border border-white/10 shadow-2xl relative flex flex-col max-h-[100vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-10 duration-300">

        {/* Header (Sticky) */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start bg-[#0B0F19] sticky top-0 z-20">
          <div>
            <span className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-1 block">Applying For</span>
            <h2 className="text-2xl font-bold text-white leading-tight">{job.title}</h2>
            <div className="flex items-center gap-3 mt-2 text-slate-400 text-xs">
              <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
              <span className="flex items-center gap-1"><Clock size={10} /> {job.type}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Content (Scrollable) */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Personal Details</h3>
                <span className="text-[10px] text-slate-600"><span className="text-red-400">*</span> Required</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Full Name <span className="text-red-400">*</span></label>
                  <input type="text" required placeholder="John Doe"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                    value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Phone Number <span className="text-red-400">*</span></label>
                  <input type="tel" required placeholder="+91 98765 43210"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-slate-400">Email Address <span className="text-red-400">*</span></label>
                  <input type="email" required placeholder="john@example.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Documents</h3>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Resume/CV <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    disabled={isUploading}
                  />
                  <div
                    onClick={() => !isUploading && document.getElementById('resume-upload')?.click()}
                    className={`group border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${formData.resumeUrl
                      ? 'border-green-500/30 bg-green-500/5'
                      : isUploading
                        ? 'border-blue-500/30 bg-blue-500/5 cursor-wait'
                        : 'border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5'
                      }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-3 text-blue-400">
                        <div className="p-3 bg-blue-500/20 rounded-full animate-pulse"><UploadCloud size={24} /></div>
                        <div>
                          <p className="font-bold text-sm text-white">Uploading Resume...</p>
                          <div className="w-32 bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div
                              className="bg-blue-500 h-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : formData.resumeUrl ? (
                      <div className="flex flex-col items-center gap-2 text-green-400">
                        <div className="p-3 bg-green-500/20 rounded-full"><CheckCircle2 size={24} /></div>
                        <span className="font-bold text-sm">Resume Attached</span>
                        <span className="text-xs text-green-400/60">Correctly uploaded to TBES storage</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-blue-400">
                        <div className="p-3 bg-white/5 rounded-full group-hover:bg-blue-500/20 transition-colors"><UploadCloud size={24} /></div>
                        <div>
                          <p className="font-bold text-sm text-white group-hover:text-blue-300">Click to Upload Resume</p>
                          <p className="text-xs mt-1 text-slate-500">PDF, DOCX (Max 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Letter Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Cover Letter <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input
                    type="file"
                    id="cover-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCoverLetterUpload}
                    disabled={isUploadingCover}
                  />
                  <div
                    onClick={() => !isUploadingCover && document.getElementById('cover-upload')?.click()}
                    className={`group border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${formData.coverLetterUrl
                      ? 'border-green-500/30 bg-green-500/5'
                      : isUploadingCover
                        ? 'border-blue-500/30 bg-blue-500/5 cursor-wait'
                        : 'border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5'
                      }`}
                  >
                    {isUploadingCover ? (
                      <div className="flex flex-col items-center gap-3 text-blue-400">
                        <div className="p-3 bg-blue-500/20 rounded-full animate-pulse"><UploadCloud size={24} /></div>
                        <div>
                          <p className="font-bold text-sm text-white">Uploading Cover Letter...</p>
                          <div className="w-32 bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div
                              className="bg-blue-500 h-full transition-all duration-300"
                              style={{ width: `${coverUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : formData.coverLetterUrl ? (
                      <div className="flex flex-col items-center gap-2 text-green-400">
                        <div className="p-3 bg-green-500/20 rounded-full"><CheckCircle2 size={24} /></div>
                        <span className="font-bold text-sm">Cover Letter Attached</span>
                        <span className="text-xs text-green-400/60">Correctly uploaded to TBES storage</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-blue-400">
                        <div className="p-3 bg-white/5 rounded-full group-hover:bg-blue-500/20 transition-colors"><UploadCloud size={24} /></div>
                        <div>
                          <p className="font-bold text-sm text-white group-hover:text-blue-300">Click to Upload Cover Letter</p>
                          <p className="text-xs mt-1 text-slate-500">PDF, DOCX (Max 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>



              {/* Additional Supporting Documents */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Supporting Documents (Optional)
                  <span className="ml-2 text-slate-600">Portfolio, Certificates, etc. (Max 5 files, 10MB each)</span>
                </label>
                <input type="file" id="docs-upload" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip" multiple onChange={handleDocUpload} disabled={isUploadingDoc} />

                {/* Uploaded docs list */}
                {formData.additionalDocuments.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {formData.additionalDocuments.map((url, idx) => {
                      const name = url.split('/').pop()?.split('?')[0] || `Document ${idx + 1}`;
                      return (
                        <div key={idx} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10">
                          <div className="flex items-center gap-2 text-slate-300 text-xs">
                            <Paperclip size={12} className="text-blue-400" />
                            <span className="truncate max-w-[200px]">{name}</span>
                          </div>
                          <button type="button" onClick={() => removeAdditionalDoc(idx)} className="text-red-400 hover:text-red-300 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {formData.additionalDocuments.length < 5 && (
                  <div
                    onClick={() => !isUploadingDoc && document.getElementById('docs-upload')?.click()}
                    className={`group border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      isUploadingDoc ? 'border-blue-500/30 bg-blue-500/5 cursor-wait'
                      : 'border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5'
                    }`}
                  >
                    {isUploadingDoc ? (
                      <div className="flex flex-col items-center gap-2 text-blue-400">
                        <div className="p-2 bg-blue-500/20 rounded-full animate-pulse"><UploadCloud size={18} /></div>
                        <p className="font-bold text-sm text-white">Uploading...</p>
                        <div className="w-28 bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full transition-all" style={{ width: `${docProgress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3 text-slate-400 group-hover:text-blue-400">
                        <Paperclip size={16} />
                        <span className="text-sm font-bold text-white group-hover:text-blue-300">Add Supporting Documents</span>
                        <span className="text-xs text-slate-500">({formData.additionalDocuments.length}/5)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>


            </div>

            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isSubmitting ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</> : <>Submit Application <Send size={18} /></>}
              </button>
              {submitStatus === 'error' && <p className="text-red-400 text-xs text-center mt-3 bg-red-500/10 py-2 rounded-lg">Something went wrong. Please try again.</p>}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const CareerPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [descJob, setDescJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) setJobs(data);
          else setJobs([]);
        }
      } catch (error) { console.error('Error fetching jobs:', error); }
      finally { setLoading(false); }
    };
    fetchJobs();
  }, []);

  const benefits = [
    { icon: Users, title: "Collaborative Culture", desc: "Work with diverse teams on global projects.", color: "blue" },
    { icon: Target, title: "Impactful Work", desc: "Contribute to landmark infrastructure worldwide.", color: "red" },
    { icon: Award, title: "Career Growth", desc: "Structured paths for upskilling and leadership.", color: "orange" },
    { icon: Zap, title: "Cutting-Edge Tech", desc: "Access to the latest BIM and AI engineering tools.", color: "yellow" }
  ];

  return (
    <div className="min-h-screen bg-[#020408] text-white font-sans selection:bg-blue-500/30">

      {/* =========================================
          1. HERO SECTION
      ========================================= */}
      <section className="relative pt-16 pb-20 lg:pt-20 lg:pb-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.05]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in zoom-in duration-500">
            <Sparkles size={12} /> We Are Hiring
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
            Build the Future <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">With TBES Global</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light mb-10">
            Join a team of visionaries redefining the AECO industry through innovation, precision, and excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#openings" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 active:scale-95">
              View Openings <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================
          2. CULTURE & BENEFITS
      ========================================= */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Engineers Choose Us</h2>
            <p className="text-slate-400">More than just a job. It's a launchpad for your career.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item, idx) => (
              <div key={idx} className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/5 text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          3. JOB LISTINGS
      ========================================= */}
      <section id="openings" className="py-20 bg-[#020408] border-t border-white/5 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-blue-500 font-bold text-xs uppercase tracking-widest">Opportunities</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Current Openings</h2>
            </div>
          </div>

          {loading ? (
            /* Skeleton Loading */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-white/5 border border-white/5 animate-pulse"></div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            /* Job Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job._id} className="group flex flex-col bg-[#0B0F19] border border-white/5 rounded-[2rem] p-6 hover:border-blue-500/40 hover:shadow-[0_0_50px_-15px_rgba(59,130,246,0.2)] transition-all duration-300">

                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 uppercase tracking-wider font-bold">
                        <Building2 size={12} /> {job.department || 'Engineering'}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                      <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 uppercase tracking-wide">
                      <MapPin size={10} /> {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20 uppercase tracking-wide">
                      <Clock size={10} /> {job.type}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Experience</p>
                      <p className="text-sm text-white font-bold flex items-center gap-1">
                        <Award size={14} className="text-orange-400" /> {formatExperience(job.experience)}
                      </p>
                    </div>
                    <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Salary</p>
                      <p className="text-sm text-white font-bold flex items-center gap-1">
                        <IndianRupee size={14} className="text-green-400" /> {job.salary || 'Best in Industry'}
                      </p>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <div className="relative mb-4">
                    <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0B0F19] to-transparent"></div>
                  </div>

                  {/* Action */}
                  <div className="mt-auto space-y-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setDescJob(job); }}
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold text-sm hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-300 transition-colors flex items-center justify-center gap-2 active:scale-95"
                    >
                      <BookOpen size={14} /> View Full Job Description
                    </button>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center gap-2 active:scale-95"
                    >
                      Apply Now <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 border-dashed rounded-[2rem]">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-6">
                <Search size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Openings Right Now</h3>
              <p className="text-slate-400 text-center max-w-md mb-8">
                We are always looking for exceptional talent. Don't wait for an opening—create one.
              </p>
              <a href="mailto:hr@tbesglobal.com" className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2">
                Drop Your Resume <Send size={16} />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          4. CTA SECTION
      ========================================= */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Can't find what you're looking for?</h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            We are constantly growing. Send your portfolio to our HR team, and we'll keep you on our radar.
          </p>

          <div className="inline-flex flex-col items-center gap-4">
            <a
              href="mailto:hr@tbesglobal.com"
              className="px-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all flex items-center gap-4 group"
            >
              <div className="p-3 bg-blue-600 rounded-xl text-white group-hover:scale-110 transition-transform shadow-lg shadow-blue-600/30">
                <Send size={24} />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Email Us At</p>
                <p className="text-xl font-bold leading-none tracking-tight">hr@tbesglobal.com</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {/* Job Description Modal */}
      {descJob && (
        <JobDescriptionModal
          job={descJob}
          onClose={() => setDescJob(null)}
          onApply={() => { setSelectedJob(descJob); setDescJob(null); }}
        />
      )}
    </div>
  );
};

export default CareerPage;
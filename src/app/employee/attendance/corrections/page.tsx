'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle, CheckCircle2, XCircle, Clock,
  Loader2, Plus, X, CalendarDays, FileQuestion
} from 'lucide-react';

interface CorrectionRequest {
  _id: string;
  date: string;
  requestedPunchIn: string;
  requestedPunchOut: string;
  reason: string;
  details?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminRemarks?: string;
  reviewedAt?: string;
  createdAt: string;
}

const REASONS = [
  'Forgot to punch',
  'System/App issue',
  'Field duty / Client visit',
  'Power outage',
  'Other',
];

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  });
}

function statusBadge(status: string) {
  if (status === 'approved') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
  if (status === 'rejected') return 'bg-red-500/15 text-red-400 border-red-500/20';
  return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'approved') return <CheckCircle2 size={14} />;
  if (status === 'rejected') return <XCircle size={14} />;
  return <Clock size={14} />;
}

export default function CorrectionsPage() {
  const [requests, setRequests] = useState<CorrectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const [form, setForm] = useState({
    date: todayIST,
    punchInTime: '09:00',
    punchOutTime: '18:00',
    reason: REASONS[0],
    details: '',
  });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/employee/attendance/correction');
      const data = await res.json();
      if (data.requests) setRequests(data.requests);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 6000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Build ISO strings from date + time inputs
    const punchInISO = `${form.date}T${form.punchInTime}:00+05:30`;
    const punchOutISO = `${form.date}T${form.punchOutTime}:00+05:30`;

    try {
      const res = await fetch('/api/employee/attendance/correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: form.date,
          requestedPunchIn: punchInISO,
          requestedPunchOut: punchOutISO,
          reason: form.reason,
          details: form.details,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg(data.message, 'success');
        setShowForm(false);
        setForm({ date: todayIST, punchInTime: '09:00', punchOutTime: '18:00', reason: REASONS[0], details: '' });
        fetchRequests();
      } else {
        showMsg(data.message, 'error');
      }
    } catch {
      showMsg('Failed to submit. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Correction Requests</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Forgot to punch? Submit a correction and admin will review it.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-emerald-500/20"
        >
          <Plus size={16} /> New Request
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${message.type === 'success'
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* ── New Request Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <h2 className="font-bold text-white text-lg flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                Request Attendance Correction
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Date</label>
                <input
                  type="date"
                  max={todayIST}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                />
              </div>

              {/* Punch In / Out Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Punch In Time</label>
                  <input
                    type="time"
                    value={form.punchInTime}
                    onChange={(e) => setForm({ ...form, punchInTime: e.target.value })}
                    required
                    className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Punch Out Time</label>
                  <input
                    type="time"
                    value={form.punchOutTime}
                    onChange={(e) => setForm({ ...form, punchOutTime: e.target.value })}
                    required
                    className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Reason</label>
                <select
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  required
                  className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                >
                  {REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Additional Details */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Additional Details <span className="text-zinc-700 normal-case">(optional)</span>
                </label>
                <textarea
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  rows={3}
                  placeholder="Any extra context for the admin..."
                  className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/10 text-zinc-400 rounded-xl hover:bg-white/[0.07] transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all text-sm disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="bg-[#111113] border border-white/[0.07] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 size={28} className="animate-spin text-emerald-500" />
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center">
            <FileQuestion size={40} className="mx-auto mb-3 text-zinc-700" />
            <p className="text-zinc-500">No correction requests submitted yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Submit your first request →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {requests.map((r) => (
              <div key={r._id} className="p-5 hover:bg-white/[0.02] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CalendarDays size={15} className="text-zinc-600 shrink-0" />
                      <span className="font-semibold text-white">
                        {new Date(`${r.date}T00:00:00`).toLocaleDateString('en-IN', {
                          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-400 ml-[23px]">
                      <span>
                        <span className="text-zinc-600 text-xs uppercase font-semibold mr-1">In:</span>
                        <span className="text-emerald-400 font-medium">{formatTime(r.requestedPunchIn)}</span>
                      </span>
                      <span>
                        <span className="text-zinc-600 text-xs uppercase font-semibold mr-1">Out:</span>
                        <span className="text-amber-400 font-medium">{formatTime(r.requestedPunchOut)}</span>
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 ml-[23px]">
                      <span className="text-zinc-600 font-semibold mr-1">Reason:</span>
                      {r.reason}
                      {r.details && <span className="text-zinc-500"> — {r.details}</span>}
                    </p>
                    {r.adminRemarks && (
                      <p className="text-sm ml-[23px] text-zinc-500 bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.05]">
                        <span className="font-semibold text-zinc-400">Admin:</span> {r.adminRemarks}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${statusBadge(r.status)}`}>
                      <StatusIcon status={r.status} />
                      {r.status}
                    </span>
                    <span className="text-[11px] text-zinc-600">
                      Submitted {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

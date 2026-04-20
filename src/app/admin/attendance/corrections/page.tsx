'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2, XCircle, Loader2, Clock, Users, MessageSquare,
  AlertTriangle, ChevronRight
} from 'lucide-react';

interface Employee {
  _id: string;
  name: string;
  employeeId: string;
  designation: string;
  department: string;
}

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
  employee: Employee;
}

const REASONS: Record<string, string> = {
  forgot_punch_in: 'Forgot to punch in',
  forgot_punch_out: 'Forgot to punch out',
  system_error: 'System error',
  work_from_client: 'Work from client site',
  other: 'Other reason',
};

function formatTime(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  });
}

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00+05:30`).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', weekday: 'short',
  });
}

type Tab = 'pending' | 'approved' | 'rejected';

export default function AdminCorrectionsPage() {
  const [tab, setTab] = useState<Tab>('pending');
  const [requests, setRequests] = useState<CorrectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  // Action modal state
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    action: 'approve' | 'reject';
    request: CorrectionRequest | null;
  }>({ open: false, action: 'approve', request: null });
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/attendance/corrections?status=${tab}`);
      const data = await res.json();
      if (data.requests) {
        setRequests(data.requests);
        if (tab === 'pending') setPendingCount(data.requests.length);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [tab]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  // Fetch pending count whenever we're on a non-pending tab
  useEffect(() => {
    if (tab === 'pending') return;
    fetch('/api/admin/attendance/corrections?status=pending')
      .then(r => r.json())
      .then(d => { if (d.requests) setPendingCount(d.requests.length); })
      .catch(() => {});
  }, [tab]);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const openModal = (action: 'approve' | 'reject', req: CorrectionRequest) => {
    setActionModal({ open: true, action, request: req });
    setRemarks('');
  };

  const handleAction = async () => {
    if (!actionModal.request) return;
    if (actionModal.action === 'reject' && !remarks.trim()) {
      showMsg('Please provide a reason for rejection.', 'error');
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/attendance/corrections/${actionModal.request._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionModal.action,
          adminRemarks: remarks.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg(
          actionModal.action === 'approve'
            ? 'Request approved and attendance updated.'
            : 'Request rejected.',
          'success'
        );
        setActionModal({ open: false, action: 'approve', request: null });
        fetchRequests();
      } else {
        showMsg(data.message || 'Action failed.', 'error');
      }
    } catch (e) { showMsg('Network error. Try again.', 'error'); }
    finally { setActionLoading(false); }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <AlertTriangle size={22} className="text-amber-400" /> Correction Requests
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Review and action employee attendance correction requests.
        </p>
      </div>

      {/* Toast */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0a0a0c] border border-white/[0.07] rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors relative ${tab === t.id ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            {t.label}
            {t.id === 'pending' && pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#111113] border border-white/[0.07] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 size={28} className="animate-spin text-blue-400" />
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center">
            <CheckCircle2 size={40} className="mx-auto mb-3 text-zinc-700" />
            <p className="text-zinc-500">No {tab} correction requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Employee', 'Date', 'Requested Times', 'Reason', 'Submitted', tab !== 'pending' ? 'Admin Remarks' : '', tab === 'pending' ? 'Actions' : 'Status'].map((h, i) => h && (
                    <th key={i} className="text-left text-[10px] text-zinc-500 uppercase font-bold tracking-widest px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-zinc-200">{req.employee?.name}</p>
                      <p className="text-xs text-zinc-500">{req.employee?.employeeId} · {req.employee?.department}</p>
                    </td>
                    <td className="px-4 py-4 text-zinc-300 whitespace-nowrap">
                      {formatDate(req.date)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        <p className="text-emerald-400 font-medium text-xs">In: {formatTime(req.requestedPunchIn)}</p>
                        <p className="text-amber-400 font-medium text-xs">Out: {formatTime(req.requestedPunchOut)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-zinc-300 text-xs">{REASONS[req.reason] || req.reason}</p>
                      {req.details && (
                        <p className="text-zinc-500 text-xs mt-0.5 max-w-[200px] truncate" title={req.details}>{req.details}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-zinc-500 text-xs whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>

                    {tab !== 'pending' && (
                      <td className="px-4 py-4 text-zinc-400 text-xs max-w-[160px]">
                        {req.adminRemarks || <span className="text-zinc-700">—</span>}
                      </td>
                    )}

                    {tab === 'pending' ? (
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal('approve', req)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <CheckCircle2 size={13} /> Approve
                          </button>
                          <button
                            onClick={() => openModal('reject', req)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      </td>
                    ) : (
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${req.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-red-500/15 text-red-400 border-red-500/20'}`}>
                          {req.status}
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {actionModal.open && actionModal.request && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/[0.10] rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-white/[0.07]">
              <h2 className="text-lg font-bold text-white capitalize">
                {actionModal.action} Correction Request
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                {actionModal.request.employee?.name} · {formatDate(actionModal.request.date)}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Request summary */}
              <div className="bg-zinc-900/60 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Punch In</span>
                  <span className="text-emerald-400 font-medium">{formatTime(actionModal.request.requestedPunchIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Punch Out</span>
                  <span className="text-amber-400 font-medium">{formatTime(actionModal.request.requestedPunchOut)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Reason</span>
                  <span className="text-zinc-300 text-right max-w-[60%]">{REASONS[actionModal.request.reason] || actionModal.request.reason}</span>
                </div>
                {actionModal.request.details && (
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-zinc-500 text-xs">Employee Note:</p>
                    <p className="text-zinc-400 text-xs mt-0.5">{actionModal.request.details}</p>
                  </div>
                )}
              </div>

              {actionModal.action === 'approve' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-400">
                  Approving will create/update the attendance record for this date with the requested times.
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                  Admin Remarks {actionModal.action === 'reject' && <span className="text-red-400">*</span>}
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={actionModal.action === 'reject' ? 'Reason for rejection (required)' : 'Optional note...'}
                  rows={3}
                  className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-white/[0.07] flex gap-3 justify-end">
              <button
                onClick={() => setActionModal({ open: false, action: 'approve', request: null })}
                className="px-5 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={actionLoading}
                className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${actionModal.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'} disabled:opacity-50`}
              >
                {actionLoading && <Loader2 size={14} className="animate-spin" />}
                {actionModal.action === 'approve' ? 'Approve Request' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

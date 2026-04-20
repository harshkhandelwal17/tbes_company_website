'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CalendarDays, Plus, Trash2, Loader2, CheckCircle2, XCircle,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';

interface Holiday {
  _id: string;
  date: string;
  name: string;
  type: string;
  description: string;
}

const TYPE_CLASS: Record<string, string> = {
  national: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  optional: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  restricted: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  company: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
};

const BLANK = { date: '', name: '', type: 'company', description: '' };

export default function AdminHolidaysPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [submitting, setSubmitting] = useState(false);

  const fetchHolidays = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/holidays?year=${year}`);
      const data = await res.json();
      if (data.holidays) setHolidays(data.holidays);
    } catch { }
    finally { setLoading(false); }
  }, [year]);

  useEffect(() => { fetchHolidays(); }, [fetchHolidays]);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showMsg('Holiday added.', 'success');
        setShowForm(false);
        setForm({ ...BLANK });
        fetchHolidays();
      } else {
        showMsg(data.message || 'Failed.', 'error');
      }
    } catch { showMsg('Network error.', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this holiday?')) return;
    try {
      await fetch(`/api/admin/holidays/${id}`, { method: 'DELETE' });
      showMsg('Holiday deleted.', 'success');
      fetchHolidays();
    } catch { showMsg('Failed to delete.', 'error'); }
  };

  const inputClass = "w-full bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-blue-500/40 transition-colors";
  const labelClass = "text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block";

  // Group by month
  const grouped: Record<string, Holiday[]> = {};
  for (const h of holidays) {
    const month = new Date(`${h.date}T00:00:00+05:30`).toLocaleDateString('en-IN', { month: 'long' });
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(h);
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <CalendarDays size={22} className="text-purple-400" /> Company Holidays
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage holidays. Employees cannot punch-in on holiday dates.
          </p>
        </div>
        <button onClick={() => { setForm({ ...BLANK }); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-sm transition-all">
          <Plus size={16} /> Add Holiday
        </button>
      </div>

      {/* Toast */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* Year Selector */}
      <div className="flex items-center gap-3">
        <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-xl font-bold text-white min-w-[80px] text-center">{year}</span>
        <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white transition-colors">
          <ChevronRight size={16} />
        </button>
        <span className="text-xs text-zinc-600 ml-2">{holidays.length} holidays</span>
      </div>

      {/* Type Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(TYPE_CLASS).map(([type, cls]) => (
          <span key={type} className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${cls}`}>
            {type}
          </span>
        ))}
      </div>

      {/* Holidays List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="animate-spin text-purple-400" />
        </div>
      ) : holidays.length === 0 ? (
        <div className="bg-[#111113] border border-white/[0.07] rounded-2xl py-16 text-center">
          <CalendarDays size={40} className="mx-auto mb-3 text-zinc-700" />
          <p className="text-zinc-500">No holidays added for {year}.</p>
          <button onClick={() => setShowForm(true)} className="mt-4 text-purple-400 text-sm hover:underline">
            + Add your first holiday
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([month, hols]) => (
            <div key={month}>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">{month}</h3>
              <div className="bg-[#111113] border border-white/[0.07] rounded-2xl overflow-hidden divide-y divide-white/[0.04]">
                {hols.map((h) => (
                  <div key={h._id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group">
                    <div className="w-12 text-center flex-shrink-0">
                      <p className="text-2xl font-bold text-white leading-none">
                        {new Date(`${h.date}T00:00:00+05:30`).getDate()}
                      </p>
                      <p className="text-[10px] text-zinc-500 uppercase">
                        {new Date(`${h.date}T00:00:00+05:30`).toLocaleDateString('en-IN', { weekday: 'short' })}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-zinc-200">{h.name}</p>
                      {h.description && <p className="text-xs text-zinc-500 mt-0.5">{h.description}</p>}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize flex-shrink-0 ${TYPE_CLASS[h.type] || ''}`}>
                      {h.type}
                    </span>
                    <button
                      onClick={() => handleDelete(h._id)}
                      className="p-1.5 text-zinc-700 group-hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <h2 className="font-bold text-white">Add Holiday</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 text-zinc-500 hover:text-white rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAdd} className="p-6 space-y-4">
                <div>
                  <label className={labelClass}>Date *</label>
                  <input type="date" required value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Holiday Name *</label>
                  <input type="text" required placeholder="e.g. Diwali" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputClass}>
                    <option value="national">National</option>
                    <option value="company">Company</option>
                    <option value="optional">Optional</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Description (optional)</label>
                  <input type="text" placeholder="Brief note..." value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className={inputClass} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 text-sm text-zinc-400 hover:text-white border border-white/10 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors text-sm disabled:opacity-60">
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    Add Holiday
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

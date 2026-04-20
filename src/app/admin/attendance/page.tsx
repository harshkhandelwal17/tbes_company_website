'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Clock, Search, Filter, Loader2, Users,
  CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, XCircle
} from 'lucide-react';

interface Employee {
  _id: string;
  name: string;
  employeeId: string;
  designation: string;
  department: string;
}

interface AttendanceRecord {
  _id: string;
  date: string;
  punchIn: string | null;
  punchOut: string | null;
  totalHours: number;
  status: string;
  isManuallyEdited: boolean;
  employee: Employee;
}

const STATUS_CLASS: Record<string, string> = {
  present: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  late: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  half_day: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  absent: 'bg-red-500/15 text-red-400 border-red-500/20',
  incomplete: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
  wfh: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  holiday: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  weekend: 'bg-zinc-700/20 text-zinc-600 border-zinc-700/20',
};

function formatTime(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  });
}

export default function AdminAttendancePage() {
  const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const defaultMonth = todayIST.slice(0, 7);

  const [viewMode, setViewMode] = useState<'date' | 'month'>('date');
  const [selectedDate, setSelectedDate] = useState(todayIST);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Summary counts
  const summary = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Fetch employees for filter dropdown
  useEffect(() => {
    fetch('/api/admin/employees?status=active')
      .then(r => r.json())
      .then(d => { if (d.employees) setEmployees(d.employees); })
      .catch(() => {});
  }, []);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (viewMode === 'date') params.set('date', selectedDate);
      else params.set('month', selectedMonth);
      if (selectedEmployee) params.set('employeeId', selectedEmployee);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/attendance?${params}`);
      const data = await res.json();
      if (data.records) setRecords(data.records);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [viewMode, selectedDate, selectedMonth, selectedEmployee, statusFilter]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const changeMonth = (delta: number) => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const filteredRecords = employeeSearch
    ? records.filter((r) =>
        r.employee?.name?.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        r.employee?.employeeId?.toLowerCase().includes(employeeSearch.toLowerCase())
      )
    : records;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Clock size={22} className="text-blue-400" /> Attendance Records
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          View and monitor all employee attendance data.
        </p>
      </div>

      {/* Toast */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* Filter Controls */}
      <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-5 space-y-4">

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          {(['date', 'month'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${viewMode === m ? 'bg-blue-600 text-white' : 'bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.06]'}`}
            >
              By {m}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Date / Month picker */}
          {viewMode === 'date' ? (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/30 transition-colors"
            />
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => changeMonth(-1)} className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-zinc-300 font-medium min-w-[120px] text-center">
                {new Date(`${selectedMonth}-01`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={() => changeMonth(1)} className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Employee Filter */}
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/30 transition-colors"
          >
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.employeeId})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/30 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="half_day">Half Day</option>
            <option value="absent">Absent</option>
            <option value="incomplete">Incomplete</option>
            <option value="wfh">WFH</option>
          </select>

          {/* Search by name in results */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search name / ID..."
              value={employeeSearch}
              onChange={(e) => setEmployeeSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-zinc-900/60 border border-white/10 rounded-xl text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Summary Pills */}
      {!loading && records.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          {Object.entries(summary).map(([s, count]) => (
            <span key={s} className={`px-3 py-1.5 rounded-full border capitalize ${STATUS_CLASS[s] || 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20'}`}>
              {count} {s.replace('_', ' ')}
            </span>
          ))}
        </div>
      )}

      {/* Records Table */}
      <div className="bg-[#111113] border border-white/[0.07] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 size={28} className="animate-spin text-blue-400" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarDays size={40} className="mx-auto mb-3 text-zinc-700" />
            <p className="text-zinc-500">No attendance records found for this filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Employee', 'Date', 'Punch In', 'Punch Out', 'Hours', 'Status', 'Note'].map((h) => (
                    <th key={h} className="text-left text-[10px] text-zinc-500 uppercase font-bold tracking-widest px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredRecords.map((r) => (
                  <tr key={r._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-zinc-200">{r.employee?.name}</p>
                      <p className="text-xs text-zinc-500">{r.employee?.employeeId}</p>
                    </td>
                    <td className="px-4 py-4 text-zinc-400">
                      {new Date(`${r.date}T00:00:00+05:30`).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4 text-emerald-400 font-medium">{formatTime(r.punchIn)}</td>
                    <td className="px-4 py-4 text-amber-400 font-medium">{formatTime(r.punchOut)}</td>
                    <td className="px-4 py-4 text-zinc-300">
                      {r.totalHours > 0
                        ? `${Math.floor(r.totalHours)}h ${Math.round((r.totalHours % 1) * 60)}m`
                        : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${STATUS_CLASS[r.status] || ''}`}>
                        {r.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {r.isManuallyEdited && (
                        <span className="text-[10px] text-purple-400 font-bold uppercase">Edited</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

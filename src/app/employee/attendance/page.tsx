'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Clock, CheckCircle2, XCircle, Loader2, CalendarDays,
  ChevronLeft, ChevronRight, AlertTriangle, List, Grid3X3,
  TrendingUp, Flame, Target, Activity
} from 'lucide-react';
import Link from 'next/link';

interface AttendanceRecord {
  _id: string;
  date: string;
  punchIn: string | null;
  punchOut: string | null;
  totalHours: number;
  status: string;
  isManuallyEdited: boolean;
}

interface Summary {
  present: number;
  late: number;
  half_day: number;
  absent: number;
  incomplete: number;
  wfh: number;
  totalHours: number;
}

interface StatsData {
  currentStreak: number;
  bestStreak: number;
  totalPresent: number;
  punctualityPct: number;
  totalHoursAllTime: number;
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  });
}

function formatHours(h: number): string {
  if (!h) return '—';
  return `${Math.floor(h)}h ${Math.round((h % 1) * 60)}m`;
}

function statusClass(status: string): string {
  const map: Record<string, string> = {
    present: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    late: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    half_day: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    absent: 'bg-red-500/15 text-red-400 border-red-500/20',
    incomplete: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
    wfh: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    holiday: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    weekend: 'bg-zinc-700/15 text-zinc-600 border-zinc-700/20',
  };
  return map[status] || 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20';
}

function calendarDotClass(status: string): string {
  const map: Record<string, string> = {
    present: 'bg-emerald-500',
    late: 'bg-amber-400',
    half_day: 'bg-orange-400',
    absent: 'bg-red-500',
    incomplete: 'bg-zinc-500',
    wfh: 'bg-blue-500',
    holiday: 'bg-purple-500',
    weekend: 'bg-zinc-700',
  };
  return map[status] || 'bg-zinc-600';
}

function calendarCellBg(status: string): string {
  const map: Record<string, string> = {
    present: 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20',
    late: 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20',
    half_day: 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20',
    absent: 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20',
    incomplete: 'bg-zinc-500/10 border-zinc-500/20 hover:bg-zinc-500/20',
    wfh: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20',
    holiday: 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20',
    weekend: 'bg-zinc-800/30 border-zinc-700/20',
  };
  return map[status] || 'bg-zinc-800/20 border-white/5';
}

// Build a full calendar grid for a given month, with record data filled in
function buildCalendarGrid(
  year: number,
  month: number, // 1-indexed
  records: AttendanceRecord[]
): ({ day: number; date: string; record: AttendanceRecord | null } | null)[] {
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  const recordMap: Record<string, AttendanceRecord> = {};
  records.forEach((r) => { recordMap[r.date] = r; });

  const cells: ({ day: number; date: string; record: AttendanceRecord | null } | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null); // padding
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, date: dateStr, record: recordMap[dateStr] || null });
  }
  return cells;
}

export default function AttendancePage() {
  const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const defaultMonth = todayIST.slice(0, 7);

  const [currentMonth, setCurrentMonth] = useState(defaultMonth);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedCell, setSelectedCell] = useState<AttendanceRecord | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [histRes, todayRes, statsRes] = await Promise.all([
        fetch(`/api/employee/attendance/history?month=${currentMonth}`),
        fetch('/api/employee/attendance'),
        fetch('/api/employee/attendance/stats'),
      ]);
      const histData = await histRes.json();
      const todayData = await todayRes.json();
      const statsData = await statsRes.json();

      if (histData.records) setRecords(histData.records);
      if (histData.summary) setSummary(histData.summary);
      setTodayRecord(todayData.record || null);
      if (statsData.currentStreak !== undefined) setStats(statsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handlePunchIn = async () => {
    setActionLoading(true);
    const res = await fetch('/api/employee/attendance/punch-in', { method: 'POST' });
    const data = await res.json();
    showMsg(data.message, data.success ? 'success' : 'error');
    if (data.success) fetchAll();
    setActionLoading(false);
  };

  const handlePunchOut = async () => {
    setActionLoading(true);
    const res = await fetch('/api/employee/attendance/punch-out', { method: 'POST' });
    const data = await res.json();
    showMsg(data.message, data.success ? 'success' : 'error');
    if (data.success) fetchAll();
    setActionLoading(false);
  };

  const changeMonth = (delta: number) => {
    const [y, m] = currentMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (next > defaultMonth) return;
    setCurrentMonth(next);
    setSelectedCell(null);
  };

  const monthLabel = new Date(`${currentMonth}-01`).toLocaleDateString('en-IN', {
    month: 'long', year: 'numeric',
  });

  const [year, month] = currentMonth.split('-').map(Number);
  const calendarGrid = buildCalendarGrid(year, month, records);

  const isPunchedIn = !!todayRecord?.punchIn;
  const isPunchedOut = !!todayRecord?.punchOut;
  const isCurrentMonth = currentMonth === defaultMonth;

  return (
    <div className="space-y-6">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Attendance</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Your daily punch records and attendance history</p>
        </div>
        <Link
          href="/employee/attendance/corrections"
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-400 hover:bg-amber-500/20 transition-colors font-medium"
        >
          <AlertTriangle size={15} />
          Request Correction
        </Link>
      </div>

      {/* ── NOTIFICATION ── */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* ── MINI STATS ROW ── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Flame, label: 'Current Streak', value: `${stats.currentStreak} days`, color: 'text-orange-400' },
            { icon: Target, label: 'Punctuality', value: `${stats.punctualityPct}%`, color: stats.punctualityPct >= 80 ? 'text-emerald-400' : stats.punctualityPct >= 60 ? 'text-amber-400' : 'text-red-400' },
            { icon: TrendingUp, label: 'Total Present', value: `${stats.totalPresent} days`, color: 'text-blue-400' },
            { icon: Activity, label: 'All-time Hours', value: `${Math.floor(stats.totalHoursAllTime)}h`, color: 'text-purple-400' },
          ].map((s) => (
            <div key={s.label} className="bg-[#111113] border border-white/[0.07] rounded-xl p-4 flex items-center gap-3">
              <s.icon size={20} className={s.color} />
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide">{s.label}</p>
                <p className={`text-base font-black ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TODAY PUNCH CARD (current month only) ── */}
      {isCurrentMonth && (
        <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-6">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
            <Clock size={16} className="text-emerald-500" />
            Today&apos;s Status
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider mb-1.5">Punch In</p>
                <p className="text-2xl font-bold text-emerald-400">{formatTime(todayRecord?.punchIn ?? null)}</p>
              </div>
              <div className="w-px bg-white/[0.07] hidden sm:block" />
              <div className="text-center">
                <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider mb-1.5">Punch Out</p>
                <p className="text-2xl font-bold text-amber-400">{formatTime(todayRecord?.punchOut ?? null)}</p>
              </div>
              {todayRecord?.totalHours ? (
                <>
                  <div className="w-px bg-white/[0.07] hidden sm:block" />
                  <div className="text-center">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider mb-1.5">Duration</p>
                    <p className="text-2xl font-bold text-white">{formatHours(todayRecord.totalHours)}</p>
                  </div>
                </>
              ) : null}
            </div>

            <div className="flex gap-3 sm:ml-auto">
              {!isPunchedIn && (
                <button
                  onClick={handlePunchIn}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60 text-sm"
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />}
                  Punch In
                </button>
              )}
              {isPunchedIn && !isPunchedOut && (
                <button
                  onClick={handlePunchOut}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-60 text-sm"
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />}
                  Punch Out
                </button>
              )}
              {isPunchedIn && isPunchedOut && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-400 font-bold rounded-xl border border-emerald-500/20 text-sm">
                  <CheckCircle2 size={16} /> Day Complete
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MONTH NAVIGATOR + VIEW TOGGLE + SUMMARY ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="font-bold text-white text-lg min-w-[170px] text-center">{monthLabel}</h2>
          <button
            onClick={() => changeMonth(1)}
            disabled={currentMonth >= defaultMonth}
            className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Summary pills */}
          {summary && (
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {[
                { label: 'Present', value: summary.present, c: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                { label: 'Late', value: summary.late, c: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                { label: 'Half Day', value: summary.half_day, c: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
                { label: 'Absent', value: summary.absent, c: 'text-red-400 bg-red-500/10 border-red-500/20' },
                { label: `${summary.totalHours}h`, value: null, c: 'text-white bg-white/5 border-white/10' },
              ].map((s) => (
                <span key={s.label} className={`px-3 py-1 rounded-full border ${s.c}`}>
                  {s.value !== null ? `${s.value} ` : ''}{s.label}
                </span>
              ))}
            </div>
          )}

          {/* View toggle */}
          <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'calendar' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Grid3X3 size={13} /> Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'list' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <List size={13} /> List
            </button>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      {loading ? (
        <div className="flex items-center justify-center h-56 bg-[#111113] border border-white/[0.07] rounded-2xl">
          <Loader2 size={28} className="animate-spin text-emerald-500" />
        </div>
      ) : viewMode === 'calendar' ? (
        /* ── CALENDAR VIEW ── */
        <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarGrid.map((cell, idx) => {
              if (!cell) return <div key={`pad-${idx}`} />;
              const isToday = cell.date === todayIST;
              const status = cell.record?.status;
              return (
                <button
                  key={cell.date}
                  onClick={() => cell.record && setSelectedCell(
                    selectedCell?._id === cell.record._id ? null : cell.record
                  )}
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-xl border transition-all duration-150 ${
                    status
                      ? calendarCellBg(status)
                      : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]'
                  } ${isToday ? 'ring-2 ring-emerald-500/50 ring-offset-1 ring-offset-[#111113]' : ''}`}
                >
                  <span className={`text-xs font-bold ${isToday ? 'text-emerald-400' : status ? 'text-zinc-200' : 'text-zinc-600'}`}>
                    {cell.day}
                  </span>
                  {status && (
                    <span className={`mt-0.5 w-1.5 h-1.5 rounded-full ${calendarDotClass(status)}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-white/[0.06] text-xs text-zinc-500">
            {[
              { label: 'Present', dot: 'bg-emerald-500' },
              { label: 'Late', dot: 'bg-amber-400' },
              { label: 'Half Day', dot: 'bg-orange-400' },
              { label: 'Absent', dot: 'bg-red-500' },
              { label: 'WFH', dot: 'bg-blue-500' },
              { label: 'Holiday', dot: 'bg-purple-500' },
              { label: 'Weekend', dot: 'bg-zinc-700' },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${l.dot}`} /> {l.label}
              </span>
            ))}
          </div>

          {/* Selected cell detail */}
          {selectedCell && (
            <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <CalendarDays size={20} className="text-zinc-400" />
                <div>
                  <p className="text-sm font-bold text-white">
                    {new Date(`${selectedCell.date}T00:00:00+05:30`).toLocaleDateString('en-IN', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    In: <span className="text-emerald-400 font-medium">{formatTime(selectedCell.punchIn)}</span>
                    {' '}· Out: <span className="text-amber-400 font-medium">{formatTime(selectedCell.punchOut)}</span>
                    {selectedCell.totalHours > 0 && (
                      <> · <span className="text-zinc-300 font-medium">{formatHours(selectedCell.totalHours)}</span></>
                    )}
                    {selectedCell.isManuallyEdited && (
                      <span className="ml-2 text-purple-400 font-bold text-[10px] uppercase">Edited</span>
                    )}
                  </p>
                </div>
              </div>
              <span className={`sm:ml-auto self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${statusClass(selectedCell.status)}`}>
                {selectedCell.status.replace('_', ' ')}
              </span>
            </div>
          )}
        </div>
      ) : (
        /* ── LIST VIEW ── */
        <div className="bg-[#111113] border border-white/[0.07] rounded-2xl overflow-hidden">
          {records.length === 0 ? (
            <div className="py-16 text-center text-zinc-500">
              <CalendarDays size={40} className="mx-auto mb-3 text-zinc-700" />
              <p>No attendance records for this month.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left text-[10px] text-zinc-500 uppercase font-bold tracking-widest px-6 py-4">Date</th>
                    <th className="text-left text-[10px] text-zinc-500 uppercase font-bold tracking-widest px-4 py-4">Day</th>
                    <th className="text-left text-[10px] text-zinc-500 uppercase font-bold tracking-widest px-4 py-4">Punch In</th>
                    <th className="text-left text-[10px] text-zinc-500 uppercase font-bold tracking-widest px-4 py-4">Punch Out</th>
                    <th className="text-left text-[10px] text-zinc-500 uppercase font-bold tracking-widest px-4 py-4">Hours</th>
                    <th className="text-left text-[10px] text-zinc-500 uppercase font-bold tracking-widest px-4 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {records.map((r) => {
                    const dateObj = new Date(`${r.date}T00:00:00+05:30`);
                    const isToday2 = r.date === todayIST;
                    return (
                      <tr
                        key={r._id}
                        className={`hover:bg-white/[0.02] transition-colors ${isToday2 ? 'bg-emerald-500/5' : ''}`}
                      >
                        <td className="px-6 py-3.5 text-zinc-300 font-medium">
                          {dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          {isToday2 && <span className="ml-2 text-[10px] text-emerald-500 font-bold uppercase">Today</span>}
                          {r.isManuallyEdited && <span className="ml-2 text-[10px] text-purple-400 font-bold uppercase">Edited</span>}
                        </td>
                        <td className="px-4 py-3.5 text-zinc-500">{dateObj.toLocaleDateString('en-IN', { weekday: 'short' })}</td>
                        <td className="px-4 py-3.5 text-emerald-400 font-medium">{formatTime(r.punchIn)}</td>
                        <td className="px-4 py-3.5 text-amber-400 font-medium">{formatTime(r.punchOut)}</td>
                        <td className="px-4 py-3.5 text-zinc-300">{r.totalHours > 0 ? formatHours(r.totalHours) : '—'}</td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${statusClass(r.status)}`}>
                            {r.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight,
  CalendarDays, Flame, Trophy, TrendingUp, Loader2, Zap,
  Activity, BarChart3, Target
} from 'lucide-react';

interface AttendanceRecord {
  _id: string;
  date: string;
  punchIn: string | null;
  punchOut: string | null;
  totalHours: number;
  status: string;
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
  totalLate: number;
  totalHalfDay: number;
  totalAbsent: number;
  totalHoursAllTime: number;
  punctualityPct: number;
  monthlyChart: { month: string; present: number; late: number; absent: number; hours: number }[];
  joiningDate: string;
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  });
}

function formatHours(h: number): string {
  if (!h) return '0h';
  return `${Math.floor(h)}h ${Math.round((h % 1) * 60)}m`;
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    present: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    late: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    half_day: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
    absent: 'bg-red-500/15 text-red-400 border-red-500/25',
    incomplete: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25',
    wfh: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    holiday: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
    weekend: 'bg-zinc-700/20 text-zinc-600 border-zinc-700/25',
  };
  return map[status] || 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25';
}

function punctualityColor(pct: number): string {
  if (pct >= 80) return 'text-emerald-400';
  if (pct >= 60) return 'text-amber-400';
  return 'text-red-400';
}

function punctualityBg(pct: number): string {
  if (pct >= 80) return 'from-emerald-500 to-teal-500';
  if (pct >= 60) return 'from-amber-500 to-orange-400';
  return 'from-red-500 to-rose-500';
}

export default function EmployeeDashboardPage() {
  const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const [liveTime, setLiveTime] = useState('');
  const [employee, setEmployee] = useState<{ name: string; email: string; employeeId: string } | null>(null);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recentRecords, setRecentRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);       // initial page load
  const [refreshing, setRefreshing] = useState(false); // background refresh after punch
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Live ticking clock
  useEffect(() => {
    const tick = () => {
      setLiveTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: true, timeZone: 'Asia/Kolkata',
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const currentMonth = todayIST.slice(0, 7);

  const fetchData = useCallback(async (isBackground = false) => {
    if (isBackground) setRefreshing(true);
    else setLoading(true);
    try {
      const [meRes, todayRes, histRes, statsRes] = await Promise.allSettled([
        fetch('/api/employee/auth/me', { cache: 'no-store' }),
        fetch('/api/employee/attendance', { cache: 'no-store' }),
        fetch(`/api/employee/attendance/history?month=${currentMonth}`, { cache: 'no-store' }),
        fetch('/api/employee/attendance/stats', { cache: 'no-store' }),
      ]);

      if (meRes.status === 'fulfilled') {
        const meData = await meRes.value.json().catch(() => ({}));
        if (meData.employee) setEmployee(meData.employee);
      }
      if (todayRes.status === 'fulfilled') {
        const todayData = await todayRes.value.json().catch(() => ({}));
        setTodayRecord(todayData.record || null);
      }
      if (histRes.status === 'fulfilled') {
        const histData = await histRes.value.json().catch(() => ({}));
        if (histData.summary) setSummary(histData.summary);
        if (histData.records) setRecentRecords(histData.records.slice(0, 5));
      }
      if (statsRes.status === 'fulfilled') {
        const statsData = await statsRes.value.json().catch(() => ({}));
        if (statsData.currentStreak !== undefined) setStats(statsData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentMonth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 6000);
  };

  const handlePunchIn = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/employee/attendance/punch-in', { method: 'POST' });
      const data = await res.json();
      showMessage(data.message, data.success ? 'success' : 'error');
      if (data.success) await fetchData(true); // background — no full-page spinner
    } catch {
      showMessage('Failed to punch in. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePunchOut = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/employee/attendance/punch-out', { method: 'POST' });
      const data = await res.json();
      showMessage(data.message, data.success ? 'success' : 'error');
      if (data.success) await fetchData(true); // background — no full-page spinner
    } catch {
      showMessage('Failed to punch out. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const isPunchedIn = !!todayRecord?.punchIn;
  const isPunchedOut = !!todayRecord?.punchOut;
  const canPunchIn = !isPunchedIn;
  const canPunchOut = isPunchedIn && !isPunchedOut;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const chartMax = stats
    ? Math.max(...stats.monthlyChart.map((m) => m.present + m.late + m.absent), 1)
    : 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            {greeting()}, {employee?.name?.split(' ')[0] || 'Employee'} 👋
            {refreshing && <Loader2 size={16} className="animate-spin text-zinc-500" />}
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
        <div className="font-mono text-2xl font-bold text-white tabular-nums tracking-wider bg-[#111113] border border-white/[0.07] rounded-xl px-5 py-2.5 flex items-center gap-2">
          <Clock size={18} className="text-emerald-400" />
          {liveTime}
        </div>
      </div>

      {/* ── NOTIFICATION MESSAGE ── */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* ── STATS ROW: Streak + Punctuality + All-time ── */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Streak */}
          <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-orange-400">
              <Flame size={18} />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Current Streak</span>
            </div>
            <div className="text-3xl font-black text-white tabular-nums">{stats.currentStreak}</div>
            <p className="text-xs text-zinc-600">consecutive days</p>
          </div>

          {/* Best Streak */}
          <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-yellow-400">
              <Trophy size={18} />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Best Streak</span>
            </div>
            <div className="text-3xl font-black text-white tabular-nums">{stats.bestStreak}</div>
            <p className="text-xs text-zinc-600">personal record</p>
          </div>

          {/* Punctuality */}
          <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Target size={18} />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Punctuality</span>
            </div>
            <div className={`text-3xl font-black tabular-nums ${punctualityColor(stats.punctualityPct)}`}>
              {stats.punctualityPct}%
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mt-1">
              <div
                className={`h-1.5 rounded-full bg-gradient-to-r ${punctualityBg(stats.punctualityPct)} transition-all duration-700`}
                style={{ width: `${stats.punctualityPct}%` }}
              />
            </div>
          </div>

          {/* Total Hours */}
          <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <Activity size={18} />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Total Hours</span>
            </div>
            <div className="text-3xl font-black text-white tabular-nums">
              {Math.floor(stats.totalHoursAllTime)}
              <span className="text-lg font-bold text-zinc-500">h</span>
            </div>
            <p className="text-xs text-zinc-600">all time logged</p>
          </div>
        </div>
      )}

      {/* ── MAIN ROW: Punch Card + Monthly Summary ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Punch Card */}
        <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-7 flex flex-col items-center gap-5">
          <div className="text-center">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2">Today&apos;s Attendance</p>
            {todayRecord ? (
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border capitalize ${statusBadge(todayRecord.status)}`}>
                {todayRecord.status.replace('_', ' ')}
              </span>
            ) : (
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border bg-zinc-700/20 text-zinc-500 border-zinc-700/30">
                Not Punched In
              </span>
            )}
          </div>

          {/* Punch Times */}
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider mb-1.5">Punch In</p>
              <p className="text-xl font-bold text-emerald-400">{formatTime(todayRecord?.punchIn ?? null)}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider mb-1.5">Punch Out</p>
              <p className="text-xl font-bold text-amber-400">{formatTime(todayRecord?.punchOut ?? null)}</p>
            </div>
          </div>

          {/* Worked hours bar */}
          {todayRecord?.totalHours ? (
            <div className="w-full space-y-2">
              <div className="flex justify-between items-center text-xs text-zinc-500">
                <span>Worked: <span className="text-white font-semibold">{formatHours(todayRecord.totalHours)}</span></span>
                <span>Target: 8h</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                  style={{ width: `${Math.min((todayRecord.totalHours / 8) * 100, 100)}%` }}
                />
              </div>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="w-full flex gap-3">
            {canPunchIn && (
              <button
                onClick={handlePunchIn}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-60 text-sm"
              >
                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                Punch In
              </button>
            )}
            {canPunchOut && (
              <button
                onClick={handlePunchOut}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-60 text-sm"
              >
                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Clock size={18} />}
                Punch Out
              </button>
            )}
            {isPunchedIn && isPunchedOut && (
              <div className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-emerald-500/10 text-emerald-400 font-bold rounded-xl border border-emerald-500/20 text-sm">
                <CheckCircle2 size={18} /> Day Complete ✓
              </div>
            )}
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base">This Month</h2>
            <span className="text-xs text-zinc-500 bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1">
              {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Present', value: summary?.present ?? 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/10' },
              { label: 'Late', value: summary?.late ?? 0, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/10' },
              { label: 'Half Day', value: summary?.half_day ?? 0, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/10' },
              { label: 'Absent', value: summary?.absent ?? 0, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/10' },
              { label: 'WFH', value: summary?.wfh ?? 0, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/10' },
              { label: 'Hours', value: `${summary?.totalHours ?? 0}h`, color: 'text-white', bg: 'bg-white/5 border-white/5' },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} border rounded-xl p-3.5`}>
                <p className="text-[10px] text-zinc-500 mb-1.5 uppercase font-bold tracking-wide">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <Link
            href="/employee/attendance"
            className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
          >
            View Full Attendance <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── 12-MONTH CHART ── */}
      {stats && stats.monthlyChart.length > 0 && (
        <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-emerald-400" />
            <h2 className="font-bold text-white text-base">12-Month Overview</h2>
          </div>
          <div className="flex items-end gap-2 h-28">
            {stats.monthlyChart.map((m, i) => {
              const total = m.present + m.late + m.absent;
              const pct = Math.round((total / chartMax) * 100);
              const presentPct = total > 0 ? Math.round((m.present / total) * 100) : 0;
              const latePct = total > 0 ? Math.round((m.late / total) * 100) : 0;
              const absentPct = total > 0 ? 100 - presentPct - latePct : 0;
              const monthShort = new Date(`${m.month}-01`).toLocaleDateString('en-IN', { month: 'short' });
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -translate-y-14 bg-zinc-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-white whitespace-nowrap pointer-events-none z-10 transition-opacity">
                    {m.present}P · {m.late}L · {m.absent}A · {Math.floor(m.hours)}h
                  </div>
                  {/* Stacked bar */}
                  <div
                    className="w-full rounded-t-md overflow-hidden bg-white/5 flex flex-col-reverse transition-all duration-700"
                    style={{ height: `${Math.max(pct, 4)}%`, minHeight: total > 0 ? '6px' : '3px' }}
                  >
                    {total > 0 && (
                      <>
                        <div className="bg-emerald-500" style={{ height: `${presentPct}%` }} />
                        <div className="bg-amber-400" style={{ height: `${latePct}%` }} />
                        <div className="bg-red-500" style={{ height: `${absentPct}%` }} />
                      </>
                    )}
                  </div>
                  <span className="text-[9px] text-zinc-600 font-medium">{monthShort}</span>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-5 mt-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />Present</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />Late</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />Absent</span>
          </div>
        </div>
      )}

      {/* ── ALL-TIME STATS ROW ── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Present', value: stats.totalPresent, color: 'text-emerald-400', icon: CheckCircle2 },
            { label: 'Total Late', value: stats.totalLate, color: 'text-amber-400', icon: AlertTriangle },
            { label: 'Half Days', value: stats.totalHalfDay, color: 'text-orange-400', icon: TrendingUp },
            { label: 'Total Absent', value: stats.totalAbsent, color: 'text-red-400', icon: XCircle },
          ].map((s) => (
            <div key={s.label} className="bg-[#111113] border border-white/[0.07] rounded-xl p-4 flex items-center gap-3">
              <s.icon size={22} className={s.color} />
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── RECENT ACTIVITY ── */}
      <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white text-base flex items-center gap-2">
            <CalendarDays size={17} className="text-zinc-400" />
            Recent Activity
          </h2>
          <Link href="/employee/attendance" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        {recentRecords.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-8">No attendance records yet.</p>
        ) : (
          <div className="space-y-2">
            {recentRecords.map((r) => {
              const isToday = r.date === todayIST;
              return (
                <div
                  key={r._id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                    isToday
                      ? 'bg-emerald-500/5 border-emerald-500/15'
                      : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-center w-10">
                      <p className="text-lg font-black text-white leading-none">
                        {new Date(`${r.date}T00:00:00+05:30`).getDate()}
                      </p>
                      <p className="text-[9px] text-zinc-600 uppercase font-bold">
                        {new Date(`${r.date}T00:00:00+05:30`).toLocaleDateString('en-IN', { month: 'short' })}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-white/[0.06]" />
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        {new Date(`${r.date}T00:00:00+05:30`).toLocaleDateString('en-IN', { weekday: 'long' })}
                        {isToday && <span className="ml-2 text-[10px] text-emerald-400 font-bold uppercase bg-emerald-400/10 px-1.5 py-0.5 rounded">Today</span>}
                      </p>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        {formatTime(r.punchIn)} → {formatTime(r.punchOut)}
                        {r.totalHours > 0 && (
                          <span className="ml-2 text-zinc-500">{formatHours(r.totalHours)}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border capitalize ${statusBadge(r.status)}`}>
                    {r.status.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── QUICK LINKS ── */}
      <div className="flex gap-3 flex-wrap pb-2">
        <Link
          href="/employee/attendance"
          className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.07] rounded-xl text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
        >
          <CalendarDays size={15} className="text-emerald-500" />
          View Full Attendance
        </Link>
        <Link
          href="/employee/attendance/corrections"
          className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.07] rounded-xl text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
        >
          <AlertTriangle size={15} className="text-amber-500" />
          Request Correction
        </Link>
      </div>
    </div>
  );
}

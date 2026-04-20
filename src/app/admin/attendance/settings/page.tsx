'use client';

import { useState, useEffect } from 'react';
import {
  Settings, Loader2, CheckCircle2, XCircle, Clock, Save,
  Info, Sun, Moon, AlarmClock, Timer, CalendarOff
} from 'lucide-react';

interface Config {
  defaultShiftStartHour: number;
  defaultShiftStartMinute: number;
  graceMinutes: number;
  absentThresholdHours: number;
  halfDayThresholdHours: number;
  fullDayMinHours: number;
  shiftEndHour: number;
  shiftEndMinute: number;
  earlyLeaveGraceMinutes: number;
  overtimeAfterHours: number;
  weekOffDays: number[];
  autoIncompleteEnabled: boolean;
  companyName: string;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad(n: number) { return String(n).padStart(2, '0'); }

function TimeDisplay({ h, m }: { h: number; m: number }) {
  const hour12 = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  return (
    <span className="text-emerald-400 font-mono font-bold">
      {pad(hour12)}:{pad(m)} {ampm}
    </span>
  );
}

export default function AdminAttendanceSettingsPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch('/api/admin/attendance-config')
      .then(r => r.json())
      .then(d => { if (d.config) setConfig(d.config); })
      .finally(() => setLoading(false));
  }, []);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const save = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/attendance-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        showMsg('Settings saved successfully!', 'success');
      } else {
        showMsg(data.message || 'Failed to save.', 'error');
      }
    } catch { showMsg('Network error.', 'error'); }
    finally { setSaving(false); }
  };

  const toggleWeekOff = (day: number) => {
    if (!config) return;
    const days = config.weekOffDays.includes(day)
      ? config.weekOffDays.filter(d => d !== day)
      : [...config.weekOffDays, day];
    setConfig({ ...config, weekOffDays: days });
  };

  const inputClass = "bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/40 transition-colors w-full";
  const labelClass = "text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-blue-400" />
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Settings size={22} className="text-blue-400" /> Attendance Settings
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Configure global attendance rules. Changes affect all employees immediately.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-blue-600/20 disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Save Changes
        </button>
      </div>

      {/* Toast */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* Live Preview */}
      <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/5 border border-blue-500/20 rounded-2xl p-5">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Live Preview</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-zinc-500 text-xs mb-0.5">Shift Start</p>
            <TimeDisplay h={config.defaultShiftStartHour} m={config.defaultShiftStartMinute} />
          </div>
          <div>
            <p className="text-zinc-500 text-xs mb-0.5">Late After</p>
            <span className="text-amber-400 font-mono font-bold">
              {pad(config.defaultShiftStartHour)}:{pad(config.defaultShiftStartMinute)}
              {' + '}{config.graceMinutes}m
            </span>
          </div>
          <div>
            <p className="text-zinc-500 text-xs mb-0.5">Shift End</p>
            <TimeDisplay h={config.shiftEndHour} m={config.shiftEndMinute} />
          </div>
          <div>
            <p className="text-zinc-500 text-xs mb-0.5">Week Off</p>
            <span className="text-purple-400 font-semibold">
              {config.weekOffDays.map(d => DAY_LABELS[d]).join(', ') || 'None'}
            </span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-zinc-500 text-xs mb-0.5">Mark Absent if &lt;</p>
            <span className="text-red-400 font-mono font-bold">{config.absentThresholdHours}h</span>
          </div>
          <div>
            <p className="text-zinc-500 text-xs mb-0.5">Half Day if &lt;</p>
            <span className="text-orange-400 font-mono font-bold">{config.halfDayThresholdHours}h</span>
          </div>
          <div>
            <p className="text-zinc-500 text-xs mb-0.5">Full Day needs</p>
            <span className="text-emerald-400 font-mono font-bold">{config.fullDayMinHours}h</span>
          </div>
          <div>
            <p className="text-zinc-500 text-xs mb-0.5">Overtime after</p>
            <span className="text-blue-400 font-mono font-bold">{config.overtimeAfterHours}h</span>
          </div>
        </div>
      </div>

      {/* Section: Shift Timing */}
      <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Sun size={16} className="text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Shift Timing</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Start Hour (0–23)</label>
            <input type="number" min={0} max={23} value={config.defaultShiftStartHour}
              onChange={e => setConfig({ ...config, defaultShiftStartHour: +e.target.value })}
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Start Minute (0–59)</label>
            <input type="number" min={0} max={59} value={config.defaultShiftStartMinute}
              onChange={e => setConfig({ ...config, defaultShiftStartMinute: +e.target.value })}
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>End Hour (0–23)</label>
            <input type="number" min={0} max={23} value={config.shiftEndHour}
              onChange={e => setConfig({ ...config, shiftEndHour: +e.target.value })}
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>End Minute (0–59)</label>
            <input type="number" min={0} max={59} value={config.shiftEndMinute}
              onChange={e => setConfig({ ...config, shiftEndMinute: +e.target.value })}
              className={inputClass} />
          </div>
        </div>
      </div>

      {/* Section: Grace & Thresholds */}
      <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <AlarmClock size={16} className="text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Grace & Thresholds</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Grace Minutes (late buffer)</label>
            <input type="number" min={0} max={120} value={config.graceMinutes}
              onChange={e => setConfig({ ...config, graceMinutes: +e.target.value })}
              className={inputClass} />
            <p className="text-xs text-zinc-600 mt-1">Minutes after shift start before "Late" kicks in</p>
          </div>
          <div>
            <label className={labelClass}>Early Leave Grace (min)</label>
            <input type="number" min={0} max={120} value={config.earlyLeaveGraceMinutes}
              onChange={e => setConfig({ ...config, earlyLeaveGraceMinutes: +e.target.value })}
              className={inputClass} />
            <p className="text-xs text-zinc-600 mt-1">Minutes before shift end — still allowed</p>
          </div>
          <div>
            <label className={labelClass}>Overtime Starts After (hrs)</label>
            <input type="number" min={1} max={24} step={0.5} value={config.overtimeAfterHours}
              onChange={e => setConfig({ ...config, overtimeAfterHours: +e.target.value })}
              className={inputClass} />
            <p className="text-xs text-zinc-600 mt-1">Hours beyond which overtime is noted</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Absent if work &lt; (hrs)</label>
            <input type="number" min={0} max={8} step={0.5} value={config.absentThresholdHours}
              onChange={e => setConfig({ ...config, absentThresholdHours: +e.target.value })}
              className={inputClass} />
            <p className="text-xs text-zinc-600 mt-1">Too few hours → marked Absent</p>
          </div>
          <div>
            <label className={labelClass}>Half Day if work &lt; (hrs)</label>
            <input type="number" min={0} max={12} step={0.5} value={config.halfDayThresholdHours}
              onChange={e => setConfig({ ...config, halfDayThresholdHours: +e.target.value })}
              className={inputClass} />
            <p className="text-xs text-zinc-600 mt-1">Below this → Half Day</p>
          </div>
          <div>
            <label className={labelClass}>Full Day min (hrs)</label>
            <input type="number" min={1} max={12} step={0.5} value={config.fullDayMinHours}
              onChange={e => setConfig({ ...config, fullDayMinHours: +e.target.value })}
              className={inputClass} />
            <p className="text-xs text-zinc-600 mt-1">Target hours for a full working day</p>
          </div>
        </div>
      </div>

      {/* Section: Week Off Days */}
      <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <CalendarOff size={16} className="text-purple-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Week Off Days</h2>
        </div>
        <p className="text-xs text-zinc-500">
          These days will not count as absent. Punch-in is blocked on week-off days.
        </p>
        <div className="flex flex-wrap gap-2">
          {DAY_LABELS.map((day, idx) => (
            <button
              key={idx}
              onClick={() => toggleWeekOff(idx)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${config.weekOffDays.includes(idx)
                ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                : 'bg-white/[0.03] border-white/10 text-zinc-500 hover:text-zinc-200'
                }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Section: Automation */}
      <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Timer size={16} className="text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Automation</h2>
        </div>
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={config.autoIncompleteEnabled}
              onChange={e => setConfig({ ...config, autoIncompleteEnabled: e.target.checked })}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${config.autoIncompleteEnabled ? 'bg-blue-600' : 'bg-zinc-700'}`} />
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${config.autoIncompleteEnabled ? 'translate-x-5' : ''}`} />
          </div>
          <div>
            <p className="text-sm text-zinc-200 font-medium">Auto-mark Incomplete</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              If an employee punches in but misses punch-out, automatically mark as "Incomplete" at end of day.
            </p>
          </div>
        </label>
      </div>

      {/* Save Button (bottom) */}
      <div className="flex justify-end pb-4">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-blue-600/20 disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Save All Settings
        </button>
      </div>
    </div>
  );
}

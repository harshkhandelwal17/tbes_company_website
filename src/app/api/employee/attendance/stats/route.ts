import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import Employee from '@/models/Employee';
import { verifyEmployee } from '@/lib/auth';

/**
 * GET /api/employee/attendance/stats
 * Returns: current streak, best streak, this month summary,
 * all-time totals, punctuality %, and last 12 months bar chart data.
 */
export async function GET() {
  try {
    const payload = await verifyEmployee();
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const employee = await Employee.findById(payload.id).select('-password');
    if (!employee) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    // All records sorted ascending
    const allRecords = await Attendance.find({ employee: payload.id })
      .sort({ date: 1 })
      .lean();

    // --- Current streak (consecutive present/late/wfh days ending today or yesterday) ---
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    const goodStatuses = new Set(['present', 'late', 'wfh']);

    // Build a date→status map
    const dateMap = new Map<string, string>();
    for (const r of allRecords) {
      dateMap.set(r.date as string, r.status as string);
    }

    // Calculate streaks on sorted dates
    const sortedDates = Array.from(dateMap.keys()).sort();
    for (const d of sortedDates) {
      const s = dateMap.get(d)!;
      if (goodStatuses.has(s)) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else if (s !== 'weekend' && s !== 'holiday') {
        tempStreak = 0;
      }
      // weekends/holidays don't break streak
    }

    // Current streak = how many consecutive good days ending at latest record
    currentStreak = 0;
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const s = dateMap.get(sortedDates[i])!;
      if (s === 'weekend' || s === 'holiday') continue;
      if (goodStatuses.has(s)) {
        currentStreak++;
      } else {
        break;
      }
    }

    // --- All-time totals ---
    let totalPresent = 0, totalLate = 0, totalHalfDay = 0, totalAbsent = 0;
    let totalHoursAllTime = 0;
    for (const r of allRecords) {
      if (r.status === 'present') totalPresent++;
      else if (r.status === 'late') totalLate++;
      else if (r.status === 'half_day') totalHalfDay++;
      else if (r.status === 'absent') totalAbsent++;
      totalHoursAllTime += (r.totalHours as number) || 0;
    }

    // --- This month ---
    const thisMonth = today.slice(0, 7);
    const monthRecords = allRecords.filter((r) => (r.date as string).startsWith(thisMonth));
    const monthSummary = { present: 0, late: 0, half_day: 0, absent: 0, incomplete: 0, wfh: 0, totalHours: 0 };
    for (const r of monthRecords) {
      const s = r.status as keyof typeof monthSummary;
      if (s in monthSummary && s !== 'totalHours') (monthSummary as Record<string, number>)[s]++;
      monthSummary.totalHours += (r.totalHours as number) || 0;
    }
    monthSummary.totalHours = Math.round(monthSummary.totalHours * 100) / 100;

    // --- Punctuality % (present / total working days) ---
    const workingDays = totalPresent + totalLate + totalHalfDay + totalAbsent;
    const punctualityPct = workingDays > 0
      ? Math.round((totalPresent / workingDays) * 100)
      : 0;

    // --- Last 12 months chart data ---
    const monthlyChart = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const recs = allRecords.filter((r) => (r.date as string).startsWith(key));
      const present = recs.filter((r) => r.status === 'present' || r.status === 'wfh').length;
      const late = recs.filter((r) => r.status === 'late').length;
      const absent = recs.filter((r) => r.status === 'absent').length;
      const hours = recs.reduce((s, r) => s + ((r.totalHours as number) || 0), 0);
      monthlyChart.push({
        month: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
        present,
        late,
        absent,
        hours: Math.round(hours * 10) / 10,
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        currentStreak,
        bestStreak,
        totalPresent,
        totalLate,
        totalHalfDay,
        totalAbsent,
        totalHoursAllTime: Math.round(totalHoursAllTime * 10) / 10,
        punctualityPct,
        monthSummary,
        monthlyChart,
        joiningDate: employee.joiningDate,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

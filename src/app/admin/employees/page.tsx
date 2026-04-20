'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users, Plus, Search, X, Loader2,
  CheckCircle2, XCircle, Pencil, UserX, UserCheck,
  ChevronDown, Shield, Mail, Phone, Briefcase, Building2,
  Calendar, Eye, EyeOff
} from 'lucide-react';

interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  role: string;
  status: string;
  joiningDate: string;
  shiftStartHour: number;
  shiftStartMinute: number;
  graceMinutes: number;
}

const STATUS_CLASS: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  inactive: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  terminated: 'bg-red-500/15 text-red-400 border-red-500/20',
};

const ROLE_LABELS: Record<string, string> = {
  employee: 'Employee',
  team_lead: 'Team Lead',
  hr_admin: 'HR Admin',
};

const BLANK_FORM = {
  name: '', email: '', password: '', phone: '',
  designation: '', department: '', role: 'employee',
  joiningDate: new Date().toISOString().slice(0, 10),
  shiftStartHour: 9, shiftStartMinute: 0, graceMinutes: 15,
};

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form modal
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...BLANK_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/admin/employees?${params}`);
      const data = await res.json();
      if (data.employees) setEmployees(data.employees);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...BLANK_FORM });
    setShowPassword(false);
    setShowForm(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingId(emp._id);
    setForm({
      name: emp.name,
      email: emp.email,
      password: '',
      phone: emp.phone || '',
      designation: emp.designation || '',
      department: emp.department || '',
      role: emp.role,
      joiningDate: emp.joiningDate ? emp.joiningDate.slice(0, 10) : '',
      shiftStartHour: emp.shiftStartHour,
      shiftStartMinute: emp.shiftStartMinute,
      graceMinutes: emp.graceMinutes,
    });
    setShowPassword(false);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingId ? `/api/admin/employees/${editingId}` : '/api/admin/employees';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showMsg(editingId ? 'Employee updated successfully.' : 'Employee created successfully.', 'success');
        setShowForm(false);
        await fetchEmployees();
      } else {
        showMsg(data.message, 'error');
      }
    } catch {
      showMsg('Something went wrong.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const confirmed = newStatus === 'terminated'
      ? confirm('Are you sure you want to terminate this employee?')
      : true;
    if (!confirmed) return;

    try {
      if (newStatus === 'terminated') {
        const res = await fetch(`/api/admin/employees/${id}`, { method: 'DELETE' });
        const data = await res.json();
        showMsg(data.message || 'Status updated.', data.success ? 'success' : 'error');
      } else {
        const res = await fetch(`/api/admin/employees/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        const data = await res.json();
        showMsg('Status updated.', data.success ? 'success' : 'error');
      }
      await fetchEmployees();
    } catch {
      showMsg('Failed to update status.', 'error');
    }
  };

  const inputClass = "w-full bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors text-sm";
  const labelClass = "text-xs font-bold text-zinc-500 uppercase tracking-widest";

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users size={22} className="text-blue-400" /> Employees
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage employee accounts, shift settings, and access levels.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-blue-600/20"
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Toast */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${message.type === 'success'
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, email, ID, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111113] border border-white/[0.07] rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#111113] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/30 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>

      {/* Employee Table */}
      <div className="bg-[#111113] border border-white/[0.07] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 size={28} className="animate-spin text-blue-400" />
          </div>
        ) : employees.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={40} className="mx-auto mb-3 text-zinc-700" />
            <p className="text-zinc-500">No employees found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Employee', 'Department', 'Shift', 'Role', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-[10px] text-zinc-500 uppercase font-bold tracking-widest px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-zinc-200">{emp.name}</p>
                        <p className="text-xs text-zinc-500">{emp.employeeId} · {emp.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-zinc-300">{emp.designation || '—'}</p>
                      <p className="text-xs text-zinc-500">{emp.department || '—'}</p>
                    </td>
                    <td className="px-4 py-4 text-zinc-400 text-xs">
                      {String(emp.shiftStartHour).padStart(2, '0')}:
                      {String(emp.shiftStartMinute).padStart(2, '0')} +{emp.graceMinutes}m
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-zinc-400">{ROLE_LABELS[emp.role] || emp.role}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${STATUS_CLASS[emp.status] || ''}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(emp)}
                          className="p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        {emp.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(emp._id, 'inactive')}
                            className="p-1.5 text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                            title="Deactivate"
                          >
                            <UserX size={15} />
                          </button>
                        ) : emp.status === 'inactive' ? (
                          <button
                            onClick={() => handleStatusChange(emp._id, 'active')}
                            className="p-1.5 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="Activate"
                          >
                            <UserCheck size={15} />
                          </button>
                        ) : null}
                        {emp.status !== 'terminated' && (
                          <button
                            onClick={() => handleStatusChange(emp._id, 'terminated')}
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Terminate"
                          >
                            <X size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl my-4">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <h2 className="font-bold text-white text-lg">
                {editingId ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Rahul Sharma"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Work Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required={!editingId}
                    disabled={!!editingId}
                    placeholder="rahul@tbesglobal.com"
                    className={`${inputClass} ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Password {editingId && <span className="text-zinc-600 normal-case">(leave blank to keep current)</span>}
                  {!editingId && ' *'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required={!editingId}
                    minLength={editingId ? undefined : 6}
                    placeholder="Min 6 characters"
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Row 2: Phone + Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Designation</label>
                  <input
                    type="text"
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    placeholder="Software Developer"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Row 3: Department + Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Department</label>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    placeholder="Technology"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className={inputClass}
                  >
                    <option value="employee">Employee</option>
                    <option value="team_lead">Team Lead</option>
                    <option value="hr_admin">HR Admin</option>
                  </select>
                </div>
              </div>

              {/* Joining Date */}
              <div className="space-y-1.5">
                <label className={labelClass}>Joining Date</label>
                <input
                  type="date"
                  value={form.joiningDate}
                  onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Shift Settings */}
              <div className="border border-white/[0.06] rounded-xl p-4 space-y-4">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Shift Configuration</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelClass}>Start Hour</label>
                    <input
                      type="number" min={0} max={23}
                      value={form.shiftStartHour}
                      onChange={(e) => setForm({ ...form, shiftStartHour: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Start Minute</label>
                    <input
                      type="number" min={0} max={59}
                      value={form.shiftStartMinute}
                      onChange={(e) => setForm({ ...form, shiftStartMinute: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Grace (min)</label>
                    <input
                      type="number" min={0} max={60}
                      value={form.graceMinutes}
                      onChange={(e) => setForm({ ...form, graceMinutes: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                </div>
                <p className="text-xs text-zinc-600">
                  E.g. Hour=9, Minute=0, Grace=15 → shift at 09:00, late after 09:15
                </p>
              </div>

              {/* Submit */}
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
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all text-sm disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  {editingId ? 'Save Changes' : 'Create Employee'}
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

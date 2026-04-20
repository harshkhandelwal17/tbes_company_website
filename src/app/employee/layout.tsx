'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Clock, FileText, LogOut,
  Menu, X, UserCircle2, ChevronRight, Building2
} from 'lucide-react';

interface EmployeeInfo {
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  role: string;
}

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [employee, setEmployee] = useState<EmployeeInfo | null>(null);

  useEffect(() => {
    fetch('/api/employee/auth/me')
      .then((r) => r.json())
      .then((d) => { if (d.employee) setEmployee(d.employee); })
      .catch(() => {});
  }, []);

  // Close sidebar on route change
  useEffect(() => { setIsSidebarOpen(false); }, [pathname]);

  if (pathname === '/employee/login') {
    return (
      <div className="min-h-screen bg-[#05080F] flex items-center justify-center">
        {children}
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch('/api/employee/auth/logout', { method: 'POST' });
    router.push('/employee/login');
  };

  const navGroups = [
    {
      label: 'Overview',
      items: [
        { name: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Attendance',
      items: [
        { name: 'Punch In / Out', href: '/employee/attendance', icon: Clock },
        { name: 'Correction Requests', href: '/employee/attendance/corrections', icon: FileText },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] flex font-sans selection:bg-emerald-500/30">

      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`fixed md:static top-0 left-0 bottom-0 z-50 w-72 bg-[#09090b] border-r border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-white font-bold text-base tracking-wide">TBES Employee</h2>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Staff Portal</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="ml-auto md:hidden text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              <h3 className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03]'}`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      )}
                      <Icon
                        size={18}
                        className={`transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      <span className={`text-sm font-medium ${isActive ? 'translate-x-1' : ''} transition-transform`}>
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Profile Footer */}
        <div className="p-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-9 h-9 rounded-full bg-emerald-900/40 border border-emerald-500/20 flex items-center justify-center">
              <UserCircle2 size={20} className="text-emerald-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-zinc-200 truncate">{employee?.name || '...'}</p>
              <p className="text-xs text-zinc-500 truncate">{employee?.employeeId || ''} · {employee?.designation || ''}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-zinc-500 hover:text-red-400 transition-colors p-1"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#0c0c0e]">

        {/* Header */}
        <header className="h-20 border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg md:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-zinc-500">Employee</span>
              <ChevronRight size={14} className="text-zinc-700" />
              <span className="text-zinc-200 font-medium capitalize">
                {pathname === '/employee/dashboard'
                  ? 'Dashboard'
                  : pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ')}
              </span>
            </div>
          </div>

          {/* Today's Date */}
          <div className="text-xs text-zinc-500 hidden sm:block">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

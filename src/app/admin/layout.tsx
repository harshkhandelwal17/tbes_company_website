'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Briefcase, FolderKanban, MessageSquare, 
  FileText, LogOut, Menu, X, Search, 
  ChevronRight, ShieldCheck
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on mobile route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-black flex items-center justify-center">{children}</div>;
  }

  // --- Navigation Config (Settings Removed) ---
  const menuGroups = [
    {
      label: "Overview",
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      ]
    },
    {
      label: "Management",
      items: [
        { name: 'Jobs & Career', href: '/admin/career', icon: Briefcase },
        { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
        { name: 'Inquiries', href: '/admin/contacts', icon: MessageSquare },
        { name: 'Applications', href: '/admin/applications', icon: FileText },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] flex font-sans selection:bg-blue-500/30">
      
      {/* =================================================
          1. MOBILE SIDEBAR DRAWER
      ================================================= */}
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed md:static top-0 left-0 bottom-0 z-50 w-72 bg-[#09090b] border-r border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* --- BRAND HEADER --- */}
        <div className="h-20 flex items-center px-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-white font-bold text-base tracking-wide">TBES Admin</h2>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Control Center</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="ml-auto md:hidden text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* --- NAVIGATION LINKS --- */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive 
                          ? 'bg-blue-600/10 text-blue-400' 
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03]'
                      }`}
                    >
                      {/* Active Left Border Accent */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                      )}
                      
                      <Icon 
                        size={18} 
                        className={`transition-colors ${isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} 
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

        {/* --- USER PROFILE (Footer) --- */}
        <div className="p-4 border-t border-white/[0.08] bg-[#09090b]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] transition-colors group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
              <span className="text-xs font-bold text-zinc-300">AD</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-zinc-200 truncate">Administrator</p>
              <p className="text-xs text-zinc-500 truncate">Super Access</p>
            </div>
            <Link href="/admin/logout" className="text-zinc-500 hover:text-red-400 transition-colors p-1">
              <LogOut size={16} />
            </Link>
          </div>
        </div>
      </aside>

      {/* =================================================
          2. MAIN CONTENT AREA
      ================================================= */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#0c0c0e]">
        
        {/* --- HEADER (Notifications Removed) --- */}
        <header className="h-20 border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg md:hidden"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb / Title */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-zinc-500">Admin</span>
              <ChevronRight size={14} className="text-zinc-700" />
              <span className="text-zinc-200 font-medium capitalize">
                {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center relative group">
              <Search size={16} className="absolute left-3 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-64 bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>
        </header>

        {/* --- PAGE CONTENT (Scrollable) --- */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>

      </main>
    </div>
  );
}
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  Briefcase, FileText, Image as ImageIcon, Mail, 
  ArrowRight, Activity, Calendar, RefreshCcw, 
  Users, CheckCircle, TrendingUp
} from 'lucide-react';

interface Stats {
  jobs: number;
  applications: number;
  projects: number;
  contacts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    jobs: 0,
    applications: 0,
    projects: 0,
    contacts: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get Current Date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Fetch Data Function
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data && !data.error) {
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handle Refresh Click
  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  // Configuration for Stats Cards
  const statCards = [
    {
      title: 'Total Applications',
      value: stats.applications,
      icon: FileText,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'hover:border-blue-500/50',
      link: '/admin/applications',
      desc: 'Candidates reviewed'
    },
    {
      title: 'Active Jobs',
      value: stats.jobs,
      icon: Briefcase,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'hover:border-emerald-500/50',
      link: '/admin/career',
      desc: 'Open positions'
    },
    {
      title: 'Projects Showcase',
      value: stats.projects,
      icon: ImageIcon,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'hover:border-purple-500/50',
      link: '/admin/projects',
      desc: 'Portfolio items'
    },
    {
      title: 'Inquiries',
      value: stats.contacts,
      icon: Mail,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'hover:border-orange-500/50',
      link: '/admin/contacts',
      desc: 'Messages received'
    }
  ];

  // Loading State (Skeleton)
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse max-w-7xl mx-auto">
        <div className="h-20 bg-zinc-900 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-zinc-900 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="h-64 bg-zinc-900 rounded-2xl"></div>
           <div className="h-64 bg-zinc-900 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* =======================
          1. HEADER SECTION
      ======================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-zinc-400 mt-1 flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-zinc-500" /> {today}
          </p>
        </div>
        
        {/* Working Action Button */}
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 text-white text-sm font-medium rounded-xl hover:bg-zinc-700 transition-all border border-zinc-700 disabled:opacity-50"
        >
           <RefreshCcw size={16} className={refreshing ? "animate-spin" : ""} />
           {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* =======================
          2. STATS OVERVIEW
      ======================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link
            href={card.link}
            key={index}
            className={`relative group p-6 rounded-3xl bg-[#09090b] border border-white/[0.08] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${card.border}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${card.bg} ${card.color} shadow-lg`}>
                <card.icon size={24} />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                 <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </div>
            </div>
            
            <div>
               <h3 className="text-4xl font-bold text-white mb-1">{card.value}</h3>
               <p className="text-sm text-zinc-400 font-medium">{card.title}</p>
               <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{card.desc}</span>
               </div>
            </div>
          </Link>
        ))}
      </div>

      {/* =======================
          3. MANAGEMENT MODULES
      ======================== */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
           <Activity size={20} className="text-blue-500" /> Management Modules
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Module 1: Recruitment */}
          <div className="bg-[#09090b] rounded-3xl border border-white/[0.08] p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-32 bg-blue-600/5 blur-[80px] rounded-full group-hover:bg-blue-600/10 transition-colors"></div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <Users size={20} />
                   </div>
                   <h3 className="text-lg font-bold text-white">Recruitment</h3>
                </div>
                
                <div className="space-y-3">
                   <Link href="/admin/career" className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] hover:border-blue-500/30 transition-all group/item">
                      <span className="text-zinc-300 text-sm font-medium">Manage Jobs</span>
                      <ArrowRight size={16} className="text-zinc-500 group-hover/item:text-blue-400 group-hover/item:translate-x-1 transition-all" />
                   </Link>
                   <Link href="/admin/applications" className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] hover:border-blue-500/30 transition-all group/item">
                      <span className="text-zinc-300 text-sm font-medium">View Applications</span>
                      <ArrowRight size={16} className="text-zinc-500 group-hover/item:text-blue-400 group-hover/item:translate-x-1 transition-all" />
                   </Link>
                </div>
             </div>
          </div>

          {/* Module 2: Content & Inquiries */}
          <div className="bg-[#09090b] rounded-3xl border border-white/[0.08] p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-32 bg-purple-600/5 blur-[80px] rounded-full group-hover:bg-purple-600/10 transition-colors"></div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                      <TrendingUp size={20} />
                   </div>
                   <h3 className="text-lg font-bold text-white">Content & Growth</h3>
                </div>
                
                <div className="space-y-3">
                   <Link href="/admin/projects" className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] hover:border-purple-500/30 transition-all group/item">
                      <span className="text-zinc-300 text-sm font-medium">Manage Projects</span>
                      <ArrowRight size={16} className="text-zinc-500 group-hover/item:text-purple-400 group-hover/item:translate-x-1 transition-all" />
                   </Link>
                   <Link href="/admin/contacts" className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] hover:border-purple-500/30 transition-all group/item">
                      <span className="text-zinc-300 text-sm font-medium">Client Inquiries</span>
                      <ArrowRight size={16} className="text-zinc-500 group-hover/item:text-purple-400 group-hover/item:translate-x-1 transition-all" />
                   </Link>
                </div>
             </div>
          </div>

        </div>
      </div>

    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

export default function EmployeeLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/employee/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/employee/dashboard');
        router.refresh();
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#05080F] relative overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.05]" />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 mb-4">
            <Building2 size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Employee Portal</h1>
          <p className="text-zinc-500 text-sm mt-2">Sign in to access your attendance panel</p>
        </div>

        <div className="bg-[#09090b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Work Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 transition-all"
                  type="email"
                  placeholder="you@tbesglobal.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 transition-all"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Signing In...</>
              ) : (
                <> Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-6">
          Contact your admin if you forgot your password.
        </p>
      </div>
    </div>
  );
}

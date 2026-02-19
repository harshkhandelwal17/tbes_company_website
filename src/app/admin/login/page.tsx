'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Lock, Mail, Loader2, ArrowRight } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post('/api/admin/login', { email, password })
      if (res.data.success) {
        router.push('/admin')
        router.refresh() 
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access denied. Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#05080F] relative overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* =======================
          1. BACKGROUND EFFECTS
      ======================== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.05]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* =======================
          2. LOGIN CARD
      ======================== */}
      <div className="relative z-10 w-full max-w-md p-6">
        
        {/* Brand Logo / Icon */}
        <div className="flex flex-col items-center mb-8">
           <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 mb-4 animate-in zoom-in duration-500">
              <ShieldCheck size={32} />
           </div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Admin Access</h1>
           <p className="text-zinc-500 text-sm mt-2">Enter your credentials to continue</p>
        </div>

        <div className="bg-[#09090b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-in slide-in-from-top-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                 {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all"
                  type="email"
                  placeholder="admin@tbesglobal.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <> <Loader2 size={20} className="animate-spin" /> Verifying... </>
              ) : (
                <> Sign In <ArrowRight size={20} /> </>
              )}
            </button>

          </form>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-zinc-600 mt-8">
           Protected Area. Authorized Personnel Only. <br />
           &copy; {new Date().getFullYear()} TBES Global.
        </p>

      </div>
    </div>
  )
}
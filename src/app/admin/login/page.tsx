'use client'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: any) => {
    e.preventDefault()
    try {
      await axios.post('/api/admin/login', { email, password })
      router.push('/admin') // Redirect after login
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleLogin} className="p-4 max-w-sm mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <input
        className="w-full border p-2 mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white w-full p-2">Login</button>
    </form>
  )
}

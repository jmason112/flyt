'use client'
import React, { useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      window.location.href = '/'
    } catch {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm">Email</span>
          <input className="mt-1 w-full rounded border p-2" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input className="mt-1 w-full rounded border p-2" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </label>
        {error && <p role="alert" className="text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-60">{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </main>
  )
}

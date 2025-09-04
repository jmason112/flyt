'use client'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@/lib/api/types'
import { api } from '@/lib/api/client'
import { tokenStore } from '@/lib/api/tokenStore'

type AuthState = {
  user: User | null
  accessToken: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    const t = tokenStore.get()
    if (t) setAccessToken(t)
  }, [])

  const value = useMemo<AuthState>(() => {
    return {
      user,
      accessToken,
      async login(email, password) {
        const res = await api.login({ email, password })
        setUser(res.user)
        setAccessToken(res.accessToken)
      },
      async register(name, email, password) {
        const res = await api.register({ name, email, password })
        setUser(res.user)
        setAccessToken(res.accessToken)
      },
      async logout() {
        await api.logout()
        setUser(null)
        setAccessToken(null)
      },
    }
  }, [user, accessToken])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

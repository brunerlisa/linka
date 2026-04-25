'use client'

import { createContext, useContext, useEffect } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
import { syncProfile } from '@/lib/tradingAdminApi'

const AuthContext = createContext({
  user: null,
  profile: null,
  isAdmin: false,
  signOut: async () => {},
  loading: true,
})

export function AuthProvider({ children }) {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  useEffect(() => {
    if (!isLoaded || !user) return
    syncProfile({
      email: user.primaryEmailAddress?.emailAddress || '',
      full_name: user.fullName || user.username || '',
      role: (user.publicMetadata?.role || 'user').toString().toLowerCase(),
    }).catch(() => {})
  }, [isLoaded, user])

  const normalizedUser = user
    ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        fullName: user.fullName || user.username || '',
        role: (user.publicMetadata?.role || 'user').toString().toLowerCase(),
        hasOnboarded: user.unsafeMetadata?.has_onboarded === true,
      }
    : null

  const profile = normalizedUser
    ? { id: normalizedUser.id, email: normalizedUser.email, full_name: normalizedUser.fullName, role: normalizedUser.role }
    : null

  return (
    <AuthContext.Provider
      value={{
        user: normalizedUser,
        profile,
        isAdmin: profile?.role === 'admin',
        loading: !isLoaded,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

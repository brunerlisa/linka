import { createContext, useContext, useEffect } from 'react'
import { useAuth as useClerkAuth, useClerk, useUser } from '@clerk/react'
import { supabase, setSupabaseAccessTokenProvider } from '../lib/supabaseClient'

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  isAdmin: false,
  signOut: async () => {},
  loading: true,
})

export function AuthProvider({ children }) {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const { getToken, isSignedIn } = useClerkAuth()

  useEffect(() => {
    const template = import.meta.env.VITE_CLERK_SUPABASE_JWT_TEMPLATE || 'supabase'
    setSupabaseAccessTokenProvider(async () => {
      if (!isSignedIn) return null
      return getToken({ template })
    })
    return () => {
      setSupabaseAccessTokenProvider(async () => null)
    }
  }, [getToken, isSignedIn])

  useEffect(() => {
    if (!isLoaded || !user) return
    async function syncProfile() {
      const payload = {
        clerk_user_id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        full_name: user.fullName || user.username || '',
        role: (user.publicMetadata?.role || 'user').toString().toLowerCase(),
      }
      await supabase.from('profiles').upsert(payload, { onConflict: 'clerk_user_id' })
    }
    syncProfile()
  }, [isLoaded, user])

  const normalizedUser = user
    ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        fullName: user.fullName || user.username || '',
        role: (user.publicMetadata?.role || 'user').toString().toLowerCase(),
      }
    : null

  const profile = normalizedUser
    ? {
        id: normalizedUser.id,
        email: normalizedUser.email,
        full_name: normalizedUser.fullName,
        role: normalizedUser.role,
      }
    : null

  return (
    <AuthContext.Provider
      value={{
        user: normalizedUser,
        session: normalizedUser ? { user: normalizedUser } : null,
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


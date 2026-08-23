'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getMyProfile, syncProfile } from '@/lib/tradingAdminApi'

const AuthContext = createContext({
  user: null,
  profile: null,
  isAdmin: false,
  signOut: async () => {},
  markOnboarded: () => {},
  loading: true,
  signingOut: false,
})

function toAppUser(authUser, profile) {
  const role = (profile?.role || 'user').toString().toLowerCase()
  return {
    id: authUser.id,
    email: authUser.email || profile?.email || '',
    fullName: profile?.full_name || authUser.user_metadata?.full_name || '',
    role,
    hasOnboarded: Boolean(profile?.has_onboarded),
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    let mounted = true

    async function hydrate(authUser, shouldSync) {
      if (!authUser) {
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
        return
      }

      const nextUser = toAppUser(authUser, null)
      if (mounted) {
        setUser(nextUser)
        setLoading(false)
      }

      let profile = null
      try {
        profile = await getMyProfile()
      } catch {
        profile = null
      }

      if (mounted && profile) {
        setUser(toAppUser(authUser, profile))
      }

      if (shouldSync) {
        syncProfile({
          email: nextUser.email,
          full_name: profile?.full_name || nextUser.fullName,
        })
          .then((updated) => {
            if (!mounted || !updated) return
            setUser((prev) =>
              prev
                ? {
                    ...prev,
                    role: String(updated.role || prev.role).toLowerCase(),
                    hasOnboarded: Boolean(updated.has_onboarded || prev.hasOnboarded),
                    fullName: updated.full_name || prev.fullName,
                  }
                : prev
            )
          })
          .catch(() => {})
      }
    }

    supabase.auth.getUser().then(({ data }) => hydrate(data?.user || null, true))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') return
      hydrate(session?.user || null, event === 'SIGNED_IN')
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const markOnboarded = useCallback(() => {
    setUser((prev) => {
      if (!prev || prev.hasOnboarded) return prev
      return { ...prev, hasOnboarded: true }
    })
  }, [])

  const signOut = async () => {
    setSigningOut(true)
    const supabase = createClient()
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    window.location.assign('/')
  }

  const profile = user
    ? { id: user.id, email: user.email, full_name: user.fullName, role: user.role }
    : null

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin: user?.role === 'admin',
        loading,
        signingOut,
        signOut,
        markOnboarded,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

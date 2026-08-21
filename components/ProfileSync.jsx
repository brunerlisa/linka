'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { syncProfile } from '@/lib/tradingAdminApi'

/** Syncs the signed-in user to the profiles table on mount. */
export default function ProfileSync() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading || !user) return
    syncProfile({
      email: user.email || '',
      full_name: user.fullName || '',
    }).catch(() => {})
  }, [loading, user])

  return null
}

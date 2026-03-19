'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { syncProfile } from '@/lib/tradingAdminApi'

/** Syncs Clerk user to profiles table on mount. Call from protected pages. */
export default function ProfileSync() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded || !user) return
    syncProfile({
      email: user.primaryEmailAddress?.emailAddress || '',
      full_name: user.fullName || user.username || '',
      role: (user.publicMetadata?.role || 'user').toString().toLowerCase(),
    }).catch(() => {})
  }, [isLoaded, user])

  return null
}

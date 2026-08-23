'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const { user, loading, signingOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading || signingOut) return
    if (!user) router.replace('/auth/sign-in')
  }, [user, loading, signingOut, router])

  if (loading) return null
  if (!user) return null

  return children
}

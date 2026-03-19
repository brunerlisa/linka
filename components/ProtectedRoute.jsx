'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return
    if (!user) router.replace('/auth/sign-in')
  }, [user, isLoaded, router])

  if (!isLoaded) return null
  if (!user) return null

  return children
}

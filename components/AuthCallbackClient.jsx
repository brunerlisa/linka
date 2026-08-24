'use client'

import { useEffect } from 'react'
import { RESET_PATH, isRecoveryParams, readAuthParams, resetPasswordHref, safePath } from '@/lib/authRecovery'

export default function AuthCallbackClient() {
  useEffect(() => {
    const params = readAuthParams()
    if (params.error) {
      window.location.replace('/auth/forgot-password?error=link')
      return
    }
    if (isRecoveryParams(params) || params.code) {
      window.location.replace(resetPasswordHref())
      return
    }
    window.location.replace(safePath(params.next, RESET_PATH))
  }, [])

  return (
    <div className="min-h-screen bg-[#050816] text-slate-300 flex items-center justify-center px-4">
      <p className="text-sm">Opening your password reset…</p>
    </div>
  )
}

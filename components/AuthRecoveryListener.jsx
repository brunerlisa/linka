'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RESET_PATH, isRecoveryParams, readAuthParams, resetPasswordHref } from '@/lib/authRecovery'

function onResetPage() {
  return window.location.pathname.startsWith(RESET_PATH)
}

export default function AuthRecoveryListener() {
  useEffect(() => {
    const params = readAuthParams()
    if (!onResetPage() && (isRecoveryParams(params) || params.code)) {
      window.location.replace(resetPasswordHref())
      return
    }

    const supabase = createClient()
    if (!supabase) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && !onResetPage()) {
        window.location.replace(RESET_PATH)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return null
}

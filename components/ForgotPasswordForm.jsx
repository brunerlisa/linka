'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const inputClass =
  'w-full min-h-12 rounded-md bg-[#0f172a] border border-slate-700 px-3 py-3 text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-primary'
const buttonClass =
  'w-full min-h-12 py-3 rounded-md bg-primary hover:bg-primary-dark text-base font-semibold disabled:opacity-70'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    const supabase = createClient()
    if (!supabase) {
      setError('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY on Vercel.')
      return
    }

    setLoading(true)
    try {
      const origin = window.location.origin
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
      })
      if (resetError) throw resetError
      setNotice('If that email has an account, we sent a reset link. Open it to create a new password.')
    } catch (err) {
      setError(err?.message || 'Could not send the reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 rounded-2xl">
        <div className="hidden md:flex flex-col justify-center px-10 bg-gradient-to-b from-[#050816] to-[#02010a] rounded-2xl border border-slate-900">
          <h1 className="text-3xl font-semibold mb-4 tracking-tight text-[#00aeef]">Noble Mirror Capital</h1>
          <p className="text-base text-slate-300 max-w-md leading-relaxed">
            Reset your password to get back into your dashboard.
          </p>
        </div>

        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-md bg-[#070a1b] border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-1">Forgot password</h2>
            <p className="text-sm text-slate-400 mb-6">Enter the email on your account. We will send a link to create a new password.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-200 mb-1.5">Email</label>
                <input
                  type="email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoComplete="email"
                  required
                />
              </div>

              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              {notice ? <p className="text-sm text-emerald-400">{notice}</p> : null}

              <button type="submit" disabled={loading} className={buttonClass}>
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>

            <p className="mt-5 text-sm text-slate-400">
              Remembered it?{' '}
              <Link href="/auth/sign-in" className="text-primary hover:text-primary-light">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

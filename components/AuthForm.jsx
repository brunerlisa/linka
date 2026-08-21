'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const inputClass =
  'w-full rounded-md bg-[#0f172a] border border-slate-700 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary'
const buttonClass =
  'w-full py-2.5 rounded-md bg-primary hover:bg-primary-dark text-sm font-semibold disabled:opacity-70'

export default function AuthForm({ mode }) {
  const isSignUp = mode === 'sign-up'
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const supabase = createClient()
    if (!supabase) {
      setError('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY on Vercel.')
      return
    }

    setLoading(true)
    try {
      if (isSignUp) {
        const res = await fetch('/api/auth/sign-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password,
            full_name: fullName.trim(),
          }),
        })
        const payload = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(payload.error || 'Sign up failed')
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (signInError) throw signInError
      router.replace(isSignUp ? '/onboarding' : '/dashboard')
      router.refresh()
    } catch (err) {
      setError(err?.message || 'Authentication failed.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 rounded-2xl">
        <div className="hidden md:flex flex-col justify-center px-10 bg-gradient-to-b from-[#050816] to-[#02010a] rounded-2xl border border-slate-900">
          <h1 className="text-3xl font-semibold mb-4 tracking-tight text-[#00aeef]">Noble Mirror Capital</h1>
          <p className="text-base text-slate-300 max-w-md leading-relaxed">
            Access secure copy trading, monitor performance in real time, and stay in full control of your capital from one dashboard.
          </p>
        </div>

        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-md bg-[#070a1b] border border-slate-800 rounded-xl p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-1">{isSignUp ? 'Create your account' : 'Welcome back'}</h2>
            <p className="text-sm text-slate-400 mb-6">
              {isSignUp ? 'Start copy trading in a few minutes.' : 'Sign in to continue to your dashboard.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm text-slate-200 mb-1.5">Full name</label>
                  <input
                    className={inputClass}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                </div>
              )}
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
              <div>
                <label className="block text-sm text-slate-200 mb-1.5">Password</label>
                <input
                  type="password"
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignUp ? 'At least 8 characters' : 'Your password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  minLength={isSignUp ? 8 : undefined}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button type="submit" disabled={loading} className={buttonClass}>
                {loading ? 'Please wait…' : isSignUp ? 'Sign up' : 'Sign in'}
              </button>
            </form>

            <p className="mt-5 text-sm text-slate-400">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <Link href="/auth/sign-in" className="text-primary hover:text-primary-light">
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  New here?{' '}
                  <Link href="/auth/sign-up" className="text-primary hover:text-primary-light">
                    Create an account
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

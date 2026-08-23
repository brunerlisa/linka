'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { displayName, formatDate, usernameHandle } from '@/components/dashboard/userDisplay'
import { planDisplayName } from '@/lib/pricingPlans'
import { getMyPlan, getMyProfile, syncProfile } from '@/lib/tradingAdminApi'
import SectionBack from '@/components/dashboard/SectionBack'
import PasswordInput from '@/components/PasswordInput'

const CARD = 'rounded-2xl border border-dark-border bg-dark-card'
const INPUT = 'w-full h-11 rounded-xl bg-[#0b1220] border border-dark-border px-3 text-sm text-white placeholder:text-slate-500'

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-white break-all">{value || '—'}</p>
    </div>
  )
}

export default function SettingsSection({ onBack }) {
  const { user, isAdmin } = useAuth()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [profile, setProfile] = useState(null)
  const [plan, setPlan] = useState({ plan: 'basic', status: 'active' })
  const [savingName, setSavingName] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setFullName(user?.fullName || '')
  }, [user?.fullName])

  useEffect(() => {
    if (!user) return
    let mounted = true
    Promise.all([getMyProfile(), getMyPlan().catch(() => null)])
      .then(([nextProfile, nextPlan]) => {
        if (!mounted) return
        setProfile(nextProfile || null)
        if (nextProfile?.full_name) setFullName(nextProfile.full_name)
        if (nextPlan) setPlan({ plan: nextPlan.plan || 'basic', status: nextPlan.status || 'active' })
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [user])

  async function saveName(event) {
    event.preventDefault()
    const name = fullName.trim()
    if (!name) {
      setError('Enter the name you used when signing up.')
      return
    }
    setSavingName(true)
    setError('')
    setNotice('')
    try {
      await syncProfile({ email: user?.email || '', full_name: name })
      const supabase = createClient()
      if (supabase) {
        await supabase.auth.updateUser({ data: { full_name: name } })
      }
      setNotice('Your name was updated.')
    } catch (e) {
      setError(e?.message || 'Could not update your name.')
    } finally {
      setSavingName(false)
    }
  }

  async function changePassword(event) {
    event.preventDefault()
    if (password.length < 8) {
      setError('Use at least 8 characters for the new password.')
      return
    }
    if (password !== confirm) {
      setError('New passwords do not match.')
      return
    }
    const supabase = createClient()
    if (!supabase) {
      setError('Could not update password right now.')
      return
    }
    setSavingPassword(true)
    setError('')
    setNotice('')
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setPassword('')
      setConfirm('')
      setNotice('Password changed. Use the new password the next time you sign in.')
    } catch (e) {
      setError(e?.message || 'Could not change password.')
    } finally {
      setSavingPassword(false)
    }
  }

  const handle = usernameHandle(user)
  const email = user?.email || profile?.email || '—'

  return (
    <div className="space-y-5">
      <SectionBack onClick={onBack} />
      <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Settings</h1>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-400">{notice}</p> : null}

      {isAdmin ? (
        <section className={`${CARD} p-5 sm:p-6`}>
          <h2 className="text-lg font-semibold text-white mb-2">Admin tools</h2>
          <p className="text-sm text-slate-400 mb-4">
            Manage traders, payment approvals, user balances, and profit updates in the admin Control Center.
          </p>
          <Link
            href="/admin/control"
            className="inline-flex h-10 px-4 items-center rounded-lg bg-primary hover:bg-primary-dark text-sm font-semibold text-white"
          >
            Open Control Center
          </Link>
        </section>
      ) : null}

      <section className={`${CARD} p-5 sm:p-6 space-y-5`}>
        <div>
          <h2 className="text-lg font-semibold text-white">Account</h2>
          <p className="mt-1 text-sm text-slate-400">Details from the account you created when you signed up.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Detail label="Full name" value={displayName({ ...user, fullName: fullName || user?.fullName })} />
          <Detail label="Email" value={email} />
          <Detail label="Username" value={`@${handle}`} />
          <Detail label="Plan" value={planDisplayName(plan.plan, plan.status)} />
          <Detail label="Account type" value={isAdmin ? 'Admin' : 'Real account'} />
          <Detail label="Member since" value={formatDate(profile?.created_at)} />
        </div>
        <form onSubmit={saveName} className="space-y-3 max-w-xl">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Update full name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Name from sign up"
              className={INPUT}
            />
          </div>
          <button
            type="submit"
            disabled={savingName}
            className="h-11 px-5 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-60 text-sm font-semibold text-white"
          >
            {savingName ? 'Saving...' : 'Save name'}
          </button>
        </form>
      </section>

      <section className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-lg font-semibold text-white">Change password</h2>
        <p className="mt-1 text-sm text-slate-400 mb-4">Choose a new password for this account.</p>
        <form onSubmit={changePassword} className="space-y-3 max-w-xl">
          <div>
            <label className="block text-xs text-slate-400 mb-1">New password</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
              className={INPUT}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Confirm new password</label>
            <PasswordInput
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat new password"
              autoComplete="new-password"
              minLength={8}
              required
              className={INPUT}
            />
          </div>
          <button
            type="submit"
            disabled={savingPassword}
            className="h-11 px-5 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-60 text-sm font-semibold text-white"
          >
            {savingPassword ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </section>
    </div>
  )
}

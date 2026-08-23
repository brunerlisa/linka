'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { formatDate, formatUsd } from '@/components/dashboard/userDisplay'
import { claimBonus, listPayments } from '@/lib/tradingAdminApi'
import SectionBack from '@/components/dashboard/SectionBack'

const CARD = 'rounded-2xl border border-dark-border bg-dark-card'

export default function ClaimBonusSection({ onBack }) {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const rows = await listPayments()
    setPayments(
      (rows || []).filter(
        (row) =>
          row.payment_type === 'bonus' &&
          (row.user_clerk_id === user?.id || row.user_email === user?.email)
      )
    )
  }

  useEffect(() => {
    if (!user) return
    let mounted = true
    async function run() {
      try {
        await load()
      } catch (e) {
        if (mounted) setError(e?.message || 'Could not load bonuses.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [user])

  const available = useMemo(
    () => payments.filter((row) => String(row.status).toLowerCase() === 'available'),
    [payments]
  )
  const history = useMemo(
    () =>
      payments.filter((row) => ['claimed', 'cancelled'].includes(String(row.status).toLowerCase())),
    [payments]
  )

  async function claim(id) {
    setError('')
    setNotice('')
    setClaimingId(id)
    try {
      await claimBonus(id)
      setNotice('Bonus claimed and added to your real account balance.')
      await load()
    } catch (e) {
      setError(e?.message || 'Could not claim bonus.')
    } finally {
      setClaimingId('')
    }
  }

  return (
    <div className="space-y-5">
      <SectionBack onClick={onBack} />
      <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Claim Bonus</h1>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-400">{notice}</p> : null}

      <section className={`${CARD} px-5 py-12 flex flex-col items-center text-center`}>
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : available.length === 0 ? (
          <>
            <span className="inline-flex w-20 h-20 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M20 12v8H4v-8" />
                <path strokeWidth="1.7" strokeLinecap="round" d="M2 8h20v4H2z" />
                <path strokeWidth="1.7" strokeLinecap="round" d="M12 8V4" />
                <path strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2 0-3-1.5-3-3 1.5 0 3 1 3 3z" />
                <path strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M12 8c2 0 3-1.5 3-3-1.5 0-3 1-3 3z" />
              </svg>
            </span>
            <p className="text-slate-300">You do not have any bonus to claim.</p>
          </>
        ) : (
          <div className="w-full max-w-xl space-y-4">
            {available.map((bonus) => (
              <div key={bonus.id} className="rounded-xl border border-dark-border bg-[#0b1220] p-5 text-left">
                <p className="text-sm text-slate-400">Available bonus</p>
                <p className="mt-1 text-3xl font-semibold text-white">{formatUsd(bonus.amount_usd)}</p>
                <p className="mt-1 text-sm text-slate-400">Asset: {bonus.method || 'USD'}</p>
                {bonus.notes ? <p className="mt-2 text-sm text-slate-500">{bonus.notes}</p> : null}
                <button
                  type="button"
                  disabled={claimingId === bonus.id}
                  onClick={() => claim(bonus.id)}
                  className="mt-4 w-full h-11 rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold"
                >
                  {claimingId === bonus.id ? 'Claiming...' : 'Claim'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-lg font-semibold text-white mb-4">Claim History</h2>
        {history.length === 0 ? (
          <div>
            <div className="hidden sm:grid grid-cols-5 text-xs uppercase tracking-wide text-slate-500 pb-3 border-b border-dark-border">
              {['SN', 'Date', 'Asset', 'Amount', 'Status'].map((header) => (
                <span key={header}>{header}</span>
              ))}
            </div>
            <p className="py-10 text-center text-sm text-slate-500">No claim history</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-dark-border">
                  {['SN', 'Date', 'Asset', 'Amount', 'Status'].map((header) => (
                    <th key={header} className="pb-3 pr-4 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((row, index) => (
                  <tr key={row.id} className="border-b border-dark-border/60 last:border-0">
                    <td className="py-3 pr-4 text-slate-300">{String(index + 1).padStart(2, '0')}</td>
                    <td className="py-3 pr-4 text-slate-300">{formatDate(row.updated_at || row.created_at)}</td>
                    <td className="py-3 pr-4 text-white">{row.method || 'USD'}</td>
                    <td className="py-3 pr-4 text-white">{formatUsd(row.amount_usd)}</td>
                    <td className="py-3 pr-4 capitalize text-slate-300">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

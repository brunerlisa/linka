'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { formatDate, formatUsd } from '@/components/dashboard/userDisplay'
import { listPayments } from '@/lib/tradingAdminApi'

const CARD = 'rounded-2xl border border-dark-border bg-dark-card'

export default function TransactionsSection() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    let mounted = true
    async function load() {
      try {
        const rows = await listPayments()
        if (!mounted) return
        setPayments(
          (rows || []).filter((row) => row.user_clerk_id === user.id || row.user_email === user.email)
        )
      } catch (e) {
        if (mounted) setError(e?.message || 'Could not load transactions.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [user])

  const deposits = useMemo(
    () => payments.filter((row) => row.payment_type !== 'withdrawal' && row.payment_type !== 'bonus'),
    [payments]
  )
  const withdrawals = useMemo(
    () => payments.filter((row) => row.payment_type === 'withdrawal'),
    [payments]
  )
  const activity = useMemo(
    () =>
      [...payments].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)),
    [payments]
  )

  return (
    <div className="space-y-5">
      <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">My Transactions</h1>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {loading ? (
        <p className="py-16 text-center text-sm text-slate-500">Loading...</p>
      ) : (
        <>
          <section className={`${CARD} p-5 sm:p-6`}>
            <h2 className="text-lg font-semibold text-white mb-4">Deposits</h2>
            <TxnTable
              headers={['SN', 'Amount', 'Date', 'Status', 'Action']}
              empty="No deposits yet"
              rows={deposits.map((row, index) => [
                String(index + 1).padStart(2, '0'),
                formatUsd(row.amount_usd),
                formatDate(row.created_at),
                statusLabel(row.status),
                row.method || 'View',
              ])}
            />
          </section>

          <section className={`${CARD} p-5 sm:p-6`}>
            <h2 className="text-lg font-semibold text-white mb-4">Withdrawals</h2>
            <TxnTable
              headers={['SN', 'Amount', 'Date', 'Status']}
              empty="No withdrawals yet"
              rows={withdrawals.map((row, index) => [
                String(index + 1).padStart(2, '0'),
                formatUsd(row.amount_usd),
                formatDate(row.created_at),
                statusLabel(row.status),
              ])}
            />
          </section>

          <section className={`${CARD} p-5 sm:p-6`}>
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
            <TxnTable
              headers={['Type', 'Amount', 'Date', 'Status']}
              empty="No recent activity"
              rows={activity.map((row) => [
                paymentTypeLabel(row.payment_type),
                formatUsd(row.amount_usd),
                formatDate(row.created_at),
                statusLabel(row.status),
              ])}
            />
          </section>
        </>
      )}
    </div>
  )
}

function paymentTypeLabel(type) {
  if (type === 'withdrawal') return 'Withdrawal'
  if (type === 'bonus') return 'Bonus'
  return 'Deposit'
}

function statusLabel(status) {
  const value = String(status || 'pending')
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function TxnTable({ headers, rows, empty }) {
  if (!rows.length) {
    return (
      <div>
        <div
          className="hidden sm:grid text-xs uppercase tracking-wide text-slate-500 pb-3 border-b border-dark-border"
          style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}
        >
          {headers.map((header) => (
            <span key={header}>{header}</span>
          ))}
        </div>
        <p className="py-10 text-center text-sm text-slate-500">{empty}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-dark-border">
            {headers.map((header) => (
              <th key={header} className="pb-3 pr-4 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.join('-')}-${index}`} className="border-b border-dark-border/60 last:border-0">
              {row.map((cell, cellIndex) => (
                <td
                  key={`${index}-${cellIndex}`}
                  className={`py-3 pr-4 whitespace-nowrap ${
                    headers[cellIndex] === 'Type'
                      ? cell === 'Withdrawal'
                        ? 'text-amber-400 font-medium'
                        : 'text-emerald-400 font-medium'
                      : 'text-slate-200'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { listAccounts, listPayments } from '@/lib/tradingAdminApi'
import { NavIcon } from '@/components/dashboard/icons'
import {
  formatDate,
  formatUsd,
  greetingForNow,
  userInitials,
  usernameHandle,
} from '@/components/dashboard/userDisplay'

const CARD = 'rounded-2xl border border-dark-border bg-dark-card'

export default function UserDashboardHome({ onNavigate }) {
  const { user } = useAuth()
  const [hideBalances, setHideBalances] = useState(false)
  const [account, setAccount] = useState(null)
  const [payments, setPayments] = useState([])

  useEffect(() => {
    try {
      setHideBalances(localStorage.getItem('nmc:hide-balances') === '1')
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    let mounted = true
    async function load() {
      const [accounts, rows] = await Promise.all([listAccounts(), listPayments()])
      if (!mounted) return
      const mine = (accounts || []).find(
        (row) => row.user_clerk_id === user?.id || row.user_email === user?.email
      )
      const myPayments = (rows || []).filter(
        (row) => row.user_clerk_id === user?.id || row.user_email === user?.email
      )
      setAccount(mine || null)
      setPayments(myPayments)
    }
    load()
    return () => {
      mounted = false
    }
  }, [user])

  const balance = Number(account?.balance || 0)
  const profit = Number(account?.profit || 0)
  const bonus = Number(account?.bonus || 0)
  const pendingWithdrawal = (payments || [])
    .filter((row) => row.payment_type === 'withdrawal' && String(row.status || '').toLowerCase() === 'pending')
    .reduce((sum, row) => sum + Number(row.amount_usd || 0), 0)
  const dayGain = profit > 0 ? profit : 0
  const dayLoss = profit < 0 ? Math.abs(profit) : 0

  const deposits = useMemo(
    () => (payments || []).filter((row) => row.payment_type !== 'withdrawal'),
    [payments]
  )
  const withdrawals = useMemo(
    () => (payments || []).filter((row) => row.payment_type === 'withdrawal'),
    [payments]
  )
  const activity = useMemo(() => {
    return [...(payments || [])]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 8)
  }, [payments])

  const handle = usernameHandle(user)
  const money = (value) => formatUsd(value, hideBalances)

  function toggleBalances() {
    setHideBalances((prev) => {
      const next = !prev
      try {
        localStorage.setItem('nmc:hide-balances', next ? '1' : '0')
      } catch {
        // ignore
      }
      return next
    })
  }

  const stats = [
    { label: 'Total Balance', value: money(balance), icon: 'bank' },
    { label: 'Profit', value: money(profit), icon: 'wallet' },
    { label: 'Total Bonus', value: money(bonus), icon: 'bonus' },
    { label: 'Pending Withdrawal', value: money(pendingWithdrawal), icon: 'clock' },
  ]

  const quickActions = [
    { label: 'Deposit', icon: 'deposit', section: 'Deposit' },
    { label: 'Withdraw', icon: 'withdraw', section: 'Withdraw' },
    { label: 'Copy Trader', icon: 'copy', section: 'Copy Trader' },
    { label: 'Place Trade', icon: 'trade', section: 'Place Trade' },
    { label: 'KYC', icon: 'kyc', section: 'KYC' },
    { label: 'Transactions', icon: 'history', section: 'All Transactions' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          {greetingForNow()}, @{handle}
        </h1>
        <p className="mt-1 text-sm text-slate-400">Here is your portfolio summary</p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Portfolio Overview</h2>
          <button
            type="button"
            onClick={toggleBalances}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <NavIcon name={hideBalances ? 'eyeOff' : 'eye'} className="w-4 h-4" />
            {hideBalances ? 'Show Balances' : 'Hide Balances'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((item) => (
            <div key={item.label} className={`${CARD} p-5`}>
              <div className="flex items-center gap-2 text-primary mb-4">
                <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-primary/10">
                  <NavIcon name={item.icon} className="w-4 h-4" />
                </span>
                <span className="text-sm">{item.label}</span>
              </div>
              <p className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${CARD} px-5 py-5 sm:px-6`}>
        <p className="text-sm text-slate-400 mb-4">Unified Trading Balance</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm sm:text-base">
          <p className="text-slate-300">
            Trading Capital:{' '}
            <span className="font-semibold text-white">{money(balance)}</span>
          </p>
          <p className="text-slate-300">
            Current Day Loss:{' '}
            <span className="font-semibold text-red-500">{money(dayLoss)}</span>
          </p>
          <p className="text-slate-300">
            All Day Gain:{' '}
            <span className="font-semibold text-emerald-400">{money(dayGain)}</span>
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold tracking-[0.18em] text-slate-500 mb-4">QUICK ACTIONS</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => onNavigate?.(action.section)}
              className={`${CARD} flex flex-col items-center justify-center gap-3 py-5 px-2 hover:border-primary/40 hover:bg-[#0d1524] transition-colors`}
            >
              <span className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <NavIcon name={action.icon} className="w-5 h-5" />
              </span>
              <span className="text-xs sm:text-sm text-slate-200 text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <ActivityTable
          headers={['Type', 'Amount', 'Date', 'Status']}
          empty="No recent activity"
          rows={activity.map((row) => [
            row.payment_type === 'withdrawal' ? 'Withdrawal' : 'Deposit',
            money(row.amount_usd),
            formatDate(row.created_at),
            statusLabel(row.status),
          ])}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`${CARD} p-5 sm:p-6`}>
          <h2 className="text-lg font-semibold text-white mb-4">Deposits</h2>
          <ActivityTable
            headers={['SN', 'Amount', 'Date', 'Status', 'Action']}
            empty="No deposits yet"
            rows={deposits.map((row, index) => [
              String(index + 1).padStart(2, '0'),
              money(row.amount_usd),
              formatDate(row.created_at),
              statusLabel(row.status),
              row.method || '—',
            ])}
          />
        </div>
        <div className={`${CARD} p-5 sm:p-6`}>
          <h2 className="text-lg font-semibold text-white mb-4">Withdrawals</h2>
          <ActivityTable
            headers={['SN', 'Amount', 'Date', 'Status']}
            empty="No withdrawals yet"
            rows={withdrawals.map((row, index) => [
              String(index + 1).padStart(2, '0'),
              money(row.amount_usd),
              formatDate(row.created_at),
              statusLabel(row.status),
            ])}
          />
        </div>
      </section>
    </div>
  )
}

function statusLabel(status) {
  const value = String(status || 'pending')
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function ActivityTable({ headers, rows, empty }) {
  if (!rows.length) {
    return (
      <div>
        <div className="hidden sm:grid text-xs uppercase tracking-wide text-slate-500 pb-3 border-b border-dark-border" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
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
            <tr key={`${row[0]}-${index}`} className="border-b border-dark-border/60 last:border-0">
              {row.map((cell) => (
                <td key={`${index}-${cell}`} className="py-3 pr-4 text-slate-200 whitespace-nowrap">
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

export function UserAvatar({ user, size = 'md' }) {
  const initials = userInitials(user)
  const sizeClass = size === 'lg' ? 'w-16 h-16 text-xl' : size === 'sm' ? 'w-8 h-8 text-[11px]' : 'w-10 h-10 text-sm'
  return (
    <div
      className={`${sizeClass} rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center uppercase`}
    >
      {initials}
    </div>
  )
}

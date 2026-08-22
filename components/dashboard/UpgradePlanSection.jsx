'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { formatUsd } from '@/components/dashboard/userDisplay'
import {
  BASIC_PLAN_ID,
  UPGRADE_FEATURES,
  UPGRADE_PLANS,
  getUpgradePlan,
  planDisplayName,
  qualifiesForPlan,
} from '@/lib/pricingPlans'
import { getMyPlan, selectPlan } from '@/lib/tradingAdminApi'

const CARD = 'rounded-2xl border border-dark-border bg-dark-card'

function MedalIcon({ id }) {
  const color =
    id === 'gold' ? '#fbbf24' : id === 'silver' ? '#94a3b8' : '#fb923c'
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 3h8l-2.2 5.2A6 6 0 1 1 8 8.2L8 3z" stroke={color} strokeWidth="1.7" />
      <circle cx="12" cy="14.5" r="3.2" stroke={color} strokeWidth="1.7" />
      <path d="M10.6 14.5l1 1 1.8-2" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FeatureMark({ value }) {
  if (value === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">✓</span>
    )
  }
  if (value === false) {
    return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400">×</span>
  }
  return (
    <span className="inline-flex min-w-[4.5rem] justify-center rounded-full bg-[#152033] px-2.5 py-1 text-xs text-slate-200">
      {value}
    </span>
  )
}

export default function UpgradePlanSection({ onNavigate, onPlanChange }) {
  const { user } = useAuth()
  const [planId, setPlanId] = useState(BASIC_PLAN_ID)
  const [planStatus, setPlanStatus] = useState('active')
  const [balance, setBalance] = useState(0)
  const [pending, setPending] = useState(null)
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [depositHint, setDepositHint] = useState(null)

  async function load() {
    const data = await getMyPlan()
    setPlanId(data.plan || BASIC_PLAN_ID)
    setPlanStatus(data.status || 'active')
    setBalance(Number(data.balance || 0))
    setPending(data.pending || null)
    onPlanChange?.(data)
  }

  useEffect(() => {
    if (!user) return
    let mounted = true
    load().catch((e) => {
      if (mounted) setError(e?.message || 'Could not load your plan.')
    })
    return () => {
      mounted = false
    }
  }, [user])

  async function choose(plan, requestIfUnderfunded = false) {
    setError('')
    setNotice('')
    setDepositHint(null)
    setBusyId(plan.id)
    try {
      const result = await selectPlan(plan.id, { requestIfUnderfunded })
      setPlanId(result.plan || plan.id)
      setPlanStatus(result.status || 'active')
      setBalance(Number(result.balance || 0))
      onPlanChange?.(result)
      if (result.alreadyActive) {
        setNotice(`You are already on the ${plan.name} plan.`)
      } else if (result.pending) {
        setNotice(`${plan.name} upgrade requested. Admin will activate it after review.`)
        await load()
      } else {
        setNotice(`${plan.name} is now active on your account.`)
      }
    } catch (e) {
      const message = e?.message || 'Could not select this plan.'
      setError(message)
      if (/deposit at least/i.test(message)) {
        setDepositHint(plan)
      }
    } finally {
      setBusyId('')
    }
  }

  const current = getUpgradePlan(planId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Upgrade Plan</h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl">
          Choose the plan that fits your trading goals. Each tier unlocks new features and benefits.
        </p>
      </div>

      <div className={`${CARD} px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Current plan</p>
          <p className="text-white font-semibold capitalize">{planDisplayName(planId, planStatus)}</p>
          <p className="text-sm text-slate-400">
            Balance {formatUsd(balance)}
            {current ? ` · Matches website ${current.websitePlan}` : ''}
          </p>
        </div>
        {pending ? (
          <p className="text-sm text-amber-300">Pending: {getUpgradePlan(pending.method)?.name || pending.method}</p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-400">{notice}</p> : null}

      {depositHint ? (
        <div className={`${CARD} p-4 flex flex-col sm:flex-row sm:items-center gap-3`}>
          <p className="text-sm text-slate-300 flex-1">
            {depositHint.name} requires a minimum deposit of {formatUsd(depositHint.min)}. Deposit first, then select the plan again.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onNavigate?.('Deposit')}
              className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-dark text-sm font-semibold text-white"
            >
              Deposit
            </button>
            <button
              type="button"
              disabled={busyId === depositHint.id}
              onClick={() => choose(depositHint, true)}
              className="h-10 px-4 rounded-xl border border-dark-border text-sm text-slate-200 hover:border-primary/50"
            >
              Request anyway
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {UPGRADE_PLANS.map((plan) => {
          const isCurrent = planId === plan.id && planStatus === 'active'
          const bools = UPGRADE_FEATURES.filter((row) => row.key !== 'leverage' && row[plan.id] === true).map(
            (row) => row.label
          )
          const shown = bools.slice(0, 5)
          return (
            <article
              key={plan.id}
              className={`${CARD} p-5 sm:p-6 flex flex-col ${isCurrent ? `ring-1 ${plan.accent.ring}` : ''}`}
            >
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${plan.accent.icon}`}>
                <MedalIcon id={plan.id} />
              </span>
              <h2 className="mt-4 text-xl font-semibold text-white">{plan.name}</h2>
              <p className="mt-1 text-lg font-semibold text-primary">{plan.priceLabel}</p>
              <p className="mt-2 text-sm text-slate-400">{plan.summary}</p>
              <ul className="mt-5 space-y-2.5 flex-1">
                {shown.map((line) => (
                  <li key={line} className="flex gap-2 text-sm text-slate-300">
                    <span className="text-emerald-400">✓</span>
                    <span>{line}</span>
                  </li>
                ))}
                <li className="flex gap-2 text-sm text-slate-300">
                  <span className="text-emerald-400">✓</span>
                  <span>
                    Max Leverage: <span className="text-white font-medium">{plan.leverage}</span>
                  </span>
                </li>
                {plan.extraCount ? (
                  <li className="text-sm text-slate-500 pl-5">+{plan.extraCount} more features</li>
                ) : null}
              </ul>
              <button
                type="button"
                disabled={busyId === plan.id || isCurrent}
                onClick={() => choose(plan)}
                className={`mt-6 h-11 rounded-xl font-semibold disabled:opacity-60 ${plan.accent.button}`}
              >
                {isCurrent ? 'Current plan' : busyId === plan.id ? 'Selecting...' : `Select ${plan.name}`}
              </button>
              {!qualifiesForPlan(balance, plan) && !isCurrent ? (
                <p className="mt-2 text-xs text-slate-500 text-center">Min deposit {formatUsd(plan.min)}</p>
              ) : null}
            </article>
          )
        })}
      </div>

      <section className={`${CARD} p-5 sm:p-6 overflow-x-auto`}>
        <h2 className="text-center text-lg font-semibold text-white mb-5">Full Feature Comparison</h2>
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-dark-border">
              <th className="pb-3 pr-4 text-left font-medium">Feature</th>
              {UPGRADE_PLANS.map((plan) => (
                <th key={plan.id} className="pb-3 px-3 text-center font-semibold text-white">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {UPGRADE_FEATURES.map((row) => (
              <tr key={row.key} className="border-b border-dark-border/70 last:border-0">
                <td className="py-3.5 pr-4 text-slate-200">{row.label}</td>
                {UPGRADE_PLANS.map((plan) => (
                  <td key={plan.id} className="py-3.5 px-3 text-center">
                    <span className="inline-flex justify-center w-full">
                      <FeatureMark value={row[plan.id]} />
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

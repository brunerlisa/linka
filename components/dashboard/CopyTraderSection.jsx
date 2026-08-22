'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { NavIcon } from '@/components/dashboard/icons'
import { formatUsd } from '@/components/dashboard/userDisplay'
import {
  listAccounts,
  listTraders,
  listTrades,
  seedDemoTraders,
  startCopyTrader,
  stopCopyTrader,
} from '@/lib/tradingAdminApi'
import { isCopySubscription, parseTradeNotes } from '@/lib/userTrade'

const CARD = 'rounded-2xl border border-dark-border bg-dark-card'

export default function CopyTraderSection() {
  const { user } = useAuth()
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [traders, setTraders] = useState([])
  const [copies, setCopies] = useState([])
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const [traderRows, accounts, tradeRows] = await Promise.all([
      listTraders(),
      listAccounts(),
      listTrades(),
    ])
    const mine = (accounts || []).find(
      (row) => row.user_clerk_id === user?.id || row.user_email === user?.email
    )
    setTraders(traderRows || [])
    setBalance(Number(mine?.balance || 0))
    setCopies(
      (tradeRows || []).filter(
        (row) =>
          isCopySubscription(row) &&
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
        if (mounted) setError(e?.message || 'Could not load traders.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [user])

  const activeCopies = copies.filter((row) => parseTradeNotes(row.notes).status === 'active')
  const highestProfit = traders.reduce((max, trader) => {
    const value = Number(trader.yearly_profit ?? trader.monthly_profit ?? 0)
    return value > max ? value : max
  }, 0)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const list = traders.filter((trader) => {
      if (!needle) return true
      return [trader.name, trader.style, trader.bio, trader.risk]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
    if (tab !== 'copies') return list
    const copiedIds = new Set(activeCopies.map((row) => parseTradeNotes(row.notes).trader_id || row.trader_name))
    return list.filter((trader) => copiedIds.has(trader.id) || copiedIds.has(trader.name))
  }, [traders, query, tab, activeCopies])

  function copyRecordFor(trader) {
    return activeCopies.find((row) => {
      const notes = parseTradeNotes(row.notes)
      return notes.trader_id === trader.id || row.trader_name === trader.name
    })
  }

  async function copyTrader(trader) {
    setError('')
    setNotice('')
    setBusyId(trader.id)
    try {
      await startCopyTrader({
        trader_id: trader.id,
        trader_name: trader.name,
        fee: trader.fee_percent,
        monthly_profit: trader.monthly_profit,
      })
      setNotice(`You are now copying ${trader.name}.`)
      setTab('copies')
      await load()
    } catch (e) {
      setError(e?.message || 'Could not start copy.')
    } finally {
      setBusyId('')
    }
  }

  async function stopCopy(trader) {
    const record = copyRecordFor(trader)
    if (!record) return
    setError('')
    setNotice('')
    setBusyId(trader.id)
    try {
      await stopCopyTrader(record.id)
      setNotice(`Stopped copying ${trader.name}.`)
      await load()
    } catch (e) {
      setError(e?.message || 'Could not stop copy.')
    } finally {
      setBusyId('')
    }
  }

  const stats = [
    { label: 'Total Traders', value: String(traders.length), icon: 'copy' },
    { label: 'Trading Capital', value: formatUsd(balance), icon: 'wallet' },
    { label: 'Active Copies', value: String(activeCopies.length), icon: 'eye' },
    {
      label: 'Highest Profit Share',
      value: `${Number(highestProfit || 0).toFixed(2)}%`,
      icon: 'upgrade',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Copy Trader</h1>
        <p className="mt-1 text-sm text-slate-400">
          Browse top traders and mirror their strategies automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div key={item.label} className={`${CARD} p-5`}>
            <div className="flex items-center gap-2 text-primary mb-3">
              <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-primary/10">
                <NavIcon name={item.icon} className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-semibold text-white">{item.value}</p>
            <p className="mt-1 text-sm text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" strokeWidth="1.7" />
            <path d="M20 20l-3-3" strokeWidth="1.7" />
          </svg>
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search traders by name or strategy..."
          className="w-full h-12 rounded-xl bg-dark-card border border-dark-border pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
        />
      </div>

      <div className="flex gap-8 border-b border-dark-border">
        {[
          { id: 'all', label: 'All Traders', icon: 'copy' },
          { id: 'copies', label: 'My Copies', icon: 'trades' },
        ].map((item) => {
          const active = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`inline-flex items-center gap-2 pb-3 text-sm font-medium border-b-2 -mb-px ${
                active ? 'text-primary border-primary' : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              <NavIcon name={item.icon} className="w-4 h-4" />
              {item.label}
            </button>
          )
        })}
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-400">{notice}</p> : null}

      {loading ? (
        <p className="py-16 text-center text-sm text-slate-500">Loading traders...</p>
      ) : filtered.length === 0 ? (
        <div className="py-16 flex flex-col items-center text-center">
          <span className="inline-flex w-20 h-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <NavIcon name="copy" className="w-8 h-8" />
          </span>
          <p className="text-lg font-semibold text-white">
            {tab === 'copies' ? 'No active copies' : 'No traders available'}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {tab === 'copies'
              ? 'Copy a trader from All Traders to see them here.'
              : 'Check back later for new traders to copy.'}
          </p>
          {tab === 'all' && user?.role === 'admin' ? (
            <button
              type="button"
              onClick={async () => {
                await seedDemoTraders()
                await load()
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
            >
              Load traders
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((trader) => {
            const copying = Boolean(copyRecordFor(trader))
            return (
              <article key={trader.id} className={`${CARD} p-5 flex flex-col`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <TraderPhoto name={trader.name} src={trader.avatar_url} />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{trader.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {trader.risk || 'Low'} · {trader.style || 'Mixed'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300">
                    {trader.status || 'ACTIVE'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                  <Stat label="Monthly" value={`+${Number(trader.monthly_profit || 0)}%`} />
                  <Stat label="Yearly" value={`+${Number(trader.yearly_profit || 0)}%`} />
                  <Stat label="Win rate" value={`${Number(trader.win_rate || 0)}%`} />
                </div>
                <p className="mt-3 text-xs text-slate-400 line-clamp-2">{trader.bio || 'Professional trader'}</p>
                <p className="mt-3 text-xs text-slate-400">
                  Min. ${Number(trader.min_capital || 0).toLocaleString()} · {Number(trader.copiers || 0)} copiers · Fee {Number(trader.fee_percent || 0)}%
                </p>
                <button
                  type="button"
                  disabled={busyId === trader.id}
                  onClick={() => (copying ? stopCopy(trader) : copyTrader(trader))}
                  className={`mt-4 h-11 rounded-lg text-sm font-semibold disabled:opacity-60 ${
                    copying
                      ? 'border border-dark-border text-white hover:bg-white/5'
                      : 'bg-primary hover:bg-primary-dark text-white'
                  }`}
                >
                  {busyId === trader.id ? 'Please wait...' : copying ? 'Stop copying' : 'Copy'}
                </button>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-emerald-400 font-semibold">{value}</p>
    </div>
  )
}

function TraderPhoto({ name, src }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="w-11 h-11 rounded-full overflow-hidden border border-dark-border bg-[#0b1220] shrink-0 flex items-center justify-center">
      {src && !failed ? (
        <img src={src} alt={name} className="w-full h-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <span className="text-sm font-semibold text-primary">{name?.[0] || '?'}</span>
      )}
    </div>
  )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { formatDate, formatUsd } from '@/components/dashboard/userDisplay'
import { cancelUserTrade, listTrades } from '@/lib/tradingAdminApi'
import { getTradeStatus, isCopySubscription, isUserPlacedTrade, parseTradeNotes } from '@/lib/userTrade'
import SectionBack from '@/components/dashboard/SectionBack'

const CARD = 'rounded-2xl border border-dark-border bg-dark-card'

export default function MyTradesSection({ onBack }) {
  const { user } = useAuth()
  const [tab, setTab] = useState('open')
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    const rows = await listTrades()
    setTrades(
      (rows || []).filter(
        (row) =>
          !isCopySubscription(row) &&
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
        if (mounted) setError(e?.message || 'Could not load trades.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [user])

  const visible = useMemo(() => {
    return trades.filter((row) => {
      const status = getTradeStatus(row)
      return tab === 'open' ? status === 'open' : status !== 'open'
    })
  }, [trades, tab])

  async function cancelTrade(id) {
    setError('')
    try {
      await cancelUserTrade(id)
      await load()
    } catch (e) {
      setError(e?.message || 'Could not cancel trade.')
    }
  }

  return (
    <div className="space-y-5">
      <SectionBack onClick={onBack} />
      <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">My Trades</h1>

      <section className={`${CARD} p-5 sm:p-6 min-h-[360px]`}>
        <h2 className="text-lg font-semibold text-white">All Trades</h2>
        <div className="mt-4 flex gap-8 border-b border-dark-border">
          {[
            { id: 'open', label: 'Open Trades' },
            { id: 'closed', label: 'Closed Trades' },
          ].map((item) => {
            const active = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`pb-3 text-sm font-medium border-b-2 -mb-px ${
                  active ? 'text-primary border-primary' : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

        {loading ? (
          <p className="py-16 text-center text-sm text-slate-500">Loading...</p>
        ) : visible.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-500">No trades yet</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-dark-border">
                  {['SN', 'Asset', 'Trade Type', 'Date', 'Amount', 'Status', 'Action'].map((header) => (
                    <th key={header} className="pb-3 pr-4 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((trade, index) => {
                  const notes = parseTradeNotes(trade.notes)
                  const status = getTradeStatus(trade)
                  const placed = isUserPlacedTrade(trade)
                  const side = notes.side || trade.result
                  const typeLabel = placed
                    ? side === 'sell'
                      ? 'Sell'
                      : 'Buy'
                    : 'Copy'
                  return (
                    <tr key={trade.id} className="border-b border-dark-border/60 last:border-0">
                      <td className="py-3 pr-4 text-slate-300">{String(index + 1).padStart(2, '0')}</td>
                      <td className="py-3 pr-4 text-white">{notes.asset || trade.trader_name}</td>
                      <td
                        className={`py-3 pr-4 font-medium ${
                          typeLabel === 'Sell' ? 'text-red-400' : typeLabel === 'Buy' ? 'text-emerald-400' : 'text-primary'
                        }`}
                      >
                        {typeLabel}
                      </td>
                      <td className="py-3 pr-4 text-slate-300 whitespace-nowrap">{formatDate(trade.created_at)}</td>
                      <td className="py-3 pr-4 text-white">{formatUsd(notes.amount ?? trade.pnl)}</td>
                      <td className="py-3 pr-4 capitalize text-slate-300">{status}</td>
                      <td className="py-3 pr-4">
                        {status === 'open' ? (
                          <button
                            type="button"
                            onClick={() => cancelTrade(trade.id)}
                            className="text-sm text-primary hover:text-primary-light"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

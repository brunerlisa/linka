'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import TradingViewChart from '@/components/dashboard/TradingViewChart'
import { formatDate, formatUsd } from '@/components/dashboard/userDisplay'
import { isUserPlacedTrade, parseTradeNotes, toTvSymbol } from '@/lib/userTrade'
import { cancelUserTrade, listAccounts, listTrades, placeUserTrade } from '@/lib/tradingAdminApi'
import SectionBack from '@/components/dashboard/SectionBack'

const CARD = 'rounded-2xl border border-dark-border bg-dark-card'
const FIELD =
  'w-full h-11 rounded-md bg-[#0b1220] border border-slate-700 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary'

const TIME_OPTIONS = [
  '30 Seconds',
  '1 Minute',
  '5 Minutes',
  '15 Minutes',
  '30 Minutes',
  '1 Hour',
  '4 Hours',
  '1 Day',
]

const LEVERAGE_OPTIONS = ['1x', '5x', '10x', '25x', '50x', '100x']

export default function PlaceTradeSection({ onBack }) {
  const { user } = useAuth()
  const [asset, setAsset] = useState('AAPL')
  const [chartAsset, setChartAsset] = useState('AAPL')
  const [amount, setAmount] = useState('')
  const [time, setTime] = useState('')
  const [leverage, setLeverage] = useState('')
  const [account, setAccount] = useState('real')
  const [balance, setBalance] = useState(0)
  const [trades, setTrades] = useState([])
  const [submitting, setSubmitting] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const chartSymbol = useMemo(() => toTvSymbol(chartAsset), [chartAsset])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (asset.trim()) setChartAsset(asset.trim())
    }, 500)
    return () => clearTimeout(timer)
  }, [asset])

  async function load() {
    const [accounts, rows] = await Promise.all([listAccounts(), listTrades()])
    const mine = (accounts || []).find(
      (row) => row.user_clerk_id === user?.id || row.user_email === user?.email
    )
    setBalance(Number(mine?.balance || 0))
    setTrades(
      (rows || []).filter(
        (row) =>
          isUserPlacedTrade(row) &&
          (row.user_clerk_id === user?.id || row.user_email === user?.email)
      )
    )
  }

  useEffect(() => {
    if (!user) return
    load()
  }, [user])

  async function submit(side) {
    setError('')
    setNotice('')
    setSubmitting(side)
    try {
      await placeUserTrade({
        asset: asset.trim(),
        amount: Number(amount),
        time,
        leverage,
        account,
        side,
      })
      setNotice(`${side === 'buy' ? 'Buy' : 'Sell'} order placed for ${asset.trim()}.`)
      setAmount('')
      await load()
    } catch (e) {
      setError(e?.message || 'Could not place trade.')
    } finally {
      setSubmitting('')
    }
  }

  async function cancelTrade(id) {
    setError('')
    setNotice('')
    try {
      await cancelUserTrade(id)
      setNotice('Trade cancelled and funds returned to your real account if they were reserved.')
      await load()
    } catch (e) {
      setError(e?.message || 'Could not cancel trade.')
    }
  }

  return (
    <div className="space-y-6">
      <SectionBack onClick={onBack} />
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-4">
        <TradingViewChart symbol={chartSymbol} />

        <form
          className={`${CARD} p-5 space-y-4`}
          onSubmit={(event) => event.preventDefault()}
        >
          <h2 className="text-xl font-semibold text-white">Place Trade</h2>
          <p className="text-xs text-slate-400">
            Real account balance: {formatUsd(balance)}
          </p>

          <label className="block">
            <span className="block text-sm text-slate-300 mb-1.5">Asset</span>
            <input
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              placeholder="e.g. BTC/USD"
              className={FIELD}
            />
          </label>

          <label className="block">
            <span className="block text-sm text-slate-300 mb-1.5">Amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={FIELD}
            />
          </label>

          <label className="block">
            <span className="block text-sm text-slate-300 mb-1.5">Time</span>
            <select value={time} onChange={(e) => setTime(e.target.value)} className={FIELD}>
              <option value="">Select time</option>
              {TIME_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm text-slate-300 mb-1.5">Leverage</span>
            <select value={leverage} onChange={(e) => setLeverage(e.target.value)} className={FIELD}>
              <option value="">Select leverage</option>
              {LEVERAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm text-slate-300 mb-1.5">Account</span>
            <select value={account} onChange={(e) => setAccount(e.target.value)} className={FIELD}>
              <option value="real">Real Account</option>
              <option value="practice">Practice Account</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              disabled={!!submitting}
              onClick={() => submit('buy')}
              className="h-12 rounded-md bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold"
            >
              {submitting === 'buy' ? 'Buying...' : 'Buy'}
            </button>
            <button
              type="button"
              disabled={!!submitting}
              onClick={() => submit('sell')}
              className="h-12 rounded-md bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold"
            >
              {submitting === 'sell' ? 'Selling...' : 'Sell'}
            </button>
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {notice ? <p className="text-sm text-emerald-400">{notice}</p> : null}
        </form>
      </div>

      <section className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Trades</h2>
        {trades.length === 0 ? (
          <div>
            <div className="hidden sm:grid grid-cols-7 text-xs uppercase tracking-wide text-slate-500 pb-3 border-b border-dark-border">
              {['SN', 'Asset', 'Trade Type', 'Date', 'Amount', 'Status', 'Action'].map((header) => (
                <span key={header}>{header}</span>
              ))}
            </div>
            <p className="py-10 text-center text-sm text-slate-500">No recent trades</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                {trades.map((trade, index) => {
                  const notes = parseTradeNotes(trade.notes)
                  const status = notes.status || 'open'
                  const side = notes.side || trade.result
                  return (
                    <tr key={trade.id} className="border-b border-dark-border/60 last:border-0">
                      <td className="py-3 pr-4 text-slate-300">{String(index + 1).padStart(2, '0')}</td>
                      <td className="py-3 pr-4 text-white">{notes.asset || trade.trader_name}</td>
                      <td className={`py-3 pr-4 font-medium ${side === 'sell' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {side === 'sell' ? 'Sell' : 'Buy'}
                      </td>
                      <td className="py-3 pr-4 text-slate-300">{formatDate(trade.created_at)}</td>
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

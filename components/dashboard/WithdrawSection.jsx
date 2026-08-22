'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { formatDate, formatUsd } from '@/components/dashboard/userDisplay'
import { createWithdrawalRequest, listAccounts, listPayments } from '@/lib/tradingAdminApi'

const CARD = 'rounded-2xl border border-dark-border bg-dark-card'
const INITIAL_WALLETS = 6

const WALLETS = [
  { id: '1inch', name: '1inch Wallet', color: 'bg-red-500/20 text-red-300', logo: '/wallets/1inch.svg' },
  { id: 'argent', name: 'Argent', color: 'bg-orange-500/20 text-orange-300', logo: '/wallets/argent.svg' },
  { id: 'bitget', name: 'Bitget Wallet', color: 'bg-sky-500/20 text-sky-300', logo: '/wallets/bitget.svg' },
  { id: 'exodus', name: 'Exodus', color: 'bg-indigo-500/20 text-indigo-200', logo: '/wallets/exodus.svg' },
  { id: 'hot', name: 'Hot Wallet', color: 'bg-rose-500/20 text-rose-300', logo: '/wallets/hot.png' },
  { id: 'kucoin', name: 'Kucoin Web3 Wallet', color: 'bg-emerald-500/20 text-emerald-300', logo: '/wallets/kucoin.svg' },
  { id: 'metamask', name: 'MetaMask', color: 'bg-amber-500/20 text-amber-300', logo: '/wallets/metamask.svg' },
  { id: 'trust', name: 'Trust Wallet', color: 'bg-blue-500/20 text-blue-300', logo: '/wallets/trust.svg' },
  { id: 'phantom', name: 'Phantom', color: 'bg-violet-500/20 text-violet-300', logo: '/wallets/phantom.svg' },
  { id: 'coinbase', name: 'Coinbase Wallet', color: 'bg-primary/20 text-primary', logo: '/wallets/coinbase.svg' },
  { id: 'rainbow', name: 'Rainbow', color: 'bg-pink-500/20 text-pink-300', logo: '/wallets/rainbow.svg' },
  { id: 'okx', name: 'OKX Wallet', color: 'bg-slate-400/20 text-slate-200', logo: '/wallets/okx.svg' },
  { id: 'binance', name: 'Binance Wallet', color: 'bg-yellow-500/20 text-yellow-300', logo: '/wallets/binance.svg' },
  { id: 'ledger', name: 'Ledger', color: 'bg-slate-500/20 text-slate-100', logo: '/wallets/ledger.svg' },
  { id: 'safepal', name: 'SafePal', color: 'bg-teal-500/20 text-teal-300', logo: '/wallets/safepal.svg' },
  { id: 'tokenpocket', name: 'TokenPocket', color: 'bg-cyan-500/20 text-cyan-300', logo: '/wallets/tokenpocket.svg' },
]

function WalletConnectMark({ className = 'w-16 h-10' }) {
  return (
    <svg className={className} viewBox="0 0 40 24" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M8.16 7.05c6.35-6.22 16.33-6.22 22.68 0l.75.74c.31.3.31.8 0 1.1l-2.58 2.53c-.16.15-.41.15-.57 0l-1.04-1.02c-4.43-4.33-11.6-4.33-16.03 0L10.33 11.4c-.16.16-.41.16-.57 0L7.18 8.89c-.31-.3-.31-.8 0-1.1l.98-.74Zm27.7 5.13 2.3 2.25c.31.3.31.8 0 1.1L27.7 25.6c-.31.3-.82.3-1.13 0l-7.38-7.22a.4.4 0 0 0-.56 0l-7.38 7.22c-.31.3-.82.3-1.13 0L.84 15.53c-.31-.3-.31-.8 0-1.1l2.3-2.25c.31-.3.82-.3 1.13 0l7.38 7.22c.15.15.4.15.56 0l7.38-7.22c.31-.3.82-.3 1.13 0l7.38 7.22c.15.15.4.15.56 0l7.38-7.22c.31-.3.82-.3 1.13 0Z"
      />
    </svg>
  )
}

function WalletConnectLoader({ walletName }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-primary/25 animate-ping" />
        <span className="absolute inset-2 rounded-full border-2 border-primary/40 animate-pulse" />
        <span className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
        <span className="relative text-primary">
          <WalletConnectMark />
        </span>
      </div>
      <p className="mt-6 text-sm italic text-primary/90">Initializing secure connection to WC2.0 protocol...</p>
      {walletName ? <p className="mt-2 text-xs text-slate-500">Connecting to {walletName}</p> : null}
    </div>
  )
}
  const [failed, setFailed] = useState(false)
  const box = size === 'sm' ? 'h-9 w-9 rounded-xl p-1' : 'h-12 w-12 rounded-2xl p-1.5'
  const fallback = size === 'sm' ? 'h-9 w-9 rounded-xl text-xs' : 'h-12 w-12 rounded-2xl text-sm'

  if (failed) {
    return (
      <span className={`inline-flex items-center justify-center font-semibold ${fallback} ${wallet.color}`}>
        {wallet.name.slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center justify-center overflow-hidden bg-white ${box}`}>
      <img
        src={wallet.logo}
        alt=""
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  )
}

export default function WithdrawSection() {
  const { user } = useAuth()
  const [phase, setPhase] = useState('intro')
  const [showAllWallets, setShowAllWallets] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState(null)
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('')
  const [accounts, setAccounts] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function load() {
    const [accountRows, paymentRows] = await Promise.all([listAccounts(), listPayments()])
    setAccounts(accountRows || [])
    setWithdrawals((paymentRows || []).filter((row) => row.payment_type === 'withdrawal'))
  }

  useEffect(() => {
    if (phase !== 'connecting') return undefined
    const timer = setTimeout(() => setPhase('pair'), 2800)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (!user) return
    let mounted = true
    load().catch((e) => {
      if (mounted) setError(e?.message || 'Could not load withdrawals.')
    })
    return () => {
      mounted = false
    }
  }, [user])

  const myAccount = accounts.find((row) => row.user_clerk_id === user?.id || row.user_email === user?.email)
  const balance = Number(myAccount?.balance || 0)
  const visibleWallets = showAllWallets ? WALLETS : WALLETS.slice(0, INITIAL_WALLETS)
  const parsedAmount = Number(amount)
  const step = phase === 'withdraw' || phase === 'done' ? 2 : 1

  const mine = useMemo(
    () =>
      withdrawals.filter((row) => row.user_clerk_id === user?.id || row.user_email === user?.email),
    [withdrawals, user]
  )

  function chooseWallet(wallet) {
    setSelectedWallet(wallet)
    setError('')
    setNotice('')
    setPhase('connecting')
  }

  function saveDestination() {
    const address = destination.trim()
    if (address.length < 8) {
      setError('Enter the public wallet address where you want funds sent.')
      return
    }
    setError('')
    setPhase('withdraw')
  }

  async function submitWithdrawal() {
    if (!(parsedAmount > 0)) {
      setError('Enter a valid withdrawal amount.')
      return
    }
    if (parsedAmount > balance) {
      setError('Amount exceeds your available balance.')
      return
    }
    if (!destination.trim()) {
      setError('Add a public destination address first.')
      return
    }
    setSubmitting(true)
    setError('')
    setNotice('')
    try {
      await createWithdrawalRequest({
        user_email: user?.email || '',
        amount_usd: parsedAmount,
        amount_crypto: 0,
        method: selectedWallet?.name || 'Wallet',
        status: 'pending',
        notes: `Withdrawal to ${destination.trim()} via ${selectedWallet?.name || 'wallet'}`,
      })
      setNotice('Withdrawal request submitted. Admin will process it after review.')
      setAmount('')
      await load()
      setPhase('done')
    } catch (e) {
      setError(e?.message || 'Could not submit withdrawal.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Withdraw</h1>
      <div className="flex items-center gap-3">
        {[
          { n: 1, label: 'Validate' },
          { n: 2, label: 'Withdraw' },
        ].map((item, index) => (
          <div key={item.label} className="flex items-center gap-3">
            {index > 0 ? <span className={`h-px w-10 ${step > 1 ? 'bg-primary' : 'bg-slate-700'}`} /> : null}
            <span
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                step >= item.n ? 'bg-primary text-white' : 'bg-[#152033] text-slate-400'
              }`}
            >
              {step > item.n ? '✓' : item.n}
            </span>
            <span className={`text-sm ${step >= item.n ? 'text-white' : 'text-slate-500'}`}>{item.label}</span>
          </div>
        ))}
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-400">{notice}</p> : null}

      {phase !== 'intro' && phase !== 'done' && phase !== 'connecting' ? (
        <button
          type="button"
          onClick={() => {
            setError('')
            if (phase === 'wallets') setPhase('intro')
            else if (phase === 'pair') setPhase('wallets')
            else setPhase('pair')
          }}
          className="text-sm text-slate-300 hover:text-white"
        >
          ← Back
        </button>
      ) : null}

      <section className={`${CARD} p-5 sm:p-8`}>
        {phase === 'intro' ? (
          <div className="flex flex-col items-center text-center py-6">
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-primary mb-5">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 5-3.2 8.4-7 9-3.8-.6-7-4-7-9V6l7-3z" />
                <path strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
            </span>
            <p className="max-w-md text-slate-300">
              Wallet validation is required before you can withdraw. Choose a wallet type, then add the public address where funds should be sent.
            </p>
            <button
              type="button"
              onClick={() => setPhase('wallets')}
              className="mt-6 h-12 px-8 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold"
            >
              Validate Wallet →
            </button>
          </div>
        ) : null}

        {phase === 'wallets' ? (
          <div>
            <p className="text-center text-sm font-semibold tracking-[0.18em] text-slate-400 mb-5">WALLETCONNECT</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {visibleWallets.map((wallet) => (
                <button
                  key={wallet.id}
                  type="button"
                  onClick={() => chooseWallet(wallet)}
                  className="rounded-2xl border border-dark-border bg-[#0b1220] p-4 hover:border-primary/50 transition-colors"
                >
                  <WalletMark wallet={wallet} />
                  <p className="mt-3 text-sm text-white">{wallet.name}</p>
                </button>
              ))}
            </div>
            {!showAllWallets ? (
              <button
                type="button"
                onClick={() => setShowAllWallets(true)}
                className="mt-5 w-full h-11 rounded-xl border border-dark-border text-sm text-slate-200 hover:border-primary/50"
              >
                Load more
              </button>
            ) : (
              <p className="mt-4 text-center text-xs text-slate-500">All wallet options are shown on this page.</p>
            )}
          </div>
        ) : null}

        {phase === 'connecting' ? <WalletConnectLoader walletName={selectedWallet?.name} /> : null}

        {phase === 'pair' && selectedWallet ? (
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex items-center gap-3">
              <WalletMark wallet={selectedWallet} size="sm" />
              <p className="text-white font-medium">{selectedWallet.name}</p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Cannot establish connection to {selectedWallet.name}. Try manual pairing below.
            </div>
            <p className="text-sm text-slate-400">
              Enter the public wallet address for this {selectedWallet.name} withdrawal. Recovery phrases and private keys are not accepted.
            </p>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Destination address</label>
              <textarea
                rows={3}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={`Enter your ${selectedWallet.name} public address`}
                className="w-full rounded-xl bg-[#0b1220] border border-dark-border px-3 py-3 text-sm text-white"
              />
            </div>
            <button
              type="button"
              onClick={saveDestination}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold"
            >
              Continue with {selectedWallet.name}
            </button>
          </div>
        ) : null}

        {phase === 'withdraw' ? (
          <div className="space-y-4 max-w-xl mx-auto">
            <p className="text-sm text-slate-400">
              Available balance: <span className="text-white font-semibold">{formatUsd(balance)}</span>
            </p>
            <div className="rounded-xl bg-[#0b1220] border border-dark-border p-4 text-sm">
              <p className="text-xs text-slate-500">Wallet</p>
              <div className="mt-1 flex items-center gap-3">
                {selectedWallet ? <WalletMark wallet={selectedWallet} size="sm" /> : null}
                <p className="text-white">{selectedWallet?.name || 'Wallet'}</p>
              </div>
              <p className="mt-3 text-xs text-slate-500">Destination</p>
              <p className="text-white break-all">{destination}</p>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Amount (USD)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-12 rounded-xl bg-[#0b1220] border border-dark-border px-3 text-white"
              />
            </div>
            <button
              type="button"
              disabled={submitting || balance <= 0}
              onClick={submitWithdrawal}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold"
            >
              {submitting ? 'Submitting...' : 'Submit withdrawal'}
            </button>
          </div>
        ) : null}

        {phase === 'done' ? (
          <div className="text-center py-6">
            <p className="text-white font-semibold">Withdrawal submitted</p>
            <p className="mt-2 text-sm text-slate-400">It will appear in the history below as pending until admin processes it.</p>
            <button
              type="button"
              onClick={() => {
                setPhase('withdraw')
                setNotice('')
              }}
              className="mt-5 h-11 px-6 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold"
            >
              Make another withdrawal
            </button>
          </div>
        ) : null}
      </section>

      <section className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-lg font-semibold text-white mb-4">Withdrawals</h2>
        {mine.length === 0 ? (
          <div>
            <div className="hidden sm:grid grid-cols-4 text-xs uppercase tracking-wide text-slate-500 pb-3 border-b border-dark-border">
              {['SN', 'Amount', 'Date', 'Status'].map((header) => (
                <span key={header}>{header}</span>
              ))}
            </div>
            <p className="py-10 text-center text-sm text-slate-500">No withdrawals yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-dark-border">
                  {['SN', 'Amount', 'Date', 'Status'].map((header) => (
                    <th key={header} className="pb-3 pr-4 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mine.map((row, index) => (
                  <tr key={row.id} className="border-b border-dark-border/60 last:border-0">
                    <td className="py-3 pr-4 text-slate-300">{String(index + 1).padStart(2, '0')}</td>
                    <td className="py-3 pr-4 text-white">{formatUsd(row.amount_usd)}</td>
                    <td className="py-3 pr-4 text-slate-300">{formatDate(row.created_at)}</td>
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

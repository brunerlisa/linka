'use client'

import { useState, useEffect } from 'react'
import {
  listPayments,
  listAccounts,
  updatePaymentStatus,
  upsertAccount,
} from '@/lib/tradingAdminApi'

export default function AdminDepositsPage() {
  const [payments, setPayments] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  const load = async () => {
    const [p, a] = await Promise.all([listPayments(), listAccounts()])
    setPayments(p || [])
    setAccounts(a || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleApprove = async (payment) => {
    setNotice('')
    try {
      await updatePaymentStatus(payment.id, 'approved')
      const existing = accounts.find(
        (ac) =>
          (ac.user_email || '').toLowerCase() === (payment.user_email || '').toLowerCase() ||
          (ac.user_clerk_id || '') === (payment.user_clerk_id || '')
      )
      const currentBalance = Number(existing?.balance || 0)
      const amount = Number(payment.amount_usd || 0)
      await upsertAccount({
        ...existing,
        user_email: (payment.user_email || '').trim().toLowerCase(),
        user_clerk_id: payment.user_clerk_id || existing?.user_clerk_id || '',
        balance: currentBalance + amount,
        profit: Number(existing?.profit || 0),
        status: existing?.status || 'active',
      })
      setNotice(`Approved $${amount.toLocaleString()} for ${payment.user_email}. Account credited.`)
      load()
    } catch (e) {
      setNotice(e?.message || 'Failed to approve.')
    }
  }

  const handleReject = async (payment) => {
    setNotice('')
    try {
      await updatePaymentStatus(payment.id, 'rejected')
      setNotice('Deposit rejected.')
      load()
    } catch (e) {
      setNotice(e?.message || 'Failed to reject.')
    }
  }

  const pending = payments.filter((p) => (p.status || '').toLowerCase() === 'pending')
  const other = payments.filter((p) => (p.status || '').toLowerCase() !== 'pending')

  return (
    <div className="p-6">
      <header className="h-14 border-b border-[#111827] flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Deposits</h1>
      </header>

      {notice && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 text-sm border border-emerald-500/20">
          {notice}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Pending Deposit Requests ({pending.length})</h3>
          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : pending.length === 0 ? (
            <p className="text-sm text-slate-400">No pending deposits.</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {pending.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-lg border border-[#1f2937] bg-[#060d1f] flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm text-white font-medium">{p.user_email || 'Unknown user'}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      ${Number(p.amount_usd || 0).toLocaleString()} • {p.method || '-'} • {p.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(p)}
                      className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-emerald-500/30"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(p)}
                      className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 text-sm font-medium hover:bg-red-500/30"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">All Deposit History ({payments.length})</h3>
          {other.length === 0 ? (
            <p className="text-sm text-slate-400">No other deposits yet.</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {other.map((p) => (
                <div key={p.id} className="p-3 rounded-lg border border-[#1f2937] bg-[#060d1f]">
                  <p className="text-sm text-white">{p.user_email}</p>
                  <p className="text-xs text-slate-400">
                    ${Number(p.amount_usd || 0).toLocaleString()} • {p.method || '-'} • <span className={p.status === 'approved' ? 'text-emerald-400' : 'text-red-400'}>{p.status}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

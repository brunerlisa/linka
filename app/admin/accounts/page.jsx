'use client'

import { useState, useEffect } from 'react'
import { listAccounts, listUsers, upsertAccount } from '@/lib/tradingAdminApi'

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({
    user_email: '',
    user_clerk_id: '',
    balance: 0,
    addAmount: 0,
    profit: 0,
    status: 'active',
  })

  const load = async () => {
    const [a, u] = await Promise.all([listAccounts(), listUsers()])
    setAccounts(a || [])
    setUsers(u || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleAddFunds = async () => {
    const email = (form.user_email || '').trim().toLowerCase()
    if (!email) return
    setNotice('')
    try {
      const existing = accounts.find((ac) => (ac.user_email || '').toLowerCase() === email)
      const currentBalance = Number(existing?.balance || 0)
      const addAmount = Number(form.addAmount || 0)
      await upsertAccount({
        ...existing,
        user_email: email,
        user_clerk_id: form.user_clerk_id || existing?.user_clerk_id || '',
        balance: currentBalance + addAmount,
        profit: Number(existing?.profit || 0),
        status: form.status || existing?.status || 'active',
      })
      setNotice(`Added $${addAmount.toLocaleString()} to ${email}. New balance: $${(currentBalance + addAmount).toLocaleString()}.`)
      setForm((p) => ({ ...p, addAmount: 0 }))
      load()
    } catch (e) {
      setNotice(e?.message || 'Failed to add funds.')
    }
  }

  const handleSetBalance = async () => {
    const email = (form.user_email || '').trim().toLowerCase()
    if (!email) return
    setNotice('')
    try {
      const existing = accounts.find((ac) => (ac.user_email || '').toLowerCase() === email)
      await upsertAccount({
        ...existing,
        user_email: email,
        user_clerk_id: form.user_clerk_id || existing?.user_clerk_id || '',
        balance: Number(form.balance || 0),
        profit: Number(form.profit || 0),
        status: form.status || existing?.status || 'active',
      })
      setNotice(`Account updated for ${email}. Balance set to $${Number(form.balance || 0).toLocaleString()}.`)
      load()
    } catch (e) {
      setNotice(e?.message || 'Failed to update account.')
    }
  }

  const selectUser = (u) => {
    const ac = accounts.find((a) => (a.user_email || '').toLowerCase() === (u.email || '').toLowerCase())
    setForm({
      user_email: u.email || '',
      user_clerk_id: u.clerk_user_id || ac?.user_clerk_id || '',
      balance: Number(ac?.balance || 0),
      addAmount: 0,
      profit: Number(ac?.profit || 0),
      status: ac?.status || 'active',
    })
  }

  return (
    <div className="p-6">
      <header className="h-14 border-b border-[#111827] flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">User Accounts</h1>
      </header>

      {notice && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 text-sm border border-emerald-500/20">
          {notice}
        </div>
      )}

      <div className="grid xl:grid-cols-[360px_1fr] gap-6">
        <div className="bg-[#050712] border border-[#111827] rounded-xl p-4 space-y-4">
          <h3 className="text-sm font-semibold text-white">Add Funds or Set Balance</h3>
          <input
            value={form.user_email}
            onChange={(e) => setForm((p) => ({ ...p, user_email: e.target.value }))}
            placeholder="User email"
            className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-sm text-white placeholder:text-slate-500"
          />
          <input
            value={form.user_clerk_id}
            onChange={(e) => setForm((p) => ({ ...p, user_clerk_id: e.target.value }))}
            placeholder="Clerk user ID (optional)"
            className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-sm text-white placeholder:text-slate-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={form.addAmount}
              onChange={(e) => setForm((p) => ({ ...p, addAmount: Number(e.target.value) }))}
              placeholder="Amount to add"
              className="rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-sm text-white"
            />
            <input
              type="number"
              value={form.balance}
              onChange={(e) => setForm((p) => ({ ...p, balance: Number(e.target.value) }))}
              placeholder="Balance (for Set)"
              className="rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-sm text-white"
            />
          </div>
          <input
            type="number"
            value={form.profit}
            onChange={(e) => setForm((p) => ({ ...p, profit: Number(e.target.value) }))}
            placeholder="Profit"
            className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-sm text-white"
          />
          <select
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
            className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-sm text-white"
          >
            <option value="active">active</option>
            <option value="suspended">suspended</option>
            <option value="pending">pending</option>
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddFunds}
              className="flex-1 py-2 rounded-md bg-primary hover:bg-primary-dark text-sm font-semibold text-white"
            >
              Add Funds
            </button>
            <button
              type="button"
              onClick={handleSetBalance}
              className="flex-1 py-2 rounded-md bg-[#1e293b] hover:bg-[#334155] text-sm font-semibold text-slate-200"
            >
              Set Balance
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">User Accounts ({accounts.length})</h3>
            {loading ? (
              <p className="text-sm text-slate-400">Loading...</p>
            ) : accounts.length === 0 ? (
              <p className="text-sm text-slate-400">No accounts yet. Users will get accounts when deposits are approved.</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {accounts.map((a) => (
                  <div
                    key={a.id || a.user_email}
                    onClick={() => setForm({
                      user_email: a.user_email || '',
                      user_clerk_id: a.user_clerk_id || '',
                      balance: Number(a.balance || 0),
                      addAmount: 0,
                      profit: Number(a.profit || 0),
                      status: a.status || 'active',
                    })}
                    className="p-3 rounded-lg border border-[#1f2937] bg-[#060d1f] cursor-pointer hover:border-primary/40"
                  >
                    <p className="text-sm text-white">{a.user_email}</p>
                    <p className="text-xs text-slate-400">
                      Balance: ${Number(a.balance || 0).toLocaleString()} • Profit: ${Number(a.profit || 0).toLocaleString()} • {a.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Registered Users ({users.length})</h3>
            {users.length === 0 ? (
              <p className="text-sm text-slate-400">No users yet.</p>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {users.map((u) => (
                  <button
                    key={u.clerk_user_id || u.email}
                    type="button"
                    onClick={() => selectUser(u)}
                    className="w-full p-2 rounded-lg border border-[#1f2937] bg-[#060d1f] text-left text-sm text-slate-200 hover:border-primary/40"
                  >
                    {u.email} {u.role === 'admin' && <span className="text-amber-400 text-xs">(admin)</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

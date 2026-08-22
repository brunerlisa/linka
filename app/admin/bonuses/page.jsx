'use client'

import { useEffect, useState } from 'react'
import { assignBonus, listPayments, listUsers, updatePaymentStatus } from '@/lib/tradingAdminApi'
import { formatDate, formatUsd } from '@/components/dashboard/userDisplay'

export default function AdminBonusesPage() {
  const [users, setUsers] = useState([])
  const [bonuses, setBonuses] = useState([])
  const [form, setForm] = useState({ user_email: '', amount_usd: '', asset: 'USD', notes: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const [userRows, paymentRows] = await Promise.all([listUsers(), listPayments()])
    setUsers(userRows || [])
    setBonuses((paymentRows || []).filter((row) => row.payment_type === 'bonus'))
  }

  useEffect(() => {
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
  }, [])

  async function assign(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    setSaving(true)
    try {
      await assignBonus({
        user_email: form.user_email,
        amount_usd: Number(form.amount_usd),
        method: form.asset,
        notes: form.notes,
      })
      setNotice(`Bonus assigned to ${form.user_email}.`)
      setForm((prev) => ({ ...prev, amount_usd: '', notes: '' }))
      await load()
    } catch (e) {
      setError(e?.message || 'Could not assign bonus.')
    } finally {
      setSaving(false)
    }
  }

  async function cancelBonus(id) {
    setError('')
    setNotice('')
    try {
      await updatePaymentStatus(id, 'cancelled')
      setNotice('Bonus cancelled.')
      await load()
    } catch (e) {
      setError(e?.message || 'Could not cancel bonus.')
    }
  }

  return (
    <div className="p-6">
      <header className="h-14 border-b border-[#111827] flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Bonuses</h1>
      </header>

      {notice ? (
        <div className="mb-4 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 text-sm border border-emerald-500/20">
          {notice}
        </div>
      ) : null}
      {error ? (
        <div className="mb-4 px-4 py-2 rounded-lg bg-red-500/10 text-red-300 text-sm border border-red-500/20">
          {error}
        </div>
      ) : null}

      <form onSubmit={assign} className="bg-[#050712] border border-[#111827] rounded-xl p-4 mb-6 grid md:grid-cols-2 xl:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">User</label>
          <select
            required
            value={form.user_email}
            onChange={(e) => setForm((p) => ({ ...p, user_email: e.target.value }))}
            className="w-full h-10 rounded-md bg-[#020617] border border-[#1f2937] px-3 text-sm text-white"
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u.email || u.clerk_user_id} value={u.email}>
                {u.full_name ? `${u.full_name} (${u.email})` : u.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Amount USD</label>
          <input
            required
            type="number"
            min="1"
            step="0.01"
            value={form.amount_usd}
            onChange={(e) => setForm((p) => ({ ...p, amount_usd: e.target.value }))}
            className="w-full h-10 rounded-md bg-[#020617] border border-[#1f2937] px-3 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Asset</label>
          <select
            value={form.asset}
            onChange={(e) => setForm((p) => ({ ...p, asset: e.target.value }))}
            className="w-full h-10 rounded-md bg-[#020617] border border-[#1f2937] px-3 text-sm text-white"
          >
            {['USD', 'USDT', 'BTC', 'ETH'].map((asset) => (
              <option key={asset} value={asset}>
                {asset}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Note</label>
          <input
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Welcome bonus"
            className="w-full h-10 rounded-md bg-[#020617] border border-[#1f2937] px-3 text-sm text-white"
          />
        </div>
        <div className="md:col-span-2 xl:col-span-4">
          <button
            type="submit"
            disabled={saving}
            className="h-10 px-5 rounded-md bg-primary hover:bg-primary-dark disabled:opacity-60 text-sm font-semibold text-white"
          >
            {saving ? 'Assigning...' : 'Assign bonus'}
          </button>
        </div>
      </form>

      <div className="bg-[#050712] border border-[#111827] rounded-xl p-4 overflow-x-auto">
        <h2 className="text-sm font-semibold text-white mb-3">All bonuses</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : bonuses.length === 0 ? (
          <p className="text-sm text-slate-500">No bonuses assigned yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-[#1f2937]">
                {['User', 'Asset', 'Amount', 'Status', 'Date', 'Action'].map((header) => (
                  <th key={header} className="pb-2 pr-4 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bonuses.map((row) => (
                <tr key={row.id} className="border-b border-[#1f2937]/50">
                  <td className="py-2 pr-4 text-white">{row.user_email}</td>
                  <td className="py-2 pr-4 text-slate-300">{row.method || 'USD'}</td>
                  <td className="py-2 pr-4 text-white">{formatUsd(row.amount_usd)}</td>
                  <td className="py-2 pr-4 capitalize text-slate-300">{row.status}</td>
                  <td className="py-2 pr-4 text-slate-400">{formatDate(row.created_at)}</td>
                  <td className="py-2 pr-4">
                    {String(row.status).toLowerCase() === 'available' ? (
                      <button
                        type="button"
                        onClick={() => cancelBonus(row.id)}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

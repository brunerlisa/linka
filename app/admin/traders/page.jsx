'use client'

import { useState, useEffect, useRef } from 'react'
import { listTraders, seedDemoTraders, upsertTrader, deleteTrader } from '@/lib/tradingAdminApi'

const defaultTrader = {
  name: '',
  avatar_url: '',
  risk: 'Low',
  style: 'Mixed',
  monthly_profit: 90,
  yearly_profit: 95,
  win_rate: 90,
  experience_years: 8,
  fee_percent: 10,
  min_capital: 10000,
  copiers: 0,
  status: 'ACTIVE',
  bio: '',
}

export default function AdminTradersPage() {
  const [traders, setTraders] = useState([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [notice, setNotice] = useState('')
  const [noticeError, setNoticeError] = useState(false)
  const [form, setForm] = useState(defaultTrader)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const load = async () => {
    const rows = await listTraders()
    setTraders(rows || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleSeed = async () => {
    setSeeding(true)
    setNotice('')
    setNoticeError(false)
    try {
      const rows = await seedDemoTraders()
      setTraders(rows || [])
      setNotice(`Loaded ${(rows || []).length} demo traders. They now appear on the platform.`)
      setNoticeError(false)
    } catch (e) {
      setNotice(e?.message || 'Failed to seed traders.')
      setNoticeError(true)
    } finally {
      setSeeding(false)
    }
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setNotice('')
    setNoticeError(false)
    try {
      await upsertTrader(form)
      setForm(defaultTrader)
      setNotice('Trader saved. It will appear on the platform.')
      setNoticeError(false)
      load()
    } catch (e) {
      setNotice(e?.message || 'Failed to save trader.')
      setNoticeError(true)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this trader from the platform?')) return
    setNotice('')
    setNoticeError(false)
    try {
      await deleteTrader(id)
      setNotice('Trader removed.')
      setNoticeError(false)
      load()
    } catch (e) {
      setNotice(e?.message || 'Failed to delete.')
      setNoticeError(true)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setNotice('')
    setNoticeError(false)
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (form.id) fd.append('traderId', form.id)
      const res = await fetch('/api/upload/trader', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setForm((p) => ({ ...p, avatar_url: data.url }))
      setNotice('Image uploaded. Click Add/Update Trader to save.')
      setNoticeError(false)
    } catch (err) {
      setNotice(err?.message || 'Upload failed. Create the Supabase "traders" bucket (Storage > New bucket > Public).')
      setNoticeError(true)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const editTrader = (t) => {
    setForm({
      id: t.id,
      name: t.name || '',
      avatar_url: t.avatar_url || '',
      risk: t.risk || 'Low',
      style: t.style || 'Mixed',
      monthly_profit: Number(t.monthly_profit ?? 0),
      yearly_profit: Number(t.yearly_profit ?? 0),
      win_rate: Number(t.win_rate ?? 0),
      experience_years: Number(t.experience_years ?? 0),
      fee_percent: Number(t.fee_percent ?? 10),
      min_capital: Number(t.min_capital ?? 10000),
      copiers: Number(t.copiers ?? 0),
      status: t.status || 'ACTIVE',
      bio: t.bio || '',
    })
  }

  return (
    <div className="p-6">
      <header className="h-14 border-b border-[#111827] flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Manage Traders</h1>
      </header>

      {notice && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm border ${noticeError ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'}`}>
          {notice}
        </div>
      )}

      <div className="grid xl:grid-cols-[340px_1fr] gap-6">
        <div className="bg-[#050712] border border-[#111827] rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white">{form.id ? 'Edit Trader' : 'Add New Trader'}</h3>
          <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Trader name" className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-sm text-white placeholder:text-slate-500" />
          <div className="space-y-2">
            <label className="block text-xs text-slate-400">Trader avatar</label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-2 rounded-md bg-[#1e293b] text-xs text-slate-200 hover:bg-[#334155] disabled:opacity-60"
              >
                {uploading ? 'Uploading...' : 'Upload image'}
              </button>
              <input value={form.avatar_url} onChange={(e) => setForm((p) => ({ ...p, avatar_url: e.target.value }))} placeholder="Or paste URL" className="flex-1 rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-xs text-white placeholder:text-slate-500" />
            </div>
            {form.avatar_url && (
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#1f2937] bg-[#0b1020]">
                <img src={form.avatar_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select value={form.risk} onChange={(e) => setForm((p) => ({ ...p, risk: e.target.value }))} className="rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-sm text-white">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <input value={form.style} onChange={(e) => setForm((p) => ({ ...p, style: e.target.value }))} placeholder="Style" className="rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-sm text-white placeholder:text-slate-500" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input type="number" value={form.monthly_profit} onChange={(e) => setForm((p) => ({ ...p, monthly_profit: Number(e.target.value) }))} placeholder="Monthly %" className="rounded-md bg-[#020617] border border-[#1f2937] px-2 py-2 text-sm text-white" />
            <input type="number" value={form.yearly_profit} onChange={(e) => setForm((p) => ({ ...p, yearly_profit: Number(e.target.value) }))} placeholder="Yearly %" className="rounded-md bg-[#020617] border border-[#1f2937] px-2 py-2 text-sm text-white" />
            <input type="number" value={form.win_rate} onChange={(e) => setForm((p) => ({ ...p, win_rate: Number(e.target.value) }))} placeholder="Win %" className="rounded-md bg-[#020617] border border-[#1f2937] px-2 py-2 text-sm text-white" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input type="number" value={form.experience_years} onChange={(e) => setForm((p) => ({ ...p, experience_years: Number(e.target.value) }))} placeholder="Exp yrs" className="rounded-md bg-[#020617] border border-[#1f2937] px-2 py-2 text-sm text-white" />
            <input type="number" value={form.fee_percent} onChange={(e) => setForm((p) => ({ ...p, fee_percent: Number(e.target.value) }))} placeholder="Fee %" className="rounded-md bg-[#020617] border border-[#1f2937] px-2 py-2 text-sm text-white" />
            <input type="number" value={form.copiers} onChange={(e) => setForm((p) => ({ ...p, copiers: Number(e.target.value) }))} placeholder="Copiers" className="rounded-md bg-[#020617] border border-[#1f2937] px-2 py-2 text-sm text-white" />
          </div>
          <input type="number" value={form.min_capital} onChange={(e) => setForm((p) => ({ ...p, min_capital: Number(e.target.value) }))} placeholder="Min capital USD" className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-sm text-white" />
          <textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Short bio" rows={2} className="w-full rounded-md bg-[#020617] border border-[#1f2937] px-3 py-2 text-sm text-white placeholder:text-slate-500" />
          <button type="button" onClick={handleSave} className="w-full py-2 rounded-md bg-primary hover:bg-primary-dark text-sm font-semibold text-white">
            {form.id ? 'Update Trader' : 'Add Trader'}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Traders on Platform ({traders.length})</h3>
            <button type="button" onClick={handleSeed} disabled={seeding || loading} className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-60 text-sm font-semibold text-white">
              {seeding ? 'Loading...' : 'Load Demo Traders'}
            </button>
          </div>
          <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
            {loading ? (
              <p className="text-sm text-slate-400">Loading...</p>
            ) : traders.length === 0 ? (
              <p className="text-sm text-slate-400">No traders yet. Add one or load demo traders.</p>
            ) : (
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {traders.map((t) => (
                  <div key={t.id} className="p-3 rounded-lg border border-[#1f2937] bg-[#060d1f] flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-white font-medium">{t.name}</p>
                      <p className="text-xs text-slate-400">+{Number(t.monthly_profit || 0)}% monthly • {t.risk || 'Low'} • {t.style || 'Mixed'} • {t.copiers || 0} copiers</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => editTrader(t)} className="px-3 py-1.5 rounded bg-[#1e293b] text-xs text-slate-200 hover:bg-[#334155]">Edit</button>
                      <button type="button" onClick={() => handleDelete(t.id)} className="px-3 py-1.5 rounded bg-red-500/20 text-red-300 text-xs hover:bg-red-500/30">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

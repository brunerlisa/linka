'use client'

import { useEffect, useMemo, useState } from 'react'
import { listUsers, updateKycStatus } from '@/lib/tradingAdminApi'
import { formatDate } from '@/components/dashboard/userDisplay'

function parseKyc(raw) {
  if (!raw) return {}
  if (typeof raw === 'object') return raw
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function statusClass(status) {
  const value = String(status || 'not_submitted').toLowerCase()
  if (value === 'approved' || value === 'verified') return 'text-emerald-300'
  if (value === 'pending') return 'text-amber-300'
  if (value === 'rejected') return 'text-red-300'
  return 'text-slate-400'
}

export default function AdminKycPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const rows = await listUsers()
    setUsers(rows || [])
  }

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        await load()
      } catch (e) {
        if (mounted) setError(e?.message || 'Could not load KYC submissions.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  const submissions = useMemo(
    () =>
      users.filter((row) => {
        const status = String(row.kyc_status || 'not_submitted').toLowerCase()
        return status !== 'not_submitted' || row.kyc_json
      }),
    [users]
  )

  async function setStatus(user, kyc_status) {
    const key = user.clerk_user_id || user.email
    setError('')
    setNotice('')
    setUpdatingId(key)
    try {
      await updateKycStatus({
        clerk_user_id: user.clerk_user_id,
        email: user.email,
        kyc_status,
      })
      setNotice(`KYC ${kyc_status} for ${user.email}.`)
      await load()
    } catch (e) {
      setError(e?.message || 'Could not update KYC status.')
    } finally {
      setUpdatingId('')
    }
  }

  return (
    <div className="p-6">
      <header className="h-14 border-b border-[#111827] flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">KYC</h1>
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

      <div className="bg-[#050712] border border-[#111827] rounded-xl p-4">
        <h2 className="text-sm font-semibold text-white mb-3">KYC submissions</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-slate-500">No KYC submissions yet.</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((user) => {
              const kyc = parseKyc(user.kyc_json)
              const key = user.clerk_user_id || user.email
              const busy = updatingId === key
              const status = String(user.kyc_status || 'not_submitted').toLowerCase()
              return (
                <div key={key} className="p-4 rounded-lg border border-[#1f2937] bg-[#060d1f]">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-white">{kyc.fullName || user.full_name || 'User'}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                      <p className={`text-xs mt-1 capitalize ${statusClass(status)}`}>{status.replace('_', ' ')}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy || status === 'approved' || status === 'verified'}
                        onClick={() => setStatus(user, 'approved')}
                        className="px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-300 text-xs disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={busy || status === 'rejected'}
                        onClick={() => setStatus(user, 'rejected')}
                        className="px-3 py-1.5 rounded bg-red-500/20 text-red-300 text-xs disabled:opacity-40"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        disabled={busy || status === 'pending'}
                        onClick={() => setStatus(user, 'pending')}
                        className="px-3 py-1.5 rounded bg-amber-500/20 text-amber-300 text-xs disabled:opacity-40"
                      >
                        Mark pending
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid sm:grid-cols-2 gap-2 text-xs text-slate-400">
                    <p>Document: {kyc.documentType || '—'}</p>
                    <p>Country: {kyc.country || '—'}</p>
                    <p>Date of birth: {kyc.dateOfBirth || '—'}</p>
                    <p>Submitted: {formatDate(user.kyc_submitted_at)}</p>
                  </div>
                  {kyc.note ? <p className="mt-2 text-xs text-slate-500">{kyc.note}</p> : null}
                  <div className="mt-3 flex flex-wrap gap-3 text-xs">
                    {kyc.idDocumentFrontUrl ? (
                      <a href={kyc.idDocumentFrontUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        Front of document
                      </a>
                    ) : (
                      <span className="text-slate-500">No front document</span>
                    )}
                    {kyc.idDocumentBackUrl ? (
                      <a href={kyc.idDocumentBackUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        Back of document
                      </a>
                    ) : (
                      <span className="text-slate-500">No back document</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

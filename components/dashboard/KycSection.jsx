'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { formatDate } from '@/components/dashboard/userDisplay'
import { getMyProfile, syncProfile, uploadKycDocument } from '@/lib/tradingAdminApi'

const CARD = 'rounded-2xl border border-dark-border bg-dark-card'
const INPUT = 'w-full h-10 rounded-lg bg-[#0b1220] border border-dark-border px-3 text-sm text-white disabled:opacity-50'
const DOCUMENT_TYPES = ['National ID', "Driver's license", 'Passport']

function parseKyc(raw) {
  if (!raw) return {}
  if (typeof raw === 'object') return raw
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function statusMeta(status) {
  const value = String(status || 'not_submitted').toLowerCase()
  if (value === 'approved' || value === 'verified') {
    return { label: 'Approved', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' }
  }
  if (value === 'pending') {
    return { label: 'Pending review', className: 'bg-amber-500/15 text-amber-300 border-amber-500/20' }
  }
  if (value === 'rejected') {
    return { label: 'Rejected', className: 'bg-red-500/15 text-red-300 border-red-500/20' }
  }
  return { label: 'Not submitted', className: 'bg-slate-500/15 text-slate-300 border-slate-500/20' }
}

export default function KycSection() {
  const { user } = useAuth()
  const [status, setStatus] = useState('not_submitted')
  const [submittedAt, setSubmittedAt] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    dateOfBirth: '',
    documentType: 'National ID',
    country: '',
    note: '',
  })
  const [docFrontUrl, setDocFrontUrl] = useState('')
  const [docBackUrl, setDocBackUrl] = useState('')
  const [uploading, setUploading] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const locked = ['pending', 'approved', 'verified'].includes(String(status).toLowerCase())

  async function load() {
    const profile = await getMyProfile()
    const kyc = parseKyc(profile?.kyc_json)
    setStatus(profile?.kyc_status || 'not_submitted')
    setSubmittedAt(profile?.kyc_submitted_at || '')
    setForm({
      fullName: kyc.fullName || profile?.full_name || user?.fullName || '',
      dateOfBirth: kyc.dateOfBirth || '',
      documentType: kyc.documentType || 'National ID',
      country: kyc.country || '',
      note: kyc.note || '',
    })
    setDocFrontUrl(kyc.idDocumentFrontUrl || '')
    setDocBackUrl(kyc.idDocumentBackUrl || '')
  }

  useEffect(() => {
    if (!user) return
    let mounted = true
    async function run() {
      try {
        await load()
      } catch (e) {
        if (mounted) setError(e?.message || 'Could not load KYC details.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [user])

  async function handleUpload(side, file) {
    if (!file || locked) return
    setError('')
    setNotice('')
    setUploading(side)
    try {
      const uploaded = await uploadKycDocument(file, side)
      if (side === 'front') setDocFrontUrl(uploaded.url)
      else setDocBackUrl(uploaded.url)
      setNotice(`${side === 'front' ? 'Front' : 'Back'} of document uploaded.`)
    } catch (e) {
      setError(e?.message || 'Could not upload document.')
    } finally {
      setUploading('')
    }
  }

  async function submit(event) {
    event.preventDefault()
    if (locked) return
    setError('')
    setNotice('')
    if (!form.fullName.trim() || !form.dateOfBirth || !form.country.trim()) {
      setError('Enter your full name, date of birth, and country of issue.')
      return
    }
    if (!docFrontUrl) {
      setError('Upload the front of your document before submitting.')
      return
    }
    setSaving(true)
    try {
      await syncProfile({
        full_name: form.fullName.trim(),
        kyc_status: 'pending',
        kyc_submitted_at: new Date().toISOString(),
        kyc_json: JSON.stringify({
          ...form,
          fullName: form.fullName.trim(),
          country: form.country.trim(),
          idDocumentFrontUrl: docFrontUrl,
          idDocumentBackUrl: docBackUrl,
        }),
      })
      setStatus('pending')
      setSubmittedAt(new Date().toISOString())
      setNotice('KYC submitted for review.')
    } catch (e) {
      setError(e?.message || 'Could not submit KYC.')
    } finally {
      setSaving(false)
    }
  }

  const badge = statusMeta(status)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">KYC verification</h1>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badge.className}`}>
          {badge.label}
        </span>
      </div>
      <p className="text-sm text-slate-300 max-w-2xl">
        To comply with regulations and keep your account secure, we collect a few personal details and a government-issued ID.
      </p>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-400">{notice}</p> : null}

      <section className={`${CARD} p-5 sm:p-6`}>
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            {locked ? (
              <p className="text-sm text-slate-400">
                {String(status).toLowerCase() === 'pending'
                  ? `Your documents are under review${submittedAt ? ` since ${formatDate(submittedAt)}` : ''}.`
                  : 'Your identity has been verified. Contact support if you need to update these details.'}
              </p>
            ) : null}
            {String(status).toLowerCase() === 'rejected' ? (
              <p className="text-sm text-red-300">
                Your previous submission was rejected. Update your details and documents, then submit again.
              </p>
            ) : null}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full name</label>
                <input
                  required
                  disabled={locked}
                  value={form.fullName}
                  onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  className={INPUT}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Date of birth</label>
                <input
                  required
                  type="date"
                  disabled={locked}
                  value={form.dateOfBirth}
                  onChange={(e) => setForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                  className={INPUT}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Document type</label>
                <select
                  disabled={locked}
                  value={form.documentType}
                  onChange={(e) => setForm((prev) => ({ ...prev, documentType: e.target.value }))}
                  className={INPUT}
                >
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Country of issue</label>
                <input
                  required
                  disabled={locked}
                  value={form.country}
                  onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                  className={INPUT}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Extra notes (optional)</label>
              <textarea
                rows={2}
                disabled={locked}
                value={form.note}
                onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                placeholder="Any details we should know when reviewing your case"
                className="w-full rounded-lg bg-[#0b1220] border border-dark-border px-3 py-2 text-sm text-white disabled:opacity-50"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <KycFileField
                label="Front of document"
                required
                url={docFrontUrl}
                disabled={locked}
                uploading={uploading === 'front'}
                onPickFile={(file) => handleUpload('front', file)}
              />
              <KycFileField
                label="Back of document"
                url={docBackUrl}
                disabled={locked}
                uploading={uploading === 'back'}
                onPickFile={(file) => handleUpload('back', file)}
              />
            </div>
            <p className="text-xs text-slate-500">
              JPEG, PNG, WebP, or PDF. Max 5MB. Front is required. Back is recommended for ID cards and licenses.
            </p>

            {!locked ? (
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-60 text-sm font-semibold text-white"
              >
                {saving ? 'Submitting...' : 'Submit KYC for review'}
              </button>
            ) : null}
          </form>
        )}
      </section>
    </div>
  )
}

function KycFileField({ label, required, url, disabled, uploading, onPickFile }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-slate-400">
        {label}
        {required ? <span className="text-amber-400"> *</span> : null}
      </label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        disabled={disabled || uploading}
        className="w-full text-xs text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-primary/20 file:px-2 file:py-1 file:text-xs file:text-slate-200 disabled:opacity-50"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onPickFile(file)
          e.target.value = ''
        }}
      />
      {uploading ? <p className="text-xs text-slate-400">Uploading...</p> : null}
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
          Open uploaded file
        </a>
      ) : (
        <p className="text-xs text-slate-500">No file uploaded</p>
      )}
    </div>
  )
}

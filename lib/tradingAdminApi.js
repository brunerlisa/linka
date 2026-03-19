'use client'

/** API client for trading/admin data. Calls Next.js API routes. Clerk session sent via cookies. */

const API = '/api'

async function request(method, path, body) {
  const opts = { method, credentials: 'include', headers: { 'Content-Type': 'application/json' } }
  if (body !== undefined) opts.body = JSON.stringify(body)
  const res = await fetch(`${API}${path}`, opts)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || res.statusText || 'Request failed')
  }
  return res.json()
}

export async function listTraders() {
  return request('GET', '/traders')
}

export async function seedDemoTraders() {
  return request('POST', '/traders', { action: 'seed' })
}

export async function upsertTrader(trader) {
  if (trader.id) return request('PUT', `/traders/${trader.id}`, trader)
  return request('POST', '/traders', trader)
}

export async function deleteTrader(traderId) {
  await request('DELETE', `/traders/${traderId}`)
  return true
}

export async function listPayments() {
  return request('GET', '/payments')
}

export async function createPaymentRequest(payment) {
  return request('POST', '/payments', payment)
}

export async function createWithdrawalRequest(withdrawal) {
  return request('POST', '/payments', { ...withdrawal, payment_type: 'withdrawal' })
}

export async function updatePaymentStatus(paymentId, status) {
  return request('PATCH', `/payments/${paymentId}`, { status })
}

export async function listAccounts() {
  return request('GET', '/accounts')
}

export async function upsertAccount(account) {
  return request('POST', '/accounts', account)
}

export async function listTrades() {
  return request('GET', '/trade-updates')
}

export async function addTradeUpdate(trade) {
  return request('POST', '/trade-updates', trade)
}

export async function listUsers() {
  return request('GET', '/profiles')
}

export async function syncProfile(profile) {
  return request('POST', '/profiles', profile)
}

export async function getMyProfile() {
  return request('GET', '/profiles?me=1')
}

import { requireAuth, requireAdmin, ownsRecord } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { saveUserPlan, readStoredPlan } from '@/lib/userPlan'

const nowIso = () => new Date().toISOString()
const normalizeEmail = (v) => String(v || '').trim().toLowerCase()

export async function GET() {
  try {
    const user = await requireAuth()
    const { data, error } = await supabaseAdmin.from('user_accounts').select('*').order('created_at', { ascending: false })
    if (error) return Response.json({ error: error.message }, { status: 500 })
    const { data: profiles } = await supabaseAdmin.from('profiles').select('email, clerk_user_id, preferences_json')
    const list = (data || []).map((account) => {
      const profile = (profiles || []).find(
        (row) =>
          (row.clerk_user_id && row.clerk_user_id === account.user_clerk_id) ||
          (row.email && row.email.toLowerCase() === String(account.user_email || '').toLowerCase())
      )
      const stored = readStoredPlan(account, profile)
      return { ...account, plan: stored.plan, plan_status: stored.status }
    })
    if (!user.isAdmin) {
      return Response.json(list.filter((a) => ownsRecord(a, user)))
    }
    return Response.json(list)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    throw e
  }
}

export async function POST(req) {
  try {
    await requireAdmin()
    const body = await req.json()
    let userClerkId = body.user_clerk_id || ''
    if (!userClerkId && body.user_email) {
      const { data: prof } = await supabaseAdmin.from('profiles').select('clerk_user_id').eq('email', normalizeEmail(body.user_email)).single()
      userClerkId = prof?.clerk_user_id || `manual-${normalizeEmail(body.user_email).replace(/[^a-z0-9]/g, '_')}`
    }
    const payload = {
      ...body,
      user_email: normalizeEmail(body.user_email),
      user_clerk_id: userClerkId,
      balance: Number(body.balance ?? 0),
      profit: Number(body.profit ?? 0),
      status: body.status || 'active',
      updated_at: nowIso(),
    }
    if (body.plan != null) payload.plan = String(body.plan || 'basic').toLowerCase()
    if (body.plan_status != null) payload.plan_status = String(body.plan_status || 'active').toLowerCase()
    delete payload.addAmount
    let { data, error } = await supabaseAdmin.from('user_accounts').upsert(payload, { onConflict: 'user_email' }).select().single()
    if (error && /plan/i.test(error.message || '')) {
      const fallback = { ...payload }
      delete fallback.plan
      delete fallback.plan_status
      const retry = await supabaseAdmin.from('user_accounts').upsert(fallback, { onConflict: 'user_email' }).select().single()
      data = retry.data
      error = retry.error
    }
    if (error) return Response.json({ error: error.message }, { status: 500 })
    if (body.plan != null) {
      await saveUserPlan(supabaseAdmin, {
        email: payload.user_email,
        clerkId: userClerkId,
        planId: payload.plan,
        status: payload.plan_status || 'active',
      })
    }
    return Response.json(data)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
}

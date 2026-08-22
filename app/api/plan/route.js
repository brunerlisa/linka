import { requireAuth, requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getUpgradePlan, qualifiesForPlan } from '@/lib/pricingPlans'
import { readStoredPlan, saveUserPlan } from '@/lib/userPlan'

const nowIso = () => new Date().toISOString()
const normalizeEmail = (v) => String(v || '').trim().toLowerCase()

async function loadAccountAndProfile(user) {
  const [{ data: account }, { data: profile }] = await Promise.all([
    supabaseAdmin.from('user_accounts').select('*').eq('user_clerk_id', user.userId).maybeSingle(),
    supabaseAdmin.from('profiles').select('*').eq('clerk_user_id', user.userId).maybeSingle(),
  ])
  let row = account
  if (!row && user.email) {
    const { data } = await supabaseAdmin
      .from('user_accounts')
      .select('*')
      .eq('user_email', normalizeEmail(user.email))
      .maybeSingle()
    row = data
  }
  return { account: row, profile }
}

export async function GET() {
  try {
    const user = await requireAuth()
    const { account, profile } = await loadAccountAndProfile(user)
    const stored = readStoredPlan(account, profile)
    const { data: pendingRows } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('payment_type', 'plan_upgrade')
      .eq('status', 'pending')
      .eq('user_clerk_id', user.userId)
      .order('created_at', { ascending: false })
      .limit(5)
    return Response.json({
      plan: stored.plan,
      status: stored.status,
      balance: Number(account?.balance || 0),
      pending: pendingRows?.[0] || null,
    })
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    throw e
  }
}

export async function POST(req) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const requested = getUpgradePlan(body.plan)
    if (!requested) return Response.json({ error: 'Choose a valid plan.' }, { status: 400 })

    const { account, profile } = await loadAccountAndProfile(user)
    const stored = readStoredPlan(account, profile)
    const balance = Number(account?.balance || 0)
    const forcePending = Boolean(body.requestIfUnderfunded)
    const adminAssign = Boolean(body.adminAssign)

    if (adminAssign) {
      await requireAdmin()
      const email = normalizeEmail(body.user_email || user.email)
      const clerkId = body.user_clerk_id || user.userId
      await saveUserPlan(supabaseAdmin, { email, clerkId, planId: requested.id, status: 'active' })
      return Response.json({ plan: requested.id, status: 'active', balance })
    }

    if (stored.plan === requested.id && stored.status === 'active') {
      return Response.json({ plan: requested.id, status: 'active', balance, alreadyActive: true })
    }

    if (qualifiesForPlan(balance, requested)) {
      await saveUserPlan(supabaseAdmin, {
        email: user.email,
        clerkId: user.userId,
        planId: requested.id,
        status: 'active',
      })
      return Response.json({ plan: requested.id, status: 'active', balance })
    }

    if (!forcePending) {
      return Response.json(
        {
          error: `Deposit at least $${requested.min.toLocaleString()} to activate ${requested.name}.`,
          plan: stored.plan,
          status: stored.status,
          needsDeposit: true,
          min: requested.min,
          balance,
          requested: requested.id,
        },
        { status: 400 }
      )
    }

    const { data: existing } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('payment_type', 'plan_upgrade')
      .eq('status', 'pending')
      .eq('method', requested.id)
      .eq('user_clerk_id', user.userId)
      .maybeSingle()

    if (!existing) {
      const { error } = await supabaseAdmin.from('payments').insert({
        user_email: normalizeEmail(user.email),
        user_clerk_id: user.userId,
        amount_usd: requested.min,
        amount_crypto: 0,
        method: requested.id,
        status: 'pending',
        payment_type: 'plan_upgrade',
        notes: `Requested ${requested.name} plan (${requested.websitePlan})`,
        created_at: nowIso(),
        updated_at: nowIso(),
      })
      if (error) return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({
      plan: stored.plan,
      status: 'pending',
      requested: requested.id,
      balance,
      pending: true,
    })
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
}

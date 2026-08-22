import { BASIC_PLAN_ID, getUpgradePlan } from '@/lib/pricingPlans'

function parsePrefs(raw) {
  if (!raw) return {}
  if (typeof raw === 'object') return raw
  try {
    return JSON.parse(raw) || {}
  } catch {
    return {}
  }
}

export function readStoredPlan(account, profile) {
  const fromAccount = String(account?.plan || '').toLowerCase()
  const prefs = parsePrefs(profile?.preferences_json)
  const fromPrefs = String(prefs.plan || '').toLowerCase()
  const id = getUpgradePlan(fromAccount)?.id || getUpgradePlan(fromPrefs)?.id || BASIC_PLAN_ID
  const status = String(account?.plan_status || prefs.plan_status || 'active').toLowerCase()
  return { plan: id, status: status === 'pending' ? 'pending' : 'active' }
}

export async function saveUserPlan(supabaseAdmin, { email, clerkId, planId, status }) {
  const nowIso = new Date().toISOString()
  const plan = getUpgradePlan(planId)?.id || BASIC_PLAN_ID
  const planStatus = status === 'pending' ? 'pending' : 'active'
  const normalizedEmail = String(email || '').trim().toLowerCase()

  if (clerkId) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('preferences_json')
      .eq('clerk_user_id', clerkId)
      .maybeSingle()
    const prefs = parsePrefs(profile?.preferences_json)
    prefs.plan = plan
    prefs.plan_status = planStatus
    await supabaseAdmin
      .from('profiles')
      .update({ preferences_json: JSON.stringify(prefs), updated_at: nowIso })
      .eq('clerk_user_id', clerkId)
  }

  const payload = { plan, plan_status: planStatus, updated_at: nowIso }
  let query = supabaseAdmin.from('user_accounts').update(payload)
  if (clerkId) query = query.eq('user_clerk_id', clerkId)
  else query = query.eq('user_email', normalizedEmail)
  const { error } = await query
  if (error && !/plan/i.test(error.message || '')) {
    throw error
  }
}

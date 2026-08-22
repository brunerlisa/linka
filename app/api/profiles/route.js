import { requireAuth, requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { parseAdminEmails } from '@/lib/supabase/env'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const me = searchParams.get('me') === '1' || searchParams.get('me') === 'true'
  if (me) {
    try {
      const user = await requireAuth()
      const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('clerk_user_id', user.userId).single()
      if (error && error.code !== 'PGRST116') return Response.json({ error: error.message }, { status: 500 })
      return Response.json({
        ...(data || { has_onboarded: false }),
        role: user.isAdmin ? 'admin' : (data?.role || 'user'),
        email: data?.email || user.email,
        full_name: data?.full_name || user.fullName,
      })
    } catch (e) {
      if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
      throw e
    }
  }
  try {
    await requireAdmin()
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
  const { data, error } = await supabaseAdmin.from('profiles').select('*').order('created_at', { ascending: false })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data || [])
}

export async function POST(req) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const email = (body.email || user.email || '').toString().trim().toLowerCase()
    const payload = {
      clerk_user_id: user.userId,
      email,
      full_name: body.full_name || user.fullName || '',
      updated_at: new Date().toISOString(),
    }
    if (user.isAdmin || parseAdminEmails().includes(email)) {
      payload.role = 'admin'
    }
    if (body.has_onboarded === true || body.has_onboarded === 'true') {
      payload.has_onboarded = true
    }
    if (body.onboarding_json != null && typeof body.onboarding_json === 'string') {
      payload.onboarding_json = body.onboarding_json
    }
    if (body.preferences_json != null && typeof body.preferences_json === 'string') {
      payload.preferences_json = body.preferences_json
    }
    if (body.kyc_json != null && typeof body.kyc_json === 'string') {
      const { data: existing } = await supabaseAdmin
        .from('profiles')
        .select('kyc_status')
        .eq('clerk_user_id', user.userId)
        .maybeSingle()
      const current = String(existing?.kyc_status || '').toLowerCase()
      if (['pending', 'approved', 'verified'].includes(current) && !user.isAdmin) {
        return Response.json({ error: 'KYC is already submitted or approved' }, { status: 400 })
      }
      payload.kyc_json = body.kyc_json
      payload.kyc_status = 'pending'
      payload.kyc_submitted_at = body.kyc_submitted_at || new Date().toISOString()
    }
    const { data, error } = await supabaseAdmin.from('profiles').upsert(payload, { onConflict: 'clerk_user_id' }).select().single()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json(data)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    throw e
  }
}

export async function PATCH(req) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }

  try {
    const body = await req.json()
    const status = String(body?.kyc_status || '').toLowerCase()
    const allowed = new Set(['not_submitted', 'pending', 'approved', 'verified', 'rejected'])
    if (!allowed.has(status)) {
      return Response.json({ error: 'Invalid KYC status' }, { status: 400 })
    }

    const clerkId = String(body.clerk_user_id || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    if (!clerkId && !email) {
      return Response.json({ error: 'User id or email is required' }, { status: 400 })
    }

    let query = supabaseAdmin
      .from('profiles')
      .update({ kyc_status: status, updated_at: new Date().toISOString() })
    query = clerkId ? query.eq('clerk_user_id', clerkId) : query.ilike('email', email)

    const { data, error } = await query.select().maybeSingle()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    if (!data) return Response.json({ error: 'Profile not found' }, { status: 404 })
    return Response.json(data)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
}

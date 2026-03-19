import { requireAuth, requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

const nowIso = () => new Date().toISOString()
const normalizeEmail = (v) => String(v || '').trim().toLowerCase()

export async function GET() {
  try {
    const user = await requireAuth()
    const { data, error } = await supabaseAdmin.from('user_accounts').select('*').order('created_at', { ascending: false })
    if (error) return Response.json({ error: error.message }, { status: 500 })
    const list = data || []
    if (!user.isAdmin) {
      return Response.json(list.filter((a) => a.user_clerk_id === user.userId))
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
    const { data, error } = await supabaseAdmin.from('user_accounts').upsert(payload, { onConflict: 'user_email' }).select().single()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json(data)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
}

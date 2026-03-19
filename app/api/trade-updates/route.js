import { requireAuth, getAuthUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

const nowIso = () => new Date().toISOString()
const normalizeEmail = (v) => String(v || '').trim().toLowerCase()

export async function GET() {
  try {
    const user = await requireAuth()
    const { data, error } = await supabaseAdmin.from('trade_updates').select('*').order('created_at', { ascending: false })
    if (error) return Response.json({ error: error.message }, { status: 500 })
    const list = data || []
    if (!user.isAdmin) {
      return Response.json(list.filter((t) => t.user_clerk_id === user.userId))
    }
    return Response.json(list)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    throw e
  }
}

export async function POST(req) {
  try {
    const user = await requireAdmin()
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
  const body = await req.json()
  const payload = {
    user_email: normalizeEmail(body.user_email),
    user_clerk_id: body.user_clerk_id || '',
    trader_name: body.trader_name || '',
    pnl: Number(body.pnl || 0),
    result: body.result || 'profit',
    notes: body.notes || '',
    created_at: body.created_at || nowIso(),
    updated_at: nowIso(),
  }
  const { data, error } = await supabaseAdmin.from('trade_updates').insert(payload).select().single()
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

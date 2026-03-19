import { requireAuth, getAuthUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

const nowIso = () => new Date().toISOString()
const normalizeEmail = (v) => String(v || '').trim().toLowerCase()

export async function GET() {
  try {
    const user = await requireAuth()
    const { data, error } = await supabaseAdmin.from('payments').select('*').order('created_at', { ascending: false })
    if (error) return Response.json({ error: error.message }, { status: 500 })
    const list = data || []
    if (!user.isAdmin) {
      return Response.json(list.filter((p) => p.user_clerk_id === user.userId))
    }
    return Response.json(list)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    throw e
  }
}

export async function POST(req) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const payload = {
      user_email: normalizeEmail(body.user_email || user.email),
      user_clerk_id: user.userId,
      amount_usd: Number(body.amount_usd || 0),
      amount_crypto: Number(body.amount_crypto || 0),
      method: body.method || '',
      status: body.status || 'pending',
      payment_type: ['deposit', 'withdrawal'].includes(body.payment_type) ? body.payment_type : 'deposit',
      notes: body.notes || '',
      created_at: body.created_at || nowIso(),
      updated_at: nowIso(),
    }
    const { data, error } = await supabaseAdmin.from('payments').insert(payload).select().single()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json(data)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    throw e
  }
}

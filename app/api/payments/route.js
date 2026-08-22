import { requireAuth, ownsRecord } from '@/lib/auth'
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
      return Response.json(list.filter((p) => ownsRecord(p, user)))
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

    if (body.payment_type === 'bonus') {
      if (!user.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 })
      const email = normalizeEmail(body.user_email)
      const amount = Number(body.amount_usd || 0)
      if (!email) return Response.json({ error: 'User email is required' }, { status: 400 })
      if (!(amount > 0)) return Response.json({ error: 'Enter a valid bonus amount' }, { status: 400 })
      const { data: prof } = await supabaseAdmin
        .from('profiles')
        .select('clerk_user_id, email')
        .ilike('email', email)
        .maybeSingle()
      const payload = {
        user_email: email,
        user_clerk_id: prof?.clerk_user_id || body.user_clerk_id || '',
        amount_usd: amount,
        amount_crypto: 0,
        method: body.method || body.asset || 'USD',
        status: 'available',
        payment_type: 'bonus',
        notes: body.notes || '',
        created_at: nowIso(),
        updated_at: nowIso(),
      }
      const { data, error } = await supabaseAdmin.from('payments').insert(payload).select().single()
      if (error) return Response.json({ error: error.message }, { status: 500 })
      return Response.json(data)
    }

    const amountUsd = Number(body.amount_usd || 0)
    const paymentType = ['deposit', 'withdrawal'].includes(body.payment_type) ? body.payment_type : 'deposit'
    if (paymentType === 'deposit' && amountUsd < 50) {
      return Response.json({ error: 'Minimum deposit is $50' }, { status: 400 })
    }
    const payload = {
      user_email: normalizeEmail(body.user_email || user.email),
      user_clerk_id: user.userId,
      amount_usd: amountUsd,
      amount_crypto: Number(body.amount_crypto || 0),
      method: body.method || '',
      status: body.status || 'pending',
      payment_type: paymentType,
      notes: body.notes || '',
      created_at: body.created_at || nowIso(),
      updated_at: nowIso(),
    }
    const { data, error } = await supabaseAdmin.from('payments').insert(payload).select().single()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json(data)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
}

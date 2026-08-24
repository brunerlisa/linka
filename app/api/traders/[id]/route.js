import { requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

const nowIso = () => new Date().toISOString()

async function traderId(params) {
  const resolved = await params
  return String(resolved?.id || '').trim()
}

export async function PUT(req, { params }) {
  try {
    await requireAdmin()
    const id = await traderId(params)
    if (!id) return Response.json({ error: 'Trader id is required' }, { status: 400 })

    const body = await req.json()
    const payload = { ...body, updated_at: nowIso() }
    delete payload.id

    const { data, error } = await supabaseAdmin.from('traders').update(payload).eq('id', id).select().single()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    if (!data) return Response.json({ error: 'Trader not found' }, { status: 404 })
    return Response.json(data)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin()
    const id = await traderId(params)
    if (!id) return Response.json({ error: 'Trader id is required' }, { status: 400 })

    const { error } = await supabaseAdmin.from('traders').delete().eq('id', id)
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ ok: true })
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
}

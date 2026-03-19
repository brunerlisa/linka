import { requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

const nowIso = () => new Date().toISOString()

export async function PUT(req, { params }) {
  try {
    await requireAdmin()
    const id = params.id
    const body = await req.json()
    const payload = { ...body, id, updated_at: nowIso() }
    const { data, error } = await supabaseAdmin.from('traders').upsert(payload).select().single()
    if (error) return Response.json({ error: error.message }, { status: 500 })
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
    const { error } = await supabaseAdmin.from('traders').delete().eq('id', params.id)
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ ok: true })
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
}

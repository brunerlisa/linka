import { requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

const nowIso = () => new Date().toISOString()

export async function PATCH(req, { params }) {
  try {
    await requireAdmin()
    const body = await req.json()
    const { status } = body
    if (!status) return Response.json({ error: 'Missing status' }, { status: 400 })
    const { data, error } = await supabaseAdmin
      .from('payments')
      .update({ status, updated_at: nowIso() })
      .eq('id', params.id)
      .select()
      .single()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json(data)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
}

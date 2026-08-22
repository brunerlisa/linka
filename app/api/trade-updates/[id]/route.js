import { requireAuth, ownsRecord } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { parseTradeNotes } from '@/lib/userTrade'

const nowIso = () => new Date().toISOString()

export async function PATCH(req, { params }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const body = await req.json()
    const action = String(body.action || body.status || '').toLowerCase()
    if (action !== 'cancel' && action !== 'cancelled') {
      return Response.json({ error: 'Unsupported action' }, { status: 400 })
    }

    const { data: trade, error: loadError } = await supabaseAdmin
      .from('trade_updates')
      .select('*')
      .eq('id', id)
      .single()
    if (loadError || !trade) return Response.json({ error: 'Trade not found' }, { status: 404 })
    if (!user.isAdmin && !ownsRecord(trade, user)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const notes = parseTradeNotes(trade.notes)
    if (notes.kind === 'user_trade' && notes.status && notes.status !== 'open') {
      return Response.json({ error: 'Only open trades can be cancelled' }, { status: 400 })
    }

    const nextNotes = JSON.stringify({
      ...notes,
      kind: notes.kind || 'user_trade',
      status: 'cancelled',
    })

    if (notes.account === 'real' && notes.status === 'open') {
      const amount = Number(trade.pnl || notes.amount || 0)
      if (amount > 0) {
        const { data: account } = await supabaseAdmin
          .from('user_accounts')
          .select('*')
          .eq('user_email', trade.user_email)
          .maybeSingle()
        if (account) {
          await supabaseAdmin
            .from('user_accounts')
            .update({
              balance: Number(account.balance || 0) + amount,
              updated_at: nowIso(),
            })
            .eq('id', account.id)
        }
      }
    }

    const { data, error } = await supabaseAdmin
      .from('trade_updates')
      .update({ notes: nextNotes, result: trade.result, updated_at: nowIso() })
      .eq('id', id)
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

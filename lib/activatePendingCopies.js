import { supabaseAdmin } from '@/lib/supabase-server'
import { parseTradeNotes } from '@/lib/userTrade'

const nowIso = () => new Date().toISOString()
const normalizeEmail = (v) => String(v || '').trim().toLowerCase()

export async function activatePendingCopySubscriptions(email) {
  const userEmail = normalizeEmail(email)
  if (!userEmail) return

  const { data: rows } = await supabaseAdmin.from('trade_updates').select('*').eq('user_email', userEmail)
  for (const row of rows || []) {
    const notes = parseTradeNotes(row.notes)
    if (notes.kind !== 'copy_subscription' || notes.status !== 'pending_deposit') continue

    await supabaseAdmin
      .from('trade_updates')
      .update({
        notes: JSON.stringify({ ...notes, status: 'active' }),
        updated_at: nowIso(),
      })
      .eq('id', row.id)

    if (notes.trader_id) {
      const { data: trader } = await supabaseAdmin
        .from('traders')
        .select('copiers')
        .eq('id', notes.trader_id)
        .maybeSingle()
      if (trader) {
        await supabaseAdmin
          .from('traders')
          .update({ copiers: Number(trader.copiers || 0) + 1, updated_at: nowIso() })
          .eq('id', notes.trader_id)
      }
    }
  }
}

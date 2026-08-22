import { requireAuth, ownsRecord } from '@/lib/auth'
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
      return Response.json(list.filter((t) => ownsRecord(t, user)))
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
    if (body.kind === 'copy_subscription') {
      const traderName = String(body.trader_name || '').trim()
      const traderId = String(body.trader_id || '').trim()
      if (!traderName) return Response.json({ error: 'Select a trader to copy' }, { status: 400 })

      const { data: existing } = await supabaseAdmin
        .from('trade_updates')
        .select('*')
        .eq('user_email', normalizeEmail(user.email))
        .eq('trader_name', traderName)
      const alreadyCopying = (existing || []).some((row) => {
        try {
          const notes = JSON.parse(row.notes || '{}')
          return notes.kind === 'copy_subscription' && notes.status === 'active'
        } catch {
          return false
        }
      })
      if (alreadyCopying) {
        return Response.json({ error: 'You are already copying this trader.' }, { status: 400 })
      }

      const payload = {
        user_email: normalizeEmail(user.email),
        user_clerk_id: user.userId,
        trader_name: traderName,
        pnl: 0,
        result: 'copy',
        notes: JSON.stringify({
          kind: 'copy_subscription',
          trader_id: traderId,
          trader_name: traderName,
          fee: Number(body.fee || 0),
          monthly_profit: Number(body.monthly_profit || 0),
          status: 'active',
        }),
        created_at: nowIso(),
        updated_at: nowIso(),
      }
      const { data, error } = await supabaseAdmin.from('trade_updates').insert(payload).select().single()
      if (error) return Response.json({ error: error.message }, { status: 500 })
      if (traderId) {
        const { data: trader } = await supabaseAdmin.from('traders').select('copiers').eq('id', traderId).maybeSingle()
        if (trader) {
          await supabaseAdmin
            .from('traders')
            .update({ copiers: Number(trader.copiers || 0) + 1, updated_at: nowIso() })
            .eq('id', traderId)
        }
      }
      return Response.json(data)
    }

    const side = String(body.side || body.result || '').toLowerCase()
    const isUserTrade = body.kind === 'user_trade' || side === 'buy' || side === 'sell'

    if (!isUserTrade) {
      if (!user.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 })
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

    const asset = String(body.asset || body.trader_name || '').trim()
    const amount = Number(body.amount ?? body.pnl ?? 0)
    const time = String(body.time || '').trim()
    const leverage = String(body.leverage || '').trim()
    const accountType = String(body.account || 'real').toLowerCase() === 'practice' ? 'practice' : 'real'

    if (!asset) return Response.json({ error: 'Asset is required' }, { status: 400 })
    if (!(amount > 0)) return Response.json({ error: 'Enter a valid amount' }, { status: 400 })
    if (!time) return Response.json({ error: 'Select a time' }, { status: 400 })
    if (!leverage) return Response.json({ error: 'Select leverage' }, { status: 400 })
    if (side !== 'buy' && side !== 'sell') return Response.json({ error: 'Choose Buy or Sell' }, { status: 400 })

    let accountRow = null
    if (accountType === 'real') {
      const { data } = await supabaseAdmin
        .from('user_accounts')
        .select('*')
        .eq('user_email', normalizeEmail(user.email))
        .maybeSingle()
      accountRow = data
      const balance = Number(accountRow?.balance || 0)
      if (!accountRow || balance < amount) {
        return Response.json({ error: 'Insufficient balance. Deposit funds first.' }, { status: 400 })
      }
    }

    const payload = {
      user_email: normalizeEmail(user.email),
      user_clerk_id: user.userId,
      trader_name: asset,
      pnl: amount,
      result: side,
      notes: JSON.stringify({
        kind: 'user_trade',
        asset,
        side,
        amount,
        time,
        leverage,
        account: accountType,
        status: 'open',
      }),
      created_at: nowIso(),
      updated_at: nowIso(),
    }

    const { data, error } = await supabaseAdmin.from('trade_updates').insert(payload).select().single()
    if (error) return Response.json({ error: error.message }, { status: 500 })

    if (accountType === 'real' && accountRow) {
      const { error: balError } = await supabaseAdmin
        .from('user_accounts')
        .update({
          balance: Number(accountRow.balance || 0) - amount,
          updated_at: nowIso(),
        })
        .eq('id', accountRow.id)
      if (balError) return Response.json({ error: balError.message }, { status: 500 })
    }

    return Response.json(data)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
}

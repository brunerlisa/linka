import { requireAuth, requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { DEPOSIT_METHODS, findWalletForMethod, getDepositMethod } from '@/lib/depositMethods'

const nowIso = () => new Date().toISOString()

function tableMissing(error) {
  const message = String(error?.message || '')
  return message.includes('deposit_wallets') && (message.includes('does not exist') || message.includes('schema cache'))
}

export async function GET() {
  try {
    const user = await requireAuth()
    let query = supabaseAdmin.from('deposit_wallets').select('*').order('method', { ascending: true })
    if (!user.isAdmin) query = query.eq('is_active', true)
    const { data, error } = await query
    if (error) {
      if (tableMissing(error)) return Response.json([])
      return Response.json({ error: error.message }, { status: 500 })
    }
    return Response.json(data || [])
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    throw e
  }
}

export async function POST(req) {
  try {
    await requireAdmin()
    const body = await req.json()
    const method = String(body.method || '').trim().toLowerCase()
    const catalog = getDepositMethod(method)
    if (!DEPOSIT_METHODS.some((item) => item.id === method)) {
      return Response.json({ error: 'Unknown deposit method' }, { status: 400 })
    }
    if (catalog.kind === 'crypto' && !String(body.wallet_address || '').trim()) {
      return Response.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    const payload = {
      method,
      network: String(body.network || catalog.network || '').trim(),
      wallet_address: String(body.wallet_address || '').trim(),
      qr_code_url: String(body.qr_code_url || '').trim(),
      instructions: String(body.instructions || '').trim(),
      confirmations: Number(body.confirmations || catalog.confirmations || 0),
      is_active: body.is_active !== false,
      updated_at: nowIso(),
    }

    const { data: allRows } = await supabaseAdmin.from('deposit_wallets').select('id, method')
    const existing = findWalletForMethod(allRows || [], method)

    async function save(nextPayload) {
      if (existing?.id) {
        return supabaseAdmin.from('deposit_wallets').update(nextPayload).eq('id', existing.id).select().single()
      }
      return supabaseAdmin.from('deposit_wallets').insert({ ...nextPayload, created_at: nowIso() }).select().single()
    }

    let { data, error } = await save(payload)
    if (error && String(error.message || '').includes('confirmations')) {
      const { confirmations: _ignored, ...withoutConfirmations } = payload
      ;({ data, error } = await save(withoutConfirmations))
    }
    if (error) {
      if (tableMissing(error)) {
        return Response.json({
          error: 'deposit_wallets table is missing. Run the deposit_wallets SQL in supabase-migrations.sql.',
        }, { status: 500 })
      }
      return Response.json({ error: error.message }, { status: 500 })
    }
    return Response.json(data)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
}

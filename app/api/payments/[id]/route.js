import { requireAuth, ownsRecord } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { saveUserPlan } from '@/lib/userPlan'
import { activatePendingCopySubscriptions } from '@/lib/activatePendingCopies'

const nowIso = () => new Date().toISOString()
const normalizeEmail = (v) => String(v || '').trim().toLowerCase()

async function creditAccount(email, clerkId, amount) {
  const { data: account } = await supabaseAdmin
    .from('user_accounts')
    .select('*')
    .eq('user_email', normalizeEmail(email))
    .maybeSingle()
  if (account) {
    const { error } = await supabaseAdmin
      .from('user_accounts')
      .update({
        balance: Number(account.balance || 0) + Number(amount || 0),
        updated_at: nowIso(),
      })
      .eq('id', account.id)
    if (error) throw error
    return
  }
  const { error } = await supabaseAdmin.from('user_accounts').insert({
    user_email: normalizeEmail(email),
    user_clerk_id: clerkId || `manual-${normalizeEmail(email).replace(/[^a-z0-9]/g, '_')}`,
    balance: Number(amount || 0),
    profit: 0,
    status: 'active',
    created_at: nowIso(),
    updated_at: nowIso(),
  })
  if (error) throw error
}

export async function PATCH(req, { params }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const body = await req.json()
    const action = String(body.action || body.status || '').toLowerCase()

    const { data: payment, error: loadError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', id)
      .single()
    if (loadError || !payment) return Response.json({ error: 'Payment not found' }, { status: 404 })

    if (action === 'claim' || action === 'claimed') {
      if (!ownsRecord(payment, user) && !user.isAdmin) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }
      if (payment.payment_type !== 'bonus') {
        return Response.json({ error: 'This is not a bonus' }, { status: 400 })
      }
      if (String(payment.status).toLowerCase() !== 'available') {
        return Response.json({ error: 'This bonus is no longer available' }, { status: 400 })
      }
      const { data, error } = await supabaseAdmin
        .from('payments')
        .update({ status: 'claimed', updated_at: nowIso() })
        .eq('id', id)
        .eq('status', 'available')
        .select()
        .maybeSingle()
      if (error) return Response.json({ error: error.message }, { status: 500 })
      if (!data) return Response.json({ error: 'This bonus is no longer available' }, { status: 400 })
      try {
        await creditAccount(payment.user_email, payment.user_clerk_id, payment.amount_usd)
      } catch (creditError) {
        await supabaseAdmin
          .from('payments')
          .update({ status: 'available', updated_at: nowIso() })
          .eq('id', id)
        return Response.json({ error: creditError.message || 'Could not credit bonus' }, { status: 500 })
      }
      return Response.json(data)
    }

    if (!user.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 })
    if (!action) return Response.json({ error: 'Missing status' }, { status: 400 })

    const nextStatus = action === 'cancel' ? 'cancelled' : action
    if (payment.payment_type === 'bonus' && nextStatus === 'cancelled' && String(payment.status).toLowerCase() !== 'available') {
      return Response.json({ error: 'Only unused bonuses can be cancelled' }, { status: 400 })
    }
    const { data, error } = await supabaseAdmin
      .from('payments')
      .update({ status: nextStatus, updated_at: nowIso() })
      .eq('id', id)
      .select()
      .single()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    const wasApproved = String(payment.status || '').toLowerCase() === 'approved'
    const isDeposit = !payment.payment_type || payment.payment_type === 'deposit'
    if (isDeposit && nextStatus === 'approved' && !wasApproved) {
      try {
        await creditAccount(payment.user_email, payment.user_clerk_id, payment.amount_usd)
        await activatePendingCopySubscriptions(payment.user_email)
      } catch (creditError) {
        await supabaseAdmin
          .from('payments')
          .update({ status: payment.status || 'pending', updated_at: nowIso() })
          .eq('id', id)
        return Response.json({ error: creditError.message || 'Could not credit deposit' }, { status: 500 })
      }
    }
    if (payment.payment_type === 'plan_upgrade' && nextStatus === 'approved') {
      await saveUserPlan(supabaseAdmin, {
        email: payment.user_email,
        clerkId: payment.user_clerk_id,
        planId: payment.method,
        status: 'active',
      })
    }
    return Response.json(data)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
}

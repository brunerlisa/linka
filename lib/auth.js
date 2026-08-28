import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { parseAdminEmails } from '@/lib/supabase/env'

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

export function ownsRecord(row, user) {
  if (!row || !user) return false
  if (row.user_clerk_id && row.user_clerk_id === user.userId) return true
  if (row.clerk_user_id && row.clerk_user_id === user.userId) return true
  const email = normalizeEmail(user.email)
  if (email && normalizeEmail(row.user_email || row.email) === email) return true
  return false
}

/** Get current user from the Supabase session. Returns null if not signed in. */
export async function getAuthUser() {
  try {
    const supabase = await createClient()
    if (!supabase) return null
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) return null

    const authUser = data.user
    const email = normalizeEmail(authUser.email)
    let role = 'user'
    let fullName = authUser.user_metadata?.full_name || ''

    try {
      const { data: profile } = await getSupabaseAdmin()
        .from('profiles')
        .select('role, full_name, email')
        .eq('clerk_user_id', authUser.id)
        .maybeSingle()

      if (profile?.role) role = String(profile.role).toLowerCase()
      if (profile?.full_name) fullName = profile.full_name
    } catch {
      // Profile lookup is best-effort; session is still valid.
    }

    const isAdmin = role === 'admin' || parseAdminEmails().includes(email)

    return {
      userId: authUser.id,
      email,
      fullName,
      role: isAdmin ? 'admin' : role,
      isAdmin,
    }
  } catch {
    return null
  }
}

/** Require auth. Throws 401 if not signed in. */
export async function requireAuth() {
  const user = await getAuthUser()
  if (!user) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 })
  }
  return user
}

/** Require admin. Throws 403 if not admin. */
export async function requireAdmin() {
  const user = await requireAuth()
  if (!user.isAdmin) {
    throw Object.assign(new Error('Forbidden'), { status: 403 })
  }
  return user
}

import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function POST(req) {
  try {
    const body = await req.json()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const fullName = String(body.full_name || '').trim()

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (error) {
      const message = error.message || 'Sign up failed'
      const already = /already been registered|already exists|duplicate/i.test(message)
      return Response.json(
        { error: already ? 'An account with this email already exists. Sign in instead.' : message },
        { status: already ? 409 : 400 }
      )
    }

    return Response.json({ ok: true, userId: data.user?.id })
  } catch (error) {
    return Response.json({ error: error.message || 'Sign up failed' }, { status: 500 })
  }
}

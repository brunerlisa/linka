import { auth, currentUser } from '@clerk/nextjs/server'

/** Get current Clerk user. Returns null if not signed in. */
export async function getAuthUser() {
  const { userId } = await auth()
  if (!userId) return null
  const clerkUser = await currentUser()
  const role = (clerkUser?.publicMetadata?.role || 'user').toString().toLowerCase()
  const email = clerkUser?.primaryEmailAddress?.emailAddress || ''
  return { userId, email, role, isAdmin: role === 'admin' }
}

/** Require auth. Returns 401 JSON if not signed in. */
export async function requireAuth() {
  const user = await getAuthUser()
  if (!user) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 })
  }
  return user
}

/** Require admin. Returns 403 JSON if not admin. */
export async function requireAdmin() {
  const user = await requireAuth()
  if (!user.isAdmin) {
    throw Object.assign(new Error('Forbidden'), { status: 403 })
  }
  return user
}

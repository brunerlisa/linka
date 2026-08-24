export function getSupabasePublicEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
  }
}

const OWNER_ADMIN_EMAILS = ['brunerlisa555@gmail.com']

export function parseAdminEmails() {
  const fromEnv = String(process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
  return [...new Set([...OWNER_ADMIN_EMAILS, ...fromEnv])]
}

export function isAdminEmail(email) {
  return parseAdminEmails().includes(String(email || '').trim().toLowerCase())
}

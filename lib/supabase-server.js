import { createClient } from '@supabase/supabase-js'

let _client = null

export function getSupabaseAdmin() {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  _client = createClient(url, key)
  return _client
}

/** @deprecated Use getSupabaseAdmin() - kept for compatibility */
export const supabaseAdmin = {
  get from() {
    return getSupabaseAdmin().from.bind(getSupabaseAdmin())
  },
}

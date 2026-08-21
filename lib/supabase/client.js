'use client'

import { createBrowserClient } from '@supabase/ssr'
import { getSupabasePublicEnv } from '@/lib/supabase/env'

let browserClient = null

export function createClient() {
  const { url, anonKey } = getSupabasePublicEnv()
  if (!url || !anonKey) return null
  if (browserClient) return browserClient
  browserClient = createBrowserClient(url, anonKey)
  return browserClient
}

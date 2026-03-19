-- Option B: Backend enforces auth via API routes. Supabase uses service role (bypasses RLS).
-- Run this ONLY if you want to relax RLS for clarity. Service role already bypasses RLS.
-- Keeping existing RLS does not affect backend; it only applies to anon/authenticated roles.

-- Optional: Disable RLS on tables accessed only by backend (service role bypasses anyway).
-- Uncomment below if you prefer explicit "no RLS" for these tables:

-- alter table public.profiles       disable row level security;
-- alter table public.traders         disable row level security;
-- alter table public.payments        disable row level security;
-- alter table public.user_accounts   disable row level security;
-- alter table public.trade_updates   disable row level security;

-- Recommendation: Leave RLS enabled. Backend uses service_role key which bypasses RLS.
-- RLS remains as defense-in-depth if anon key is ever used elsewhere.

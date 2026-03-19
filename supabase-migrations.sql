-- =============================================================================
-- Noble Mirror Capital - SQL Migrations
-- =============================================================================
-- Run this in your Supabase project: SQL Editor > New query > paste & run
-- Safe to run multiple times (uses "if not exists" / "add column if not exists")
-- =============================================================================

-- 1. Add has_onboarded to profiles (so returning users skip onboarding)
alter table public.profiles add column if not exists has_onboarded boolean not null default false;

-- 2. Add payment_type to payments (for Withdrawal section)
alter table public.payments add column if not exists payment_type text not null default 'deposit';

-- 3. Create Storage bucket for trader avatar uploads
--    Do this manually in Supabase Dashboard:
--    Storage > New bucket > Name: "traders" > Public bucket: ON > Create

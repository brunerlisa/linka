-- Recreate deposit_wallets for the live deposit flow (BTC, ETH, USDT, USDC, Manual).
-- Paste into Supabase: SQL Editor > New query > Run
-- Safe to run again.

create extension if not exists "pgcrypto";

create table if not exists public.deposit_wallets (
  id             uuid        primary key default gen_random_uuid(),
  method         text        not null unique,
  network        text        not null default '',
  wallet_address text        not null default '',
  qr_code_url    text        not null default '',
  instructions   text        not null default '',
  confirmations  integer     not null default 2,
  is_active      boolean     not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_deposit_wallets_method on public.deposit_wallets (method);
create index if not exists idx_deposit_wallets_active on public.deposit_wallets (is_active);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_deposit_wallets_updated_at on public.deposit_wallets;
create trigger trg_deposit_wallets_updated_at
  before update on public.deposit_wallets
  for each row execute function public.set_updated_at();

alter table public.deposit_wallets enable row level security;

drop policy if exists "deposit_wallets_select" on public.deposit_wallets;
drop policy if exists "deposit_wallets_write_admin" on public.deposit_wallets;
drop policy if exists "auth read deposit_wallets" on public.deposit_wallets;
drop policy if exists "auth write deposit_wallets" on public.deposit_wallets;

create policy "deposit_wallets_select" on public.deposit_wallets
  for select to authenticated
  using (is_active = true);

grant select on public.deposit_wallets to authenticated;
grant all on public.deposit_wallets to service_role;

insert into public.deposit_wallets
  (method, network, wallet_address, qr_code_url, instructions, confirmations, is_active)
values
  (
    'btc',
    'Bitcoin',
    '',
    '',
    'Extra note: send only BTC on the Bitcoin network. Do not send another coin to this address. Funds credit after admin confirmation.',
    2,
    true
  ),
  (
    'eth',
    'Ethereum',
    '',
    '',
    'Extra note: send only ETH on the Ethereum network. Do not send tokens to this address unless this is an ERC20 deposit wallet.',
    12,
    true
  ),
  (
    'usdt',
    'Tron (TRC20)',
    '',
    '',
    'Extra note: send only USDT on TRC20. Sending USDT on another network can result in lost funds.',
    19,
    true
  ),
  (
    'usdc',
    'Ethereum (ERC20)',
    '',
    '',
    'Extra note: send only USDC on ERC20. Do not send USDT or USDC on another chain to this address.',
    12,
    true
  ),
  (
    'manual',
    'Wire Transfer',
    '',
    '',
    'Extra note: contact support for wire details. You will receive bank information and a reference number. Minimum deposit is $50.',
    0,
    true
  )
on conflict (method) do update set
  network = excluded.network,
  instructions = excluded.instructions,
  confirmations = excluded.confirmations,
  is_active = excluded.is_active,
  updated_at = now();

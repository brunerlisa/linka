# Noble Mirror Capital - Copy Trading Platform

Next.js app with Clerk (auth) and Supabase (database). Auth is enforced in API routes; Supabase uses service role.

## Env vars (`.env.local`)

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Migration from Vite:** Rename `VITE_CLERK_PUBLISHABLE_KEY` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL` → `NEXT_PUBLIC_SUPABASE_URL`. Add `CLERK_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` (from Supabase Project Settings → API).

## Clerk dashboard

1. Users → select user → **publicMetadata** → `{ "role": "admin" }` for admins.
2. No JWT template needed (backend uses Clerk session cookies).

## Supabase

1. Run `supabase-admin-schema.sql` in SQL editor.
2. Project Settings → API → copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

# Noble Mirror Capital - Copy Trading Platform

Next.js app with **Supabase Auth** and Supabase database. Auth is enforced in `proxy.js` and API routes. Database writes use the service role.

## Env vars (Vercel + `.env.local`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional: comma-separated emails that always get admin access
ADMIN_EMAILS=you@email.com
```

Get the URL, **anon** key, and **service_role** key from Supabase → Project Settings → API.

Remove any old Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`). They are no longer used.

## Auth

Sign-in and sign-up use Supabase email/password.

1. In Supabase → Authentication → URL Configuration, set:
   - Site URL: `https://noblemirrorcapital.com`
   - Redirect URLs: `https://noblemirrorcapital.com/auth/callback` and `https://www.noblemirrorcapital.com/auth/callback`
2. Make yourself admin either with `ADMIN_EMAILS` or in the SQL editor:

```sql
update public.profiles set role = 'admin' where email = 'you@email.com';
```

3. Run `supabase-auth-migration.sql` once so Row Level Security uses Supabase Auth instead of Clerk JWTs.

## Run

```bash
npm install
npm run dev
```

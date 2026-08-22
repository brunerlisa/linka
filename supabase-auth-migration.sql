-- Keep RLS user IDs aligned with native Supabase Auth.
-- Run once in the Supabase SQL editor. Existing id columns store the Supabase user UUID.

create or replace function public.jwt_clerk_id()
returns text language sql stable as $$
  select coalesce(auth.uid()::text, '');
$$;

create or replace function public.jwt_email()
returns text language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.profiles
    where clerk_user_id = coalesce(auth.uid()::text, '')
      and lower(role) = 'admin'
  );
$$;

grant execute on function public.jwt_clerk_id() to authenticated;
grant execute on function public.jwt_email() to authenticated;
grant execute on function public.is_admin() to authenticated;

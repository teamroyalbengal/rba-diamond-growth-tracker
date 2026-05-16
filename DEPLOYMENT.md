# RBA Diamond Growth Tracker Deployment Guide

## Environment Variables

Required in `.env.local` and Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Preview Locally

1. Install Node.js 20+.
2. Enable pnpm:

```bash
corepack enable
corepack prepare pnpm@11.1.2 --activate
```

3. Install dependencies:

```bash
pnpm install
```

4. Create `.env.local` from `.env.example`.
5. Add your Supabase URL and anon key.
6. Run the SQL in `supabase/schema.sql` in the Supabase SQL editor.
7. Start the local app:

```bash
pnpm run dev
```

8. Open `http://localhost:3000`.

Before deploying, run:

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
```

## Supabase Setup Checklist

- Create a Supabase project.
- Enable Email/Password under Authentication providers.
- Run the full `supabase/schema.sql` file.
- Confirm these tables exist:
  - `profiles`
  - `daily_checkins`
  - `weekly_reviews`
  - `stage_history`
  - `admin_point_adjustments`
- Confirm RLS is enabled on all public tables.
- Confirm these RPC functions exist:
  - `get_leaderboard`
  - `get_weekly_leaderboard`
  - `calculate_member_streak`
  - `calculate_checkin_points`
- Confirm the auth trigger `on_auth_user_created` exists.

## Create First Admin User

1. In Supabase, create the first user under Authentication.
2. Let the trigger create their `profiles` row.
3. Run:

```sql
update public.profiles
set role = 'admin',
    full_name = 'Admin Name',
    is_active = true
where email = 'admin@example.com';
```

## Invite First 10 Diamond Members

Use Supabase Authentication invitations or create users manually.

After each user exists, confirm their profile:

```sql
select id, full_name, email, role, current_stage, is_active
from public.profiles
order by joined_at desc;
```

Optionally update names and stages:

```sql
update public.profiles
set full_name = 'Member Name',
    current_stage = 'Starter',
    is_active = true
where email = 'member@example.com';
```

Members should use `/login`, then start with `/dashboard` and `/check-in`.

## Vercel Deployment Checklist

- Push the project to GitHub.
- Import the repository in Vercel.
- Framework preset: Next.js.
- Build command: `pnpm run build`.
- Install command: `pnpm install --frozen-lockfile`.
- Add environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Deploy.
- Add the Vercel production URL to Supabase Auth URL configuration:
  - Site URL: `https://your-vercel-domain.vercel.app`
  - Redirect URLs: `https://your-vercel-domain.vercel.app/**`
- Test:
  - Login
  - Member dashboard
  - Daily check-in
  - Weekly review
  - Leaderboard tabs
  - Admin dashboard as admin
  - Admin pages blocked for normal member

## Security Checklist

- Never expose the Supabase service role key in this app.
- Keep only anon key in browser-exposed env vars.
- Verify RLS remains enabled after schema changes.
- Use admin pages only through role-protected routes.
- Keep leaderboard output limited to public member summary fields.
- Use server actions for sensitive updates.

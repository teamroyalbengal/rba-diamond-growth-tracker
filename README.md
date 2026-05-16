# RBA Diamond Growth Tracker

Premium mobile-first growth operating system for Royal Bengal Academy Diamond Members.

## Phase 1 Included

- Next.js App Router with TypeScript
- Tailwind theme using the RBA premium ivory, gold, navy, and brown palette
- Supabase Auth client/server setup
- Protected member layout with mobile bottom navigation and desktop sidebar
- Login/logout flow
- Profile-backed dashboard foundation
- Supabase schema with RLS, profile trigger, and MVP tables
- Vercel-ready environment configuration

## Phase 2 Included

- Live member dashboard data helper
- Today’s Growth Score card
- Weekly progress card with days completed, streak, and weekly rank
- Monthly progress card based on available days in the month
- Current stage and next milestone summary
- Diamond Journey mini-map
- Weekly review reminder status
- Friendly top-five weekly leaderboard preview
- Secure Supabase RPC for leaderboard preview without exposing raw member check-ins

## Phase 3 Included

- Mobile-first 7-habit daily check-in page
- Instant score calculation out of 50
- One check-in per member per day with same-day editing
- Supabase upsert into `daily_checkins`
- Database trigger that recalculates `total_points` from habit booleans
- Success feedback and dashboard revalidation after save

## Phase 4 Included

- Leaderboard page with Daily, Weekly, Monthly, and All Time tabs
- Secure Supabase `get_leaderboard` RPC using `daily_checkins`
- Rank, member identity, avatar, stage, points, and streak display
- Logged-in member highlight
- Mobile card layout and desktop table layout
- Friendly, momentum-focused copy

## Phase 6 Included

- Weekly review form for Diamond Members
- One review per member per week via `unique(user_id, week_start)`
- Saves wins, struggles, content actions, warm conversations, launch asset, self-learning, next focus, and support needed
- Current week review can be updated from the same form
- Dashboard submitted/pending status now connects to real review data

## Phase 7 Included

- Admin-only route protection through `/admin` layout
- Admin dashboard with total members, submitted today, not submitted today, active this week, inactive members, top performers, stage distribution, and recent reviews
- Members page with search, stage update, and active/inactive controls
- Check-ins page with date filter and admin correction workflow
- Weekly Reviews page with week/member filters and reviewed status
- Admin leaderboard view with CSV export endpoint

## Setup

1. Copy `.env.example` to `.env.local`.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Run the SQL in `supabase/schema.sql` inside the Supabase SQL editor.
4. Create a user in Supabase Auth or enable email/password signup from an admin workflow later.
5. Run the app:

```bash
npm install
npm run dev
```

## Supabase Admin Bootstrap

After creating your first user, make them admin:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

For full local preview, Supabase, and Vercel deployment steps, see `DEPLOYMENT.md`.

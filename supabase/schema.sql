create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role text not null default 'member' check (role in ('admin', 'member')),
  current_stage text not null default 'Starter' check (
    current_stage in (
      'Starter',
      'Launch Finisher',
      'First Win Coach',
      'Bengal Rising Star',
      'Bengal Superstar',
      'Bengal Legend'
    )
  ),
  is_active boolean not null default true,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  checkin_date date not null,
  morning_meditation boolean not null default false,
  body_energy boolean not null default false,
  deep_work boolean not null default false,
  content_action boolean not null default false,
  community_action boolean not null default false,
  launch_asset boolean not null default false,
  evening_reflection boolean not null default false,
  total_points integer not null default 0 check (total_points between 0 and 50),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, checkin_date)
);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_start date not null,
  biggest_win text,
  struggle text,
  reels_count integer not null default 0 check (reels_count >= 0),
  youtube_published boolean not null default false,
  warm_conversations integer not null default 0 check (warm_conversations >= 0),
  launch_asset_built text,
  self_learning text,
  next_week_focus text,
  support_needed text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table if not exists public.stage_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  old_stage text,
  new_stage text not null,
  updated_by uuid references public.profiles(id),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_point_adjustments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  adjusted_by uuid references public.profiles(id),
  adjustment_date date not null,
  points_delta integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_active_idx on public.profiles(is_active);
create index if not exists daily_checkins_user_date_idx on public.daily_checkins(user_id, checkin_date desc);
create index if not exists weekly_reviews_user_week_idx on public.weekly_reviews(user_id, week_start desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_daily_checkins_updated_at on public.daily_checkins;
create trigger set_daily_checkins_updated_at
before update on public.daily_checkins
for each row execute function public.set_updated_at();

drop trigger if exists set_weekly_reviews_updated_at on public.weekly_reviews;
create trigger set_weekly_reviews_updated_at
before update on public.weekly_reviews
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and is_active = true
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.calculate_checkin_points(
  morning_meditation boolean,
  body_energy boolean,
  deep_work boolean,
  content_action boolean,
  community_action boolean,
  launch_asset boolean,
  evening_reflection boolean
)
returns integer
language sql
immutable
as $$
  select
    case when morning_meditation then 8 else 0 end +
    case when body_energy then 6 else 0 end +
    case when deep_work then 8 else 0 end +
    case when content_action then 8 else 0 end +
    case when community_action then 6 else 0 end +
    case when launch_asset then 8 else 0 end +
    case when evening_reflection then 6 else 0 end;
$$;

create or replace function public.set_daily_checkin_points()
returns trigger
language plpgsql
as $$
begin
  new.total_points := public.calculate_checkin_points(
    new.morning_meditation,
    new.body_energy,
    new.deep_work,
    new.content_action,
    new.community_action,
    new.launch_asset,
    new.evening_reflection
  );
  return new;
end;
$$;

drop trigger if exists set_daily_checkin_points on public.daily_checkins;
create trigger set_daily_checkin_points
before insert or update on public.daily_checkins
for each row execute function public.set_daily_checkin_points();

create or replace function public.calculate_member_streak(member_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  cursor_date date := (now() at time zone 'Asia/Kolkata')::date;
  streak_count integer := 0;
begin
  loop
    exit when not exists (
      select 1
      from public.daily_checkins
      where user_id = member_id
        and checkin_date = cursor_date
        and total_points > 0
    );

    streak_count := streak_count + 1;
    cursor_date := cursor_date - 1;
  end loop;

  return streak_count;
end;
$$;

create or replace function public.get_leaderboard(period text default 'weekly', limit_count integer default 50)
returns table (
  rank bigint,
  user_id uuid,
  full_name text,
  avatar_url text,
  current_stage text,
  points bigint,
  streak integer
)
language sql
security definer
set search_path = public
stable
as $$
  with bounds as (
    select
      (now() at time zone 'Asia/Kolkata')::date as today,
      ((now() at time zone 'Asia/Kolkata')::date - (((extract(dow from (now() at time zone 'Asia/Kolkata')::date)::integer + 6) % 7))) as week_start,
      date_trunc('month', (now() at time zone 'Asia/Kolkata')::date)::date as month_start
  ),
  member_scores as (
    select
      p.id as user_id,
      p.full_name,
      p.avatar_url,
      p.current_stage,
      coalesce(sum(dc.total_points), 0)::bigint as points,
      public.calculate_member_streak(p.id) as streak
    from public.profiles p
    cross join bounds b
    left join public.daily_checkins dc
      on dc.user_id = p.id
      and (
        case
          when period = 'daily' then dc.checkin_date = b.today
          when period = 'weekly' then dc.checkin_date between b.week_start and b.today
          when period = 'monthly' then dc.checkin_date between b.month_start and b.today
          when period = 'all_time' then true
          else dc.checkin_date between b.week_start and b.today
        end
      )
    where p.is_active = true
    group by p.id, p.full_name, p.avatar_url, p.current_stage
  )
  select
    dense_rank() over (order by points desc, streak desc, full_name asc) as rank,
    user_id,
    full_name,
    avatar_url,
    current_stage,
    points,
    streak
  from member_scores
  order by rank asc, full_name asc
  limit greatest(limit_count, 1);
$$;

create or replace function public.get_weekly_leaderboard(limit_count integer default 5)
returns table (
  rank bigint,
  user_id uuid,
  full_name text,
  avatar_url text,
  current_stage text,
  points bigint,
  streak integer
)
language sql
security definer
set search_path = public
stable
as $$
  select *
  from public.get_leaderboard('weekly', limit_count);
$$;

grant execute on function public.calculate_member_streak(uuid) to authenticated;
grant execute on function public.calculate_checkin_points(boolean, boolean, boolean, boolean, boolean, boolean, boolean) to authenticated;
grant execute on function public.get_leaderboard(text, integer) to authenticated;
grant execute on function public.get_weekly_leaderboard(integer) to authenticated;

alter table public.profiles enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.weekly_reviews enable row level security;
alter table public.stage_history enable row level security;
alter table public.admin_point_adjustments enable row level security;

drop policy if exists "Members can read own profile" on public.profiles;
create policy "Members can read own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Members can read own checkins" on public.daily_checkins;
create policy "Members can read own checkins"
on public.daily_checkins for select
using (auth.uid() = user_id);

drop policy if exists "Members can create own checkin" on public.daily_checkins;
create policy "Members can create own checkin"
on public.daily_checkins for insert
with check (auth.uid() = user_id and checkin_date = (now() at time zone 'Asia/Kolkata')::date);

drop policy if exists "Members can edit today's own checkin" on public.daily_checkins;
create policy "Members can edit today's own checkin"
on public.daily_checkins for update
using (auth.uid() = user_id and checkin_date = (now() at time zone 'Asia/Kolkata')::date)
with check (auth.uid() = user_id and checkin_date = (now() at time zone 'Asia/Kolkata')::date);

drop policy if exists "Admins can manage checkins" on public.daily_checkins;
create policy "Admins can manage checkins"
on public.daily_checkins for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Members can read own weekly reviews" on public.weekly_reviews;
create policy "Members can read own weekly reviews"
on public.weekly_reviews for select
using (auth.uid() = user_id);

drop policy if exists "Members can create own weekly reviews" on public.weekly_reviews;
create policy "Members can create own weekly reviews"
on public.weekly_reviews for insert
with check (
  auth.uid() = user_id
  and week_start = ((now() at time zone 'Asia/Kolkata')::date - (((extract(dow from (now() at time zone 'Asia/Kolkata')::date)::integer + 6) % 7)))
);

drop policy if exists "Members can edit own weekly reviews" on public.weekly_reviews;
create policy "Members can edit own weekly reviews"
on public.weekly_reviews for update
using (
  auth.uid() = user_id
  and week_start = ((now() at time zone 'Asia/Kolkata')::date - (((extract(dow from (now() at time zone 'Asia/Kolkata')::date)::integer + 6) % 7)))
)
with check (
  auth.uid() = user_id
  and week_start = ((now() at time zone 'Asia/Kolkata')::date - (((extract(dow from (now() at time zone 'Asia/Kolkata')::date)::integer + 6) % 7)))
);

drop policy if exists "Admins can manage weekly reviews" on public.weekly_reviews;
create policy "Admins can manage weekly reviews"
on public.weekly_reviews for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Members can read own stage history" on public.stage_history;
create policy "Members can read own stage history"
on public.stage_history for select
using (auth.uid() = user_id);

drop policy if exists "Admins can manage stage history" on public.stage_history;
create policy "Admins can manage stage history"
on public.stage_history for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage point adjustments" on public.admin_point_adjustments;
create policy "Admins can manage point adjustments"
on public.admin_point_adjustments for all
using (public.is_admin())
with check (public.is_admin());

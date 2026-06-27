-- ============================================================
-- BLOOM — Initial Schema
-- Supabase SQL Editor'da çalıştır
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null default '',
  avatar_url text,
  language text not null default 'tr' check (language in ('tr', 'en')),
  bloom_level integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- ============================================================
-- USER PREFERENCES
-- ============================================================
create table public.user_preferences (
  user_id uuid references auth.users(id) on delete cascade primary key,
  notifications_enabled boolean not null default true,
  theme text not null default 'dark' check (theme in ('dark'))
);

alter table public.user_preferences enable row level security;

create policy "Users can manage own preferences"
  on public.user_preferences for all using (auth.uid() = user_id);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table public.subscriptions (
  user_id uuid references auth.users(id) on delete cascade primary key,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  expires_at timestamptz,
  platform text check (platform in ('ios', 'android')),
  original_transaction_id text
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);

-- ============================================================
-- HABITS
-- ============================================================
create table public.habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  category text not null check (category in ('fitness','mind','sleep','nutrition','social','work','custom')),
  icon text not null default 'target',
  color text not null default '#7C3AED',
  frequency_type text not null default 'daily' check (frequency_type in ('daily','weekly','custom')),
  frequency_days integer[] not null default '{1,2,3,4,5,6,7}',
  created_at timestamptz not null default now()
);

alter table public.habits enable row level security;

create policy "Users can manage own habits"
  on public.habits for all using (auth.uid() = user_id);

create index habits_user_id_idx on public.habits(user_id);

-- ============================================================
-- HABIT STACKS
-- ============================================================
create table public.habit_stacks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  habit_ids jsonb not null default '[]',
  time_of_day text not null check (time_of_day in ('morning','afternoon','evening','night'))
);

alter table public.habit_stacks enable row level security;

create policy "Users can manage own habit stacks"
  on public.habit_stacks for all using (auth.uid() = user_id);

-- ============================================================
-- COMPLETIONS
-- ============================================================
create table public.completions (
  id uuid default uuid_generate_v4() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  completed_at timestamptz not null default now(),
  mood integer check (mood between 1 and 5)
);

alter table public.completions enable row level security;

create policy "Users can manage own completions"
  on public.completions for all using (auth.uid() = user_id);

create index completions_habit_id_idx on public.completions(habit_id);
create index completions_user_id_date_idx on public.completions(user_id, completed_at desc);

-- ============================================================
-- STREAKS
-- ============================================================
create table public.streaks (
  habit_id uuid references public.habits(id) on delete cascade primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_completed_at timestamptz,
  shields_remaining integer not null default 0
);

alter table public.streaks enable row level security;

create policy "Users can manage own streaks"
  on public.streaks for all using (auth.uid() = user_id);

create index streaks_user_id_idx on public.streaks(user_id);

-- ============================================================
-- COACH MESSAGES
-- ============================================================
create table public.coach_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.coach_messages enable row level security;

create policy "Users can manage own coach messages"
  on public.coach_messages for all using (auth.uid() = user_id);

create index coach_messages_user_id_idx on public.coach_messages(user_id, created_at desc);

-- ============================================================
-- INSIGHTS
-- ============================================================
create table public.insights (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  week_start date not null,
  content text not null,
  generated_at timestamptz not null default now(),
  unique(user_id, week_start)
);

alter table public.insights enable row level security;

create policy "Users can view own insights"
  on public.insights for select using (auth.uid() = user_id);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP (trigger)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    'tr'
  );
  insert into public.user_preferences (user_id) values (new.id);
  insert into public.subscriptions (user_id, plan) values (new.id, 'free');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

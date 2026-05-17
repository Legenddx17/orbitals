-- ─── Extensions ───────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Users ────────────────────────────────────────────────────────────────
create table public.users (
  id            uuid primary key default uuid_generate_v4(),
  discord_id    text unique not null,
  username      text not null,
  avatar        text,
  email         text,
  orbit_id      uuid,
  points        integer not null default 0,
  streak        integer not null default 0,
  last_active   date,
  affinity_answers jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── Orbits ───────────────────────────────────────────────────────────────
create table public.orbits (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null,
  discord_server_id   text unique not null,
  icon                text,
  created_at          timestamptz not null default now()
);

-- FK: users.orbit_id → orbits.id
alter table public.users
  add constraint users_orbit_id_fkey
  foreign key (orbit_id) references public.orbits(id) on delete set null;

-- ─── Badges ───────────────────────────────────────────────────────────────
create table public.badges (
  slug        text primary key,
  name        text not null,
  description text not null,
  icon        text not null,
  color       text not null default '#7C3AED'
);

insert into public.badges (slug, name, description, icon, color) values
  ('primera-orbita', 'Primera Órbita',  'Completaste tu primera misión',              '🚀', '#7C3AED'),
  ('en-racha',       'En Racha',        'Estuviste activo 7 días consecutivos',        '🔥', '#F59E0B'),
  ('top-gun',        'Top Gun',         'Quedaste primero en el leaderboard de una temporada', '🏆', '#F59E0B'),
  ('vox-populi',     'Vox Populi',      'Ganaste el reto semanal por votos',           '👑', '#EC4899'),
  ('explorador',     'Explorador',      'Jugaste todos los modos al menos una vez',    '🌌', '#06B6D4');

-- ─── User Badges ──────────────────────────────────────────────────────────
create table public.user_badges (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  badge_slug  text not null references public.badges(slug),
  earned_at   timestamptz not null default now(),
  unique (user_id, badge_slug)
);

-- ─── Seasons ──────────────────────────────────────────────────────────────
create table public.seasons (
  id          uuid primary key default uuid_generate_v4(),
  orbit_id    uuid not null references public.orbits(id) on delete cascade,
  number      integer not null,
  started_at  date not null,
  ended_at    date,
  unique (orbit_id, number)
);

-- ─── Missions ─────────────────────────────────────────────────────────────
create table public.missions (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text not null,
  difficulty  text not null check (difficulty in ('easy','medium','hard')),
  points      integer not null,
  type        text not null check (type in ('trivia','creative','speed','photo')),
  is_limited  boolean not null default false,
  expires_at  timestamptz,
  week_start  date not null,
  created_at  timestamptz not null default now()
);

-- ─── Mission Completions ──────────────────────────────────────────────────
create table public.mission_completions (
  id          uuid primary key default uuid_generate_v4(),
  mission_id  uuid not null references public.missions(id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (mission_id, user_id)
);

-- ─── Weekly Challenges ────────────────────────────────────────────────────
create table public.weekly_challenges (
  id          uuid primary key default uuid_generate_v4(),
  orbit_id    uuid not null references public.orbits(id) on delete cascade,
  title       text not null,
  description text not null,
  week_start  date not null,
  week_end    date not null,
  created_at  timestamptz not null default now()
);

-- ─── Weekly Entries ───────────────────────────────────────────────────────
create table public.weekly_entries (
  id            uuid primary key default uuid_generate_v4(),
  challenge_id  uuid not null references public.weekly_challenges(id) on delete cascade,
  user_id       uuid not null references public.users(id) on delete cascade,
  content       text not null,
  votes         integer not null default 0,
  created_at    timestamptz not null default now(),
  unique (challenge_id, user_id)
);

-- ─── Weekly Votes ─────────────────────────────────────────────────────────
create table public.weekly_votes (
  id        uuid primary key default uuid_generate_v4(),
  entry_id  uuid not null references public.weekly_entries(id) on delete cascade,
  voter_id  uuid not null references public.users(id) on delete cascade,
  unique (entry_id, voter_id)
);

-- ─── Daily Rituals ────────────────────────────────────────────────────────
create table public.daily_rituals (
  id          uuid primary key default uuid_generate_v4(),
  orbit_id    uuid not null references public.orbits(id) on delete cascade,
  question    text not null,
  date        date not null,
  reveal_at   timestamptz not null,
  unique (orbit_id, date)
);

-- ─── Daily Answers ────────────────────────────────────────────────────────
create table public.daily_answers (
  id          uuid primary key default uuid_generate_v4(),
  ritual_id   uuid not null references public.daily_rituals(id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  answer      text not null,
  created_at  timestamptz not null default now(),
  unique (ritual_id, user_id)
);

-- ─── Points Events ────────────────────────────────────────────────────────
create table public.points_events (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  amount      integer not null,
  reason      text not null,
  created_at  timestamptz not null default now()
);

-- ─── Stored Procedures ────────────────────────────────────────────────────
create or replace function increment_user_points(user_id uuid, amount integer)
returns void language sql as $$
  update public.users set points = points + amount where id = user_id;
$$;

-- ─── Realtime ─────────────────────────────────────────────────────────────
-- Enable realtime for leaderboard updates
alter publication supabase_realtime add table public.users;
alter publication supabase_realtime add table public.points_events;
alter publication supabase_realtime add table public.daily_answers;

-- ─── Row Level Security ───────────────────────────────────────────────────
alter table public.users enable row level security;
create policy "Users are publicly readable" on public.users for select using (true);
create policy "Users can update own row"   on public.users for update using (auth.uid()::text = discord_id);

alter table public.orbits enable row level security;
create policy "Orbits are publicly readable" on public.orbits for select using (true);

alter table public.missions enable row level security;
create policy "Missions are publicly readable" on public.missions for select using (true);

alter table public.mission_completions enable row level security;
create policy "Anyone can read completions" on public.mission_completions for select using (true);

alter table public.weekly_challenges enable row level security;
create policy "Challenges are publicly readable" on public.weekly_challenges for select using (true);

alter table public.weekly_entries enable row level security;
create policy "Entries are publicly readable" on public.weekly_entries for select using (true);

alter table public.daily_rituals enable row level security;
create policy "Rituals are publicly readable" on public.daily_rituals for select using (true);

alter table public.badges enable row level security;
create policy "Badges are publicly readable" on public.badges for select using (true);

alter table public.user_badges enable row level security;
create policy "User badges are publicly readable" on public.user_badges for select using (true);

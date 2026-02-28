-- PathfinderHK Database Schema
-- Run this in your Supabase SQL editor

-- Enable pgvector extension
create extension if not exists vector;

-- ─── Profiles ────────────────────────────────────────────────────────────────

create table if not exists profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  cv_data     jsonb not null default '{}',
  personality_traits jsonb not null default '{}',
  interests   jsonb not null default '{}',
  insights    jsonb,
  embedding   vector(1536),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id)
);

-- ─── Opportunities ────────────────────────────────────────────────────────────

create table if not exists opportunities (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  org          text not null,
  type         text not null check (type in ('internship','graduate_program','fellowship','volunteer','full_time','part_time')),
  industry     text not null check (industry in ('technology','finance','consulting','social_impact','government','creative','healthcare','education','other')),
  location     text not null check (location in ('hk_island','kowloon','new_territories','remote','hybrid')),
  description  text not null,
  requirements text[] not null default '{}',
  is_paid      boolean not null default true,
  url          text,
  deadline     date,
  embedding    vector(1536),
  created_at   timestamptz not null default now()
);

-- ─── Recommendations ──────────────────────────────────────────────────────────

create table if not exists recommendations (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  opportunity_id   uuid not null references opportunities(id) on delete cascade,
  fit_score        integer not null check (fit_score between 0 and 100),
  fit_explanation  text not null,
  gaps             text,
  actions          text[] not null default '{}',
  created_at       timestamptz not null default now(),
  unique (user_id, opportunity_id)
);

-- ─── pgvector similarity search function ─────────────────────────────────────

create or replace function match_opportunities(
  query_embedding vector(1536),
  match_count     int default 20
)
returns table (
  id          uuid,
  title       text,
  org         text,
  type        text,
  industry    text,
  location    text,
  description text,
  requirements text[],
  is_paid     boolean,
  url         text,
  deadline    date,
  similarity  float
)
language sql stable
as $$
  select
    id, title, org, type, industry, location, description, requirements, is_paid, url, deadline,
    1 - (embedding <=> query_embedding) as similarity
  from opportunities
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table recommendations enable row level security;

-- Profiles: users can only read/write their own
create policy "Users manage own profile"
  on profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Recommendations: users can only read their own
create policy "Users read own recommendations"
  on recommendations for select
  using (auth.uid() = user_id);

create policy "Service role manages recommendations"
  on recommendations for all
  using (auth.role() = 'service_role');

-- Opportunities: publicly readable
alter table opportunities enable row level security;
create policy "Opportunities are publicly readable"
  on opportunities for select
  using (true);

create policy "Service role manages opportunities"
  on opportunities for all
  using (auth.role() = 'service_role');

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists idx_profiles_user_id on profiles(user_id);
create index if not exists idx_recommendations_user_id on recommendations(user_id);
create index if not exists idx_opportunities_type on opportunities(type);
create index if not exists idx_opportunities_industry on opportunities(industry);

-- Vector indexes for fast similarity search
create index if not exists idx_opportunities_embedding
  on opportunities using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ─── Rich Profile Column ──────────────────────────────────────────────────────

alter table profiles add column if not exists rich_profile jsonb;

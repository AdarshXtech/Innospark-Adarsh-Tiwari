-- ============================================================
-- LocalTix Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Events table
create table if not exists events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  category      text,
  event_date    timestamptz,
  venue         text,
  banner_url    text,
  status        text not null default 'draft', -- 'draft' | 'published' | 'cancelled'
  organizer_id  uuid references auth.users(id) on delete set null,
  created_at    timestamptz default now()
);

-- Ticket tiers table
create table if not exists ticket_tiers (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references events(id) on delete cascade,
  name        text not null default 'General Admission',
  price       numeric(10, 2) not null default 0,
  capacity    integer,
  created_at  timestamptz default now()
);

-- Bookings table
create table if not exists bookings (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  event_id        uuid not null references events(id) on delete cascade,
  ticket_tier_id  uuid references ticket_tiers(id) on delete set null,
  payment_id      text,
  payment_status  text not null default 'pending', -- 'pending' | 'confirmed' | 'failed'
  qr_code         text,
  created_at      timestamptz default now()
);

-- Users profile table (mirrors auth.users with extra fields)
create table if not exists users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  created_at  timestamptz default now()
);

-- Auto-create user profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- RLS Policies
alter table events enable row level security;
alter table ticket_tiers enable row level security;
alter table bookings enable row level security;
alter table users enable row level security;

-- Events: anyone can read published events
create policy "Public can read published events"
  on events for select
  using (status = 'published');

-- Events: authenticated users can insert
create policy "Auth users can create events"
  on events for insert
  to authenticated
  with check (true);

-- Events: organizer can update their own events
create policy "Organizer can update own events"
  on events for update
  to authenticated
  using (organizer_id = auth.uid());

-- Ticket tiers: anyone can read
create policy "Public can read ticket tiers"
  on ticket_tiers for select
  using (true);

-- Ticket tiers: authenticated users can insert
create policy "Auth users can create ticket tiers"
  on ticket_tiers for insert
  to authenticated
  with check (true);

-- Bookings: users can read own bookings
create policy "Users can read own bookings"
  on bookings for select
  to authenticated
  using (user_id = auth.uid());

-- Bookings: authenticated users can insert
create policy "Auth users can create bookings"
  on bookings for insert
  to authenticated
  with check (user_id = auth.uid());

-- Bookings: service role can update (for payment verification)
create policy "Auth users can update own bookings"
  on bookings for update
  to authenticated
  using (user_id = auth.uid());

-- Users: anyone authenticated can read profiles
create policy "Auth users can read profiles"
  on users for select
  to authenticated
  using (true);

-- Users: users can update own profile
create policy "Users can update own profile"
  on users for update
  to authenticated
  using (id = auth.uid());

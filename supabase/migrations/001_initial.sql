-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- QR codes table
create table public.qr_codes (
  id           uuid        primary key default uuid_generate_v4(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  name         text        not null,
  slug         text        not null unique,
  destination_type  text  not null,
  destination_value text  not null,
  fg_color     text        not null default '#000000',
  bg_color     text        not null default '#ffffff',
  dot_style    text        not null default 'square',
  corner_style text        not null default 'square',
  created_at   timestamptz not null default now()
);

-- Scans table
create table public.scans (
  id          uuid        primary key default uuid_generate_v4(),
  qr_code_id  uuid        not null references public.qr_codes(id) on delete cascade,
  scanned_at  timestamptz not null default now(),
  country     text
);

-- Indexes
create index on public.qr_codes(user_id);
create index on public.qr_codes(slug);
create index on public.scans(qr_code_id);
create index on public.scans(scanned_at);

-- Enable RLS
alter table public.qr_codes enable row level security;
alter table public.scans enable row level security;

-- qr_codes RLS policies
create policy "Users can view own QR codes"
  on public.qr_codes for select
  using (auth.uid() = user_id);

create policy "Users can create QR codes"
  on public.qr_codes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own QR codes"
  on public.qr_codes for update
  using (auth.uid() = user_id);

create policy "Users can delete own QR codes"
  on public.qr_codes for delete
  using (auth.uid() = user_id);

-- scans RLS policies
create policy "Public can insert scans"
  on public.scans for insert
  with check (true);

create policy "Users can view scans of own QR codes"
  on public.scans for select
  using (
    exists (
      select 1 from public.qr_codes
      where qr_codes.id = scans.qr_code_id
        and qr_codes.user_id = auth.uid()
    )
  );

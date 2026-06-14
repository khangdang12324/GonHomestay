-- Gôn Home Đà Lạt initial schema
-- Run in Supabase SQL editor or with `supabase db push`.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  max_guests int not null default 5 check (max_guests between 1 and 5),
  base_price int,
  status text not null default 'AVAILABLE' check (status in ('AVAILABLE', 'BOOKED', 'MAINTENANCE', 'HIDDEN')),
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_images (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.rooms(id) on delete cascade,
  image_url text not null,
  alt_text text,
  category text check (category in ('bedroom', 'kitchen', 'bbq', 'outside', 'parking', 'living')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.rooms(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  check_in date not null,
  check_out date not null,
  guests int not null check (guests between 1 and 5),
  total_price int,
  status text not null default 'PENDING' check (status in ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED')),
  note text,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_valid_dates check (check_out > check_in)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text unique not null,
  email text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.prices (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.rooms(id) on delete cascade,
  guest_count int not null check (guest_count between 1 and 5),
  price int not null check (price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (room_id, guest_count)
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rooms_set_updated_at on public.rooms;
create trigger rooms_set_updated_at
before update on public.rooms
for each row execute function public.set_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists prices_set_updated_at on public.prices;
create trigger prices_set_updated_at
before update on public.prices
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_images enable row level security;
alter table public.bookings enable row level security;
alter table public.customers enable row level security;
alter table public.prices enable row level security;
alter table public.settings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Public can read marketing data only.
create policy "Public can read visible rooms"
on public.rooms for select
using (status <> 'HIDDEN');

create policy "Public can read room images"
on public.room_images for select
using (true);

create policy "Public can read prices"
on public.prices for select
using (true);

create policy "Public can read settings"
on public.settings for select
using (true);

-- Public can create booking requests but cannot list or read all bookings.
create policy "Public can create booking requests"
on public.bookings for insert
with check (status = 'PENDING');

-- Admin policies. Authenticated admins can manage all operational data.
create policy "Admins can manage profiles"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());

create policy "Users can read own profile"
on public.profiles for select
using (id = auth.uid());

create policy "Admins can manage rooms"
on public.rooms for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage room images"
on public.room_images for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage bookings"
on public.bookings for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage customers"
on public.customers for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage prices"
on public.prices for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage settings"
on public.settings for all
using (public.is_admin())
with check (public.is_admin());

insert into public.rooms (id, name, slug, description, max_guests, base_price, status, cover_image_url)
values (
  '11111111-1111-1111-1111-111111111111',
  'Gôn Home nguyên căn',
  'gon-home-nguyen-can',
  'Homestay nhà gỗ riêng biệt với 2 phòng ngủ, bếp, khu BBQ và chỗ đậu ô tô.',
  5,
  200000,
  'AVAILABLE',
  '/images/homestay/gon-home-hero.jpg'
)
on conflict (slug) do update
set description = excluded.description,
    max_guests = excluded.max_guests,
    base_price = excluded.base_price,
    updated_at = now();

insert into public.prices (room_id, guest_count, price)
values
  ('11111111-1111-1111-1111-111111111111', 1, 200000),
  ('11111111-1111-1111-1111-111111111111', 2, 400000),
  ('11111111-1111-1111-1111-111111111111', 3, 600000),
  ('11111111-1111-1111-1111-111111111111', 4, 800000),
  ('11111111-1111-1111-1111-111111111111', 5, 1000000)
on conflict (room_id, guest_count) do update
set price = excluded.price,
    updated_at = now();

insert into public.settings (key, value)
values
  ('homestay_name', 'Gôn Home Đà Lạt'),
  ('phone', '033 867 4316'),
  ('backup_phone', '098 221 1342'),
  ('zalo', 'https://zalo.me/0338674316'),
  ('facebook', 'https://www.facebook.com/profile.php?id=61577964718081'),
  ('address', 'Đường 17 Đan Kia, phường Langbiang, Đà Lạt'),
  ('map_embed_url', 'https://www.google.com/maps?q=G%C3%B4n%20Home%20%C4%90%C6%B0%E1%BB%9Dng%2017%20%C4%90an%20Kia%20ph%C6%B0%E1%BB%9Dng%20Langbiang%20%C4%90%C3%A0%20L%E1%BA%A1t&output=embed'),
  ('short_description', 'Không gian yên tĩnh, riêng tư, phù hợp nghỉ dưỡng hoặc làm việc từ xa.'),
  ('daily_price_per_guest', '200000'),
  ('monthly_price', '6000000'),
  ('pet_policy', 'Không nhận thú cưng'),
  ('broker_policy', 'Không nhận cò/môi giới'),
  ('check_in_time', '14:00'),
  ('check_out_time', '12:00')
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

insert into storage.buckets (id, name, public)
values ('homestay', 'homestay', true)
on conflict (id) do update
set public = excluded.public;

create policy "Public can read homestay images"
on storage.objects for select
using (bucket_id = 'homestay');

create policy "Admins can upload homestay images"
on storage.objects for insert
with check (bucket_id = 'homestay' and public.is_admin());

create policy "Admins can update homestay images"
on storage.objects for update
using (bucket_id = 'homestay' and public.is_admin())
with check (bucket_id = 'homestay' and public.is_admin());

create policy "Admins can delete homestay images"
on storage.objects for delete
using (bucket_id = 'homestay' and public.is_admin());

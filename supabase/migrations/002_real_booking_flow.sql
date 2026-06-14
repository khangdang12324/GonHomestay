-- Real booking flow hardening for Gôn Home Đà Lạt.
-- Run this after 001_initial_schema.sql if the first migration was already applied.

create unique index if not exists customers_phone_unique_idx
on public.customers (phone);

insert into public.rooms (id, name, slug, description, max_guests, base_price, status, cover_image_url)
values (
  '11111111-1111-1111-1111-111111111111',
  'Gôn Home nguyên căn',
  'gon-home-nguyen-can',
  'Homestay nhà gỗ riêng biệt, lối đi riêng, 2 phòng ngủ, bếp và nội thất đầy đủ.',
  5,
  200000,
  'AVAILABLE',
  '/images/homestay/gon-home-hero.jpg'
)
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    max_guests = excluded.max_guests,
    base_price = excluded.base_price,
    status = excluded.status,
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

-- Optional real test booking. Delete it after verifying admin display if you do not need it.
insert into public.bookings (
  room_id,
  customer_name,
  customer_phone,
  customer_email,
  check_in,
  check_out,
  guests,
  total_price,
  status,
  note,
  source
)
values (
  '11111111-1111-1111-1111-111111111111',
  'Khách test Supabase',
  '0900000001',
  null,
  current_date + interval '3 days',
  current_date + interval '4 days',
  2,
  400000,
  'PENDING',
  'Booking test thật từ migration 002. Có thể xóa sau khi kiểm tra.',
  'Khác'
)
on conflict do nothing;

# Gôn Home Đà Lạt

Production-ready homestay website and admin dashboard for **Gôn Home Đà Lạt**.

## Overview

Gôn Home Đà Lạt is a private wooden house homestay at **Đường 17 Đan Kia, phường Langbiang, Đà Lạt**. The site is built mobile-first because most guests will access it from phones.

The project has two parts:

- Public website with SEO pages, pricing, gallery, Google Map, contact CTA, and booking request form.
- Admin dashboard for the owner to manage bookings, prices, settings, and real homestay images from Supabase.

Operational data requires Supabase configuration. If Supabase is missing, the app shows a clear setup state instead of saving fake data.

## Real Business Info

- Address: Đường 17 Đan Kia, phường Langbiang, Đà Lạt
- Google Map search: Gôn Home
- Primary phone/Zalo: 033 867 4316
- Backup phone: 098 221 1342
- Facebook: https://www.facebook.com/profile.php?id=61577964718081
- Daily price: 200k/người/ngày
- Monthly price: 6 triệu/tháng
- No pets
- No brokers/agents

## Features

- Next.js App Router and TypeScript
- Tailwind CSS UI with shadcn-style primitives
- Vietnamese content and SEO metadata
- Mobile-first layout and bottom contact bar on phones
- Booking form with React Hook Form and Zod validation
- Supabase PostgreSQL schema with RLS policies
- Supabase Auth admin login
- Owner-only admin access through `profiles.role = 'admin'`
- Admin booking table with status update/cancel actions
- Admin price update
- Admin settings update
- Admin image upload/update through Supabase Storage
- Recharts dashboard revenue chart
- TanStack Table booking management

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- TanStack Table
- Recharts
- Lucide React
- Sonner toast

## Routes

Public:

- `/`
- `/rooms`
- `/pricing`
- `/gallery`
- `/location`
- `/booking`
- `/contact`

Admin:

- `/admin/login`
- `/admin`
- `/admin/bookings`
- `/admin/customers`
- `/admin/rooms`
- `/admin/prices`
- `/admin/gallery`
- `/admin/settings`

## Environment Variables

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_ADMIN_EMAIL=
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY` in client code.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial_schema.sql`.
3. If you already ran migration 001 before the real-booking update, also run `supabase/migrations/002_real_booking_flow.sql`.
4. Create the owner account in Supabase Auth.
5. Set the owner password in Supabase Auth, not in source code.
6. Insert the owner profile:

```sql
insert into public.profiles (id, full_name, role)
values ('AUTH_USER_ID_HERE', 'Gôn Home Admin', 'admin');
```

7. Add Supabase URL, anon key, and service role key to `.env.local`.
8. Restart `npm run dev`.

Recommended local env:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAIL=
```

## Admin Account Note

The password should never be committed to GitHub. Use Supabase Auth to create your private admin account and set the password there.

## Images

Real photos are managed from `/admin/gallery`.

Supabase Storage bucket:

```txt
homestay
```

The admin can:

- Add a new image
- Update an existing image
- Edit alt text for SEO
- Choose category: bedroom, kitchen, bbq, outside, parking, living

## Database Schema

See [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql).

Tables:

- `profiles`
- `rooms`
- `room_images`
- `bookings`
- `customers`
- `prices`
- `settings`

Storage:

- `homestay` bucket

## Real Booking Flow

- Public `/booking` creates a real `PENDING` row in Supabase `bookings`.
- Admin `/admin/bookings` can create a real `CONFIRMED` booking for phone/Zalo/Facebook customers.
- Booking price is calculated from guest count and night count.
- The booking is linked to `rooms.slug = 'gon-home-nguyen-can'` when the room exists.
- Customer data is upserted by phone when `SUPABASE_SERVICE_ROLE_KEY` is configured.

To test immediately, run migration 002. It inserts one real test booking:

```txt
Khách test Supabase
```

Delete that row after verifying the dashboard if you do not need it.

## How To Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build Checks

```bash
npm run lint
npm run build
```

## Future Improvements

- Availability calendar
- Email/Zalo notification integration
- Deposit/payment flow
- Full customer spending aggregation
- E2E tests

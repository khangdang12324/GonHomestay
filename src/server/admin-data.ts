import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import type { Booking, Customer, GalleryImage, Price, Room, Setting } from "@/types";

export type AdminDataResult<T> = {
  data: T;
  configured: boolean;
  error?: string;
};

type BookingRow = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number | null;
  status: Booking["status"];
  note: string | null;
  source: string | null;
  created_at: string;
};

type RoomRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  max_guests: number;
  base_price: number | null;
  status: Room["status"];
  cover_image_url: string | null;
};

type CustomerRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  note: string | null;
};

type GalleryRow = {
  id: string;
  image_url: string;
  alt_text: string | null;
  category: GalleryImage["category"] | null;
};

type SettingRow = {
  key: string;
  value: string | null;
};

type PriceRow = {
  guest_count: number;
  price: number;
};

export async function getBookings(): Promise<AdminDataResult<Booking[]>> {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return { data: [], configured: false };

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: [], configured: true, error: error.message };

  return {
    configured: true,
    data: ((data || []) as BookingRow[]).map((row) => ({
      id: row.id,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerEmail: row.customer_email || undefined,
      checkIn: row.check_in,
      checkOut: row.check_out,
      guests: row.guests,
      totalPrice: row.total_price || 0,
      status: row.status,
      note: row.note || undefined,
      source: row.source || undefined,
      createdAt: row.created_at,
    })),
  };
}

export async function getRooms(): Promise<AdminDataResult<Room[]>> {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return { data: [], configured: false };

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: [], configured: true, error: error.message };

  return {
    configured: true,
    data: ((data || []) as RoomRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description || "",
      maxGuests: row.max_guests,
      basePrice: row.base_price || 0,
      status: row.status,
      coverImageUrl: row.cover_image_url || "/images/homestay/gon-home-hero.jpg",
    })),
  };
}

export async function getCustomers(): Promise<AdminDataResult<Customer[]>> {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return { data: [], configured: false };

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: [], configured: true, error: error.message };

  return {
    configured: true,
    data: ((data || []) as CustomerRow[]).map((row) => ({
      id: row.id,
      fullName: row.full_name,
      phone: row.phone,
      email: row.email || undefined,
      bookingCount: 0,
      totalSpent: 0,
      note: row.note || undefined,
    })),
  };
}

export async function getGalleryImages(): Promise<AdminDataResult<GalleryImage[]>> {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return { data: [], configured: false };

  const { data, error } = await supabase
    .from("room_images")
    .select("id,image_url,alt_text,category")
    .order("sort_order", { ascending: true });

  if (error) return { data: [], configured: true, error: error.message };

  return {
    configured: true,
    data: ((data || []) as GalleryRow[]).map((row) => ({
      id: row.id,
      src: row.image_url,
      alt: row.alt_text || "Ảnh Gôn Home Đà Lạt",
      category: row.category || "outside",
    })),
  };
}

export async function getSettings(): Promise<AdminDataResult<Setting[]>> {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return { data: [], configured: false };

  const { data, error } = await supabase.from("settings").select("key,value").order("key");

  if (error) return { data: [], configured: true, error: error.message };

  return {
    configured: true,
    data: ((data || []) as SettingRow[]).map((row) => ({
      key: row.key,
      value: row.value || "",
    })),
  };
}

export async function getPrices(): Promise<AdminDataResult<Price[]>> {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return { data: [], configured: false };

  const { data, error } = await supabase
    .from("prices")
    .select("guest_count,price")
    .order("guest_count", { ascending: true });

  if (error) return { data: [], configured: true, error: error.message };

  return {
    configured: true,
    data: ((data || []) as PriceRow[]).map((row) => ({
      guestCount: row.guest_count,
      price: row.price,
    })),
  };
}

async function getSupabaseOrNull() {
  if (!isSupabaseConfigured()) return null;
  return createSupabaseAdminClient() || createSupabaseServerClient();
}

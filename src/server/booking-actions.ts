"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";

type UpdateBookingInput = {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  note?: string;
  status?: BookingStatus;
};

export async function updateBooking(
  bookingId: string,
  updates: UpdateBookingInput,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase chưa được cấu hình." };
  }

  const supabase = createSupabaseAdminClient() || (await createSupabaseServerClient());
  if (!supabase) {
    return { success: false, error: "Không thể kết nối Supabase." };
  }

  const updateData: Record<string, unknown> = {};

  if (updates.customerName) updateData.customer_name = updates.customerName;
  if (updates.customerPhone) updateData.customer_phone = updates.customerPhone;
  if (updates.customerEmail) updateData.customer_email = updates.customerEmail;
  if (updates.note !== undefined) updateData.note = updates.note;
  if (updates.status) updateData.status = updates.status;

  updateData.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteBooking(bookingId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase chưa được cấu hình." };
  }

  const supabase = createSupabaseAdminClient() || (await createSupabaseServerClient());
  if (!supabase) {
    return { success: false, error: "Không thể kết nối Supabase." };
  }

  const { error } = await supabase.from("bookings").delete().eq("id", bookingId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function checkAvailableDates(
  roomId: string | null,
  checkInDate: string,
  checkOutDate: string,
): Promise<{ available: boolean; conflictingBooking?: Booking }> {
  if (!isSupabaseConfigured()) {
    return { available: true }; // Không check nếu chưa cấu hình
  }

  const supabase = createSupabaseAdminClient() || (await createSupabaseServerClient());
  if (!supabase) {
    return { available: true };
  }

  // Query bookings that overlap with the requested date range
  // and have status CONFIRMED
  let query = supabase
    .from("bookings")
    .select("*")
    .eq("status", "CONFIRMED")
    .lt("check_in", checkOutDate)
    .gt("check_out", checkInDate);

  if (roomId) {
    query = query.eq("room_id", roomId);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return { available: true };
  }

  // If there's any conflicting booking, return available: false
  const conflicting = data[0] as any;
  return {
    available: false,
    conflictingBooking: {
      id: conflicting.id,
      customerName: conflicting.customer_name,
      customerPhone: conflicting.customer_phone,
      customerEmail: conflicting.customer_email,
      checkIn: conflicting.check_in,
      checkOut: conflicting.check_out,
      guests: conflicting.guests,
      totalPrice: conflicting.total_price || 0,
      status: conflicting.status,
      createdAt: conflicting.created_at,
    },
  };
}

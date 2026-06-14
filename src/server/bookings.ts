"use server";

import { getPriceForGuests } from "@/data/pricing";
import { primaryRoom } from "@/data/property";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { dateDiffInNights, isSupabaseConfigured } from "@/lib/utils";
import { bookingSchema, type BookingFormValues } from "@/lib/validations/booking";

export async function createBooking(input: BookingFormValues) {
  return persistBooking(input, "PENDING", "public");
}

export async function createAdminBooking(input: BookingFormValues) {
  return persistBooking(input, "CONFIRMED", "admin");
}

async function persistBooking(
  input: BookingFormValues,
  status: "PENDING" | "CONFIRMED",
  mode: "public" | "admin",
) {
  const parsed = bookingSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Thông tin booking chưa hợp lệ.",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message:
        "Chưa cấu hình Supabase nên không thể lưu booking thật. Vui lòng cấu hình Supabase hoặc liên hệ Gôn Home qua Zalo/điện thoại.",
    };
  }

  const values = parsed.data;
  const totalPrice =
    getPriceForGuests(values.guests) *
    dateDiffInNights(values.checkIn, values.checkOut);

  const adminSupabase = createSupabaseAdminClient();
  const supabase =
    mode === "public"
      ? adminSupabase || (await createSupabaseServerClient())
      : await createSupabaseServerClient();

  if (!supabase) {
    return { ok: false, message: "Chưa cấu hình Supabase." };
  }

  const { data: room } = await supabase
    .from("rooms")
    .select("id")
    .eq("slug", primaryRoom.slug)
    .maybeSingle();

  const payload = {
    room_id: room?.id || null,
    customer_name: values.customerName,
    customer_phone: values.customerPhone,
    customer_email: values.customerEmail || null,
    check_in: values.checkIn,
    check_out: values.checkOut,
    guests: values.guests,
    total_price: totalPrice,
    status,
    note: values.note || null,
    source: values.source,
  };

  const canReadInsertedBooking = Boolean(adminSupabase || mode === "admin");
  const result = canReadInsertedBooking
    ? await supabase.from("bookings").insert(payload).select("id").single()
    : await supabase.from("bookings").insert(payload);

  if (result.error) {
    return { ok: false, message: result.error.message };
  }

  await syncCustomer({
    fullName: values.customerName,
    phone: values.customerPhone,
    email: values.customerEmail || null,
    note: values.note || null,
    adminSupabase,
  });

  return {
    ok: true,
    message:
      canReadInsertedBooking && "data" in result && result.data?.id
        ? `Đã lưu booking thật. Mã booking: ${result.data.id.slice(0, 8).toUpperCase()}.`
        : "Đã lưu booking thật vào Supabase.",
  };
}

async function syncCustomer({
  fullName,
  phone,
  email,
  note,
  adminSupabase,
}: {
  fullName: string;
  phone: string;
  email: string | null;
  note: string | null;
  adminSupabase: ReturnType<typeof createSupabaseAdminClient>;
}) {
  const supabase = adminSupabase || (await createSupabaseServerClient());
  if (!supabase) return;

  await supabase.from("customers").upsert(
    {
      full_name: fullName,
      phone,
      email,
      note,
    },
    { onConflict: "phone" },
  );
}

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { primaryRoom } from "@/data/property";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let roomId = searchParams.get("roomId");

    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json(
        { blockedDates: [], message: "Supabase not configured" },
        { status: 200 },
      );
    }

    // Map 'default' to the actual database room ID
    if (!roomId || roomId === "default") {
      const { data: room } = await supabase
        .from("rooms")
        .select("id")
        .eq("slug", primaryRoom.slug)
        .maybeSingle();

      if (room?.id) {
        roomId = room.id;
      }
    }

    let query = supabase
      .from("bookings")
      .select("check_in, check_out, status")
      .in("status", ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "BLOCKED"]);

    // If a specific roomId is provided (not 'default'), filter by it.
    // Otherwise, since there's only 1 room in this homestay, we can safely return all confirmed bookings.
    if (roomId && roomId !== "default") {
      query = query.eq("room_id", roomId);
    }

    // Get all confirmed bookings
    const { data: bookings, error } = await query;

    if (error) {
      console.error("Error fetching bookings:", error);
      return NextResponse.json(
        { blockedDates: [], error: error.message },
        { status: 200 },
      );
    }

    // Generate list of blocked dates
    const blockedDates = new Set<string>();

    bookings?.forEach((booking: any) => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);

      // Include check-in day and all days until check-out (exclusive for bookings, inclusive for BLOCKED)
      for (
        let d = new Date(checkIn);
        booking.status === "BLOCKED" ? d <= checkOut : d < checkOut;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split("T")[0];
        blockedDates.add(dateStr);
      }
    });

    return NextResponse.json({
      blockedDates: Array.from(blockedDates).sort(),
      bookingCount: bookings?.length || 0,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        blockedDates: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 },
    );
  }
}

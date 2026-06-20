import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { error: "roomId is required" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json(
        { blockedDates: [], message: "Supabase not configured" },
        { status: 200 }
      );
    }

    // Get all confirmed bookings for this room
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("checkIn, checkOut, status")
      .eq("roomId", roomId)
      .eq("status", "CONFIRMED");

    if (error) {
      console.error("Error fetching bookings:", error);
      return NextResponse.json(
        { blockedDates: [], error: error.message },
        { status: 200 }
      );
    }

    // Generate list of blocked dates
    const blockedDates = new Set<string>();

    bookings?.forEach((booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);

      // Include check-in day and all days until check-out (exclusive)
      for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
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
      { status: 200 }
    );
  }
}

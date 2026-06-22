import { NextRequest, NextResponse } from "next/server";
import { checkAvailableDates } from "@/server/booking-actions";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const roomId = searchParams.get("roomId");
  const checkInDate = searchParams.get("checkIn");
  const checkOutDate = searchParams.get("checkOut");

  if (!checkInDate || !checkOutDate) {
    return NextResponse.json(
      { error: "checkIn và checkOut là bắt buộc" },
      { status: 400 },
    );
  }

  const result = await checkAvailableDates(roomId, checkInDate, checkOutDate);

  return NextResponse.json({
    available: result.available,
    message: result.available ? "Phòng còn trống" : "Phòng đã được đặt trong khoảng thời gian này.",
  });
}

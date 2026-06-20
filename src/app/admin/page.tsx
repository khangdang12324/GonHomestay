import { CalendarCheck2, CircleDollarSign, Clock, ShieldCheck } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { BookingStatusBadge } from "@/components/admin/BookingStatusBadge";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { StatsCard } from "@/components/admin/StatsCard";
import { formatCurrencyVND, formatDateVN } from "@/lib/utils";
import { getBookings } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const result = await getBookings();
  const bookings = result.data;
  const pending = bookings.filter((booking) => booking.status === "PENDING").length;
  const confirmed = bookings.filter((booking) => booking.status === "CONFIRMED").length;
  const revenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const revenueSeries = buildRevenueSeries(bookings);

  return (
    <AdminShell
      title="Tổng quan"
      description="Theo dõi booking, trạng thái và doanh thu cơ bản của Gôn Home."
    >
      <AdminNotice configured={result.configured} error={result.error} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Tổng booking" value={String(bookings.length)} icon={<CalendarCheck2 />} />
        <StatsCard label="Đang chờ" value={String(pending)} icon={<Clock />} />
        <StatsCard label="Đã xác nhận" value={String(confirmed)} icon={<ShieldCheck />} />
        <StatsCard label="Doanh thu tháng này" value={formatCurrencyVND(revenue)} icon={<CircleDollarSign />} />
      </div>
      <div className="mt-6">
        <RevenueChart data={revenueSeries} />
      </div>
      <div className="mt-6 rounded-lg border border-[#e5d8c5] bg-white">
        <div className="border-b border-[#e5d8c5] p-4">
          <h2 className="font-bold text-[#2f241b]">Booking mới nhất</h2>
        </div>
        <div className="divide-y divide-[#efe3d2]">
          {bookings.length ? bookings.map((booking) => (
            <div key={booking.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-semibold text-[#2f241b]">{booking.customerName}</p>
                <p className="text-sm text-[#6d5a49]">
                  {formatDateVN(booking.checkIn)} - {formatDateVN(booking.checkOut)} · {booking.guests} khách
                </p>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>
          )) : (
            <div className="p-6 text-sm text-[#6d5a49]">Chưa có booking thật trong Supabase.</div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function buildRevenueSeries(bookings: Awaited<ReturnType<typeof getBookings>>["data"]) {
  const formatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" });
  const map = new Map<string, number>();

  bookings.forEach((booking) => {
    const key = formatter.format(new Date(booking.createdAt));
    map.set(key, (map.get(key) || 0) + booking.totalPrice);
  });

  return Array.from(map.entries()).map(([date, revenue]) => ({ date, revenue }));
}

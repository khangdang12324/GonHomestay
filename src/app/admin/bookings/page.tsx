import { AdminShell } from "@/components/admin/AdminShell";
import { AdminBookingForm } from "@/components/admin/AdminBookingForm";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { BookingTable } from "@/components/admin/BookingTable";
import { getBookings } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const result = await getBookings();

  return (
    <AdminShell
      title="Quản lý đặt phòng"
      description="Tìm kiếm, lọc trạng thái, xem chi tiết và hủy booking."
    >
      <AdminNotice configured={result.configured} error={result.error} />
      <AdminBookingForm />
      <BookingTable bookings={result.data} />
    </AdminShell>
  );
}

import { AdminShell } from "@/components/admin/AdminShell";
import { CalendarView } from "@/components/admin/CalendarView";
import { getBookings, getRooms } from "@/server/admin-data";
import { requireAdminSession } from "@/server/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  await requireAdminSession();

  const bookingsResult = await getBookings();
  const roomsResult = await getRooms();

  return (
    <AdminShell
      title="Lịch quản lý"
      description="Xem lịch đặt phòng, quản lý trạng thái phòng"
    >
      <CalendarView
        bookings={bookingsResult.data}
        rooms={roomsResult.data}
        configured={bookingsResult.configured}
      />
    </AdminShell>
  );
}

import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { BookingDetailForm } from "@/components/admin/BookingDetailForm";
import { getBookingById } from "@/server/admin-data";
import { requireAdminSession } from "@/server/admin-session";
import { formatDateVN } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getBookingById(id);
  if (!result.data) return { title: "Booking không tìm thấy" };
  return { title: `Chi tiết booking - ${result.data.customerName}` };
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();

  const { id } = await params;
  const result = await getBookingById(id);

  if (!result.configured) {
    redirect("/admin/login");
  }

  if (!result.data) {
    notFound();
  }

  const booking = result.data;

  return (
    <AdminShell
      title={`${booking.customerName}`}
      description={`${formatDateVN(booking.checkIn)} - ${formatDateVN(booking.checkOut)}`}
    >
      <BookingDetailForm booking={booking} />
    </AdminShell>
  );
}

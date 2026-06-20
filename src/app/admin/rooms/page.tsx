import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageFrame } from "@/components/site/ImageFrame";
import { roomStatusLabels } from "@/data/constants";
import { formatCurrencyVND } from "@/lib/utils";
import { getRooms } from "@/server/admin-data";
import { requireAdminSession } from "@/server/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  await requireAdminSession();

  const result = await getRooms();

  return (
    <AdminShell title="Quản lý phòng/căn" description="Thông tin căn, slug, giá cơ bản và trạng thái hiển thị.">
      <AdminNotice configured={result.configured} error={result.error} />
      <div className="grid gap-4">
        {result.data.length ? result.data.map((room) => (
          <Card key={room.id} className="grid gap-5 p-5 lg:grid-cols-[220px_1fr_auto] lg:items-center">
            <ImageFrame src={room.coverImageUrl} alt={room.name} className="aspect-[4/3]" />
            <div>
              <p className="text-xl font-bold text-[#2f241b]">{room.name}</p>
              <p className="mt-1 text-sm text-[#6d5a49]">/{room.slug}</p>
              <p className="mt-3 text-sm leading-6 text-[#594536]">{room.description}</p>
              <p className="mt-3 text-sm font-semibold text-[#2f5d46]">
                {formatCurrencyVND(room.basePrice)} · tối đa {room.maxGuests} khách · {roomStatusLabels[room.status]}
              </p>
            </div>
            <Button type="button" variant="outline">Sửa</Button>
          </Card>
        )) : (
          <Card className="p-6 text-sm text-[#6d5a49]">Chưa có dữ liệu phòng thật trong Supabase.</Card>
        )}
      </div>
    </AdminShell>
  );
}

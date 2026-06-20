import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { PriceTable } from "@/components/admin/PriceTable";
import { getPrices } from "@/server/admin-data";
import { requireAdminSession } from "@/server/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminPricesPage() {
  await requireAdminSession();

  const result = await getPrices();

  return (
    <AdminShell title="Quản lý bảng giá" description="Cập nhật giá theo số lượng khách từ 1 đến 5 người.">
      <AdminNotice configured={result.configured} error={result.error} />
      {result.data.length ? (
        <PriceTable initialPrices={result.data} />
      ) : (
        <div className="rounded-lg border border-[#e5d8c5] bg-white p-6 text-sm text-[#6d5a49]">
          Chưa có bảng giá thật trong Supabase.
        </div>
      )}
    </AdminShell>
  );
}

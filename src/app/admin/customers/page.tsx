import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { Card } from "@/components/ui/card";
import { formatCurrencyVND } from "@/lib/utils";
import { getCustomers } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const result = await getCustomers();

  return (
    <AdminShell title="Quản lý khách hàng" description="Thông tin khách, số lần đặt và tổng chi tiêu.">
      <AdminNotice configured={result.configured} error={result.error} />
      <div className="grid gap-4">
        {result.data.length ? result.data.map((customer) => (
          <Card key={customer.id} className="grid gap-3 p-5 md:grid-cols-[1fr_160px_180px] md:items-center">
            <div>
              <p className="font-bold text-[#2f241b]">{customer.fullName}</p>
              <p className="text-sm text-[#6d5a49]">{customer.phone}</p>
              <p className="text-sm text-[#6d5a49]">{customer.email || "Chưa có email"}</p>
              {customer.note ? <p className="mt-2 text-sm text-[#594536]">{customer.note}</p> : null}
            </div>
            <p className="text-sm text-[#594536]">{customer.bookingCount} lần đặt</p>
            <p className="font-bold text-[#2f5d46]">{formatCurrencyVND(customer.totalSpent)}</p>
          </Card>
        )) : (
          <Card className="p-6 text-sm text-[#6d5a49]">Chưa có khách hàng thật trong Supabase.</Card>
        )}
      </div>
    </AdminShell>
  );
}

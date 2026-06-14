import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/server/admin-data";

export default async function AdminSettingsPage() {
  const result = await getSettings();

  return (
    <AdminShell title="Cài đặt homestay" description="Thông tin liên hệ, chính sách và giờ check-in/check-out.">
      <AdminNotice configured={result.configured} error={result.error} />
      {result.data.length ? (
        <SettingsForm settings={result.data} />
      ) : (
        <div className="rounded-lg border border-[#e5d8c5] bg-white p-6 text-sm text-[#6d5a49]">
          Chưa có settings thật trong Supabase.
        </div>
      )}
    </AdminShell>
  );
}

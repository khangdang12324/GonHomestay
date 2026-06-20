import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { getGalleryImages } from "@/server/admin-data";
import { requireAdminSession } from "@/server/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  await requireAdminSession();

  const result = await getGalleryImages();

  return (
    <AdminShell title="Quản lý hình ảnh" description="Xem ảnh local và chuẩn bị cho Supabase Storage.">
      <AdminNotice configured={result.configured} error={result.error} />
      <ImageUploader images={result.data} />
    </AdminShell>
  );
}

import type { Metadata } from "next";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { getGalleryImages } from "@/server/admin-data";

export const metadata: Metadata = {
  title: "Thư viện ảnh",
  description: "Hình ảnh Gôn Home Đà Lạt: phòng ngủ, bếp, BBQ, bên ngoài và chỗ đậu xe.",
};

export default async function GalleryPage() {
  const result = await getGalleryImages();

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a5a36]">
          Gallery
        </p>
        <h1 className="mt-2 text-4xl font-bold text-[#2f241b]">Thư viện ảnh Gôn Home</h1>
        <p className="mt-4 max-w-2xl text-[#594536]">
          Hình ảnh thật được quản lý trong Supabase Storage từ trang admin.
        </p>
        <div className="mt-8">
          {result.data.length ? (
            <GalleryGrid images={result.data} />
          ) : (
            <div className="rounded-lg border border-[#e5d8c5] bg-[#fffaf2] p-6 text-sm text-[#6d5a49]">
              Chưa có ảnh thật trong Supabase. Vui lòng cập nhật ảnh trong admin.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

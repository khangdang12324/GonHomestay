"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { GalleryCategory, GalleryImage } from "@/types";

const categories: GalleryCategory[] = [
  "bedroom",
  "kitchen",
  "bbq",
  "outside",
  "parking",
  "living",
];

export function ImageUploader({ images }: { images: GalleryImage[] }) {
  const [selectedId, setSelectedId] = useState("");
  const [altText, setAltText] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("outside");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedImage = images.find((image) => image.id === selectedId);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        toast.error("Chưa cấu hình Supabase nên không thể cập nhật ảnh thật.");
        return;
      }

      let imageUrl = images.find((image) => image.id === selectedId)?.src;

      if (file) {
        const path = `homestay/${Date.now()}-${file.name}`;
        const upload = await supabase.storage.from("homestay").upload(path, file, {
          upsert: true,
        });

        if (upload.error) {
          toast.error(upload.error.message);
          return;
        }

        const publicUrl = supabase.storage.from("homestay").getPublicUrl(path);
        imageUrl = publicUrl.data.publicUrl;
      }

      if (!imageUrl) {
        toast.error("Vui lòng chọn ảnh để tải lên.");
        return;
      }

      const payload = {
        image_url: imageUrl,
        alt_text: altText || "Ảnh Gôn Home Đà Lạt",
        category,
      };

      const result = selectedId
        ? await supabase.from("room_images").update(payload).eq("id", selectedId)
        : await supabase.from("room_images").insert(payload);

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success(selectedId ? "Đã cập nhật ảnh." : "Đã thêm ảnh mới.");
      window.location.reload();
    });
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-[#e5d8c5] bg-white p-5">
        <h2 className="font-bold text-[#2f241b]">Thêm / cập nhật ảnh thật</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[#3a2a1d]">
            Chọn ảnh cần cập nhật
            <Select
              value={selectedId}
              onChange={(event) => {
                const nextId = event.target.value;
                const current = images.find((image) => image.id === nextId);
                setSelectedId(nextId);
                setAltText(current?.alt || "");
                setCategory(current?.category || "outside");
                setFile(null);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl("");
              }}
            >
              <option value="">Thêm ảnh mới</option>
              {images.map((image) => (
                <option key={image.id} value={image.id}>
                  {image.alt}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#3a2a1d]">
            File ảnh
            <Input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] || null;
                setFile(nextFile);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : "");
              }}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#3a2a1d]">
            Alt text SEO
            <Input
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Ví dụ: Phòng ngủ Gôn Home Đà Lạt"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#3a2a1d]">
            Danh mục
            <Select
              value={category}
              onChange={(event) => setCategory(event.target.value as GalleryCategory)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </label>
          <div className="md:col-span-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang cập nhật..." : selectedId ? "Cập nhật ảnh" : "Thêm ảnh mới"}
            </Button>
          </div>
        </form>
        <div className="mt-5 rounded-lg border border-dashed border-[#d7c7ad] bg-[#fffaf2] p-3">
          <p className="mb-3 text-sm font-semibold text-[#3a2a1d]">
            Xem trước ảnh sẽ {selectedId ? "cập nhật" : "thêm mới"}
          </p>
          {previewUrl || selectedImage ? (
            <div className="grid gap-3 md:grid-cols-[220px_1fr] md:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl || selectedImage?.src}
                alt={altText || selectedImage?.alt || "Ảnh xem trước Gôn Home"}
                className="aspect-[4/3] w-full rounded-lg object-cover"
              />
              <div className="text-sm leading-6 text-[#594536]">
                <p>
                  <span className="font-semibold text-[#2f241b]">Tên file:</span>{" "}
                  {file?.name || "Đang dùng ảnh hiện tại"}
                </p>
                <p>
                  <span className="font-semibold text-[#2f241b]">Alt:</span>{" "}
                  {altText || selectedImage?.alt || "Chưa nhập alt text"}
                </p>
                <p>
                  <span className="font-semibold text-[#2f241b]">Danh mục:</span> {category}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#6d5a49]">
              Chọn file ảnh để xem trước trước khi bấm thêm/cập nhật.
            </p>
          )}
        </div>
      </div>
      {images.length ? (
        <GalleryGrid images={images} />
      ) : (
        <div className="rounded-lg border border-[#e5d8c5] bg-white p-6 text-sm text-[#6d5a49]">
          Chưa có ảnh thật trong Supabase. Hãy chọn file ở trên rồi bấm “Thêm ảnh mới”.
        </div>
      )}
    </div>
  );
}

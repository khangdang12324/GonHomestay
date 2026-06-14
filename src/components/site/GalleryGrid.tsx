"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { galleryImages } from "@/data/gallery";
import { Button } from "@/components/ui/button";
import { ImageFrame } from "./ImageFrame";
import type { GalleryImage } from "@/types";

export function GalleryGrid({
  preview = false,
  images: providedImages,
}: {
  preview?: boolean;
  images?: GalleryImage[];
}) {
  const sourceImages = providedImages ?? galleryImages;
  const featuredImages = sourceImages.filter((image) => image.featured);
  const images = preview
    ? (featuredImages.length ? featuredImages : sourceImages).slice(0, 6)
    : sourceImages;
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelected(image)}
            className="group min-w-0 text-left"
          >
            <ImageFrame
              src={image.src}
              alt={image.alt}
              className={index === 0 && !preview ? "aspect-[4/3] sm:aspect-[16/10] sm:col-span-2 lg:col-span-2" : "aspect-[4/3]"}
            />
            <p className="mt-2 text-sm font-medium text-[#594536] group-hover:text-[#2f5d46]">
              {image.alt}
            </p>
          </button>
        ))}
      </div>
      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="relative w-full max-w-5xl">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSelected(null)}
              className="absolute right-2 top-2 z-10 bg-white/90 p-0 text-[#2f241b]"
              aria-label="Đóng ảnh"
            >
              <X size={20} />
            </Button>
            <ImageFrame src={selected.src} alt={selected.alt} className="aspect-[16/10]" />
            <p className="mt-3 text-center text-sm text-white">{selected.alt}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

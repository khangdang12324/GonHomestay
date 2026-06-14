import { ButtonLink } from "@/components/ui/button";
import { galleryImages } from "@/data/gallery";
import type { GalleryImage } from "@/types";
import { ImageFrame } from "./ImageFrame";

export function HeroSection({ heroImage }: { heroImage?: GalleryImage }) {
  const hero = heroImage || galleryImages[0];

  return (
    <section className="bg-[#fffaf2]">
      <div className="mx-auto grid min-h-[640px] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a5a36]">
            Homestay nhà gỗ tại Đà Lạt
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-[#2f241b] sm:text-5xl">
            Gôn Home Đà Lạt - Homestay nhà gỗ riêng biệt cho nhóm và gia đình
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#594536]">
            Không gian yên tĩnh, riêng tư tại đường 17 Đan Kia, phường
            Langbiang. Nhà có 2 phòng ngủ, bếp đầy đủ, free wifi mạnh, chỗ đậu
            ô tô và khu BBQ.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/pricing">Xem giá phòng</ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Liên hệ Zalo
            </ButtonLink>
          </div>
        </div>
        <ImageFrame
          src={hero.src}
          alt={hero.alt}
          priority
          className="aspect-[4/3] min-h-[360px]"
        />
      </div>
    </section>
  );
}

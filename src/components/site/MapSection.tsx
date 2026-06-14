import { siteConfig } from "@/data/constants";

export function MapSection() {
  return (
    <section className="bg-[#fffaf2] py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a5a36]">
            Vị trí
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[#2f241b]">{siteConfig.name}</h2>
          <p className="mt-4 font-semibold text-[#2f5d46]">{siteConfig.address}</p>
          <p className="mt-3 text-[#594536]">
            Đường lớn dễ đi, thuận tiện di chuyển, không gian yên tĩnh.
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-[#e5d8c5] bg-white">
          <iframe
            title="Bản đồ Gôn Home Đà Lạt"
            src={siteConfig.mapEmbedUrl}
            className="h-[360px] w-full"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

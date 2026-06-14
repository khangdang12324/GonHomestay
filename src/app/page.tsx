import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { BookingForm } from "@/components/site/BookingForm";
import { ContactCTA } from "@/components/site/ContactCTA";
import { FAQSection } from "@/components/site/FAQSection";
import { FeatureSection } from "@/components/site/FeatureSection";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { HeroSection } from "@/components/site/HeroSection";
import { MapSection } from "@/components/site/MapSection";
import { PricingSection } from "@/components/site/PricingSection";
import { amenities } from "@/data/constants";
import { getGalleryImages } from "@/server/admin-data";

export default async function HomePage() {
  const gallery = await getGalleryImages();
  const heroImage = gallery.data[0];

  return (
    <>
      <HeroSection heroImage={heroImage} />
      <FeatureSection />
      <section className="bg-[#fffaf2] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a5a36]">
              Giới thiệu
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#2f241b]">
              Một căn nhà gỗ riêng tư cho chuyến đi Đà Lạt chậm rãi hơn
            </h2>
            <p className="mt-5 leading-8 text-[#594536]">
              Gôn Home Đà Lạt là homestay nguyên căn dành cho gia đình, nhóm bạn
              và khách muốn có không gian yên tĩnh để nghỉ dưỡng hoặc làm việc
              online. Nhà có 2 phòng ngủ, bếp cơ bản, khu BBQ, wifi mạnh và chỗ
              đậu ô tô, đủ tiện nghi cho một kỳ nghỉ gọn gàng và riêng tư.
            </p>
          </div>
          <div className="rounded-lg border border-[#e5d8c5] bg-white p-6">
            <h3 className="text-xl font-bold text-[#2f241b]">Phòng & tiện ích</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {amenities.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-[#594536]">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#2f5d46]" size={18} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <PricingSection />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a5a36]">
                Hình ảnh
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#2f241b]">
                Góc nhà gỗ ấm cúng tại Đà Lạt
              </h2>
            </div>
            <Link href="/gallery" className="font-semibold text-[#2f5d46]">
              Xem tất cả hình ảnh
            </Link>
          </div>
          <div className="mt-8">
            {gallery.data.length ? (
              <GalleryGrid images={gallery.data} />
            ) : (
              <div className="rounded-lg border border-[#e5d8c5] bg-[#fffaf2] p-6 text-sm text-[#6d5a49]">
                Chưa có ảnh thật trong Supabase. Admin có thể cập nhật ảnh ở trang quản lý hình ảnh.
              </div>
            )}
          </div>
        </div>
      </section>
      <MapSection />
      <FAQSection />
      <section className="bg-[#fffaf2] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a5a36]">
              Đặt phòng
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#2f241b]">
              Gửi yêu cầu đặt phòng
            </h2>
            <p className="mt-4 leading-7 text-[#594536]">
              Form sẽ lưu trực tiếp vào Supabase. Nếu hệ thống chưa cấu hình
              Supabase, khách sẽ được hướng dẫn liên hệ qua Zalo hoặc điện thoại.
            </p>
          </div>
          <div className="rounded-lg border border-[#e5d8c5] bg-white p-6">
            <BookingForm />
          </div>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}

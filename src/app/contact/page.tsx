import type { Metadata } from "next";
import { ContactCTA } from "@/components/site/ContactCTA";
import { BookingForm } from "@/components/site/BookingForm";
import { siteConfig } from "@/data/constants";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ Gôn Home Đà Lạt qua điện thoại, Zalo, Facebook hoặc form đặt phòng.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-[#fffaf2] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a5a36]">
              Liên hệ
            </p>
            <h1 className="mt-2 text-4xl font-bold text-[#2f241b]">Thông tin Gôn Home</h1>
            <div className="mt-6 space-y-3 text-[#594536]">
              <p>Ưu tiên/Zalo: {siteConfig.phone}</p>
              <p>Số dự phòng nếu máy bận: {siteConfig.backupPhone}</p>
              <p>Zalo: {siteConfig.zalo}</p>
              <p>Facebook: {siteConfig.facebook}</p>
              <p>Địa chỉ: {siteConfig.address}</p>
            </div>
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

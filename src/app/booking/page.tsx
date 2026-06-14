import type { Metadata } from "next";
import { BookingForm } from "@/components/site/BookingForm";

export const metadata: Metadata = {
  title: "Đặt phòng",
  description: "Gửi yêu cầu đặt phòng Gôn Home Đà Lạt.",
};

export default function BookingPage() {
  return (
    <section className="bg-[#fffaf2] py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a5a36]">
            Đặt phòng
          </p>
          <h1 className="mt-2 text-4xl font-bold text-[#2f241b]">
            Gửi yêu cầu đặt phòng Gôn Home
          </h1>
          <p className="mt-4 leading-7 text-[#594536]">
            Điền thông tin lưu trú, Gôn Home sẽ liên hệ xác nhận lịch trống,
            giá chính xác và hướng dẫn đặt cọc nếu cần. Giá hiện tại là
            200k/người/ngày hoặc 6 triệu/tháng.
          </p>
        </div>
        <div className="rounded-lg border border-[#e5d8c5] bg-white p-6">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}

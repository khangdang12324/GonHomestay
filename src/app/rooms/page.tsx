import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageFrame } from "@/components/site/ImageFrame";
import { amenities } from "@/data/constants";
import { publicRooms } from "@/data/property";
import { formatCurrencyVND } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Phòng & tiện ích",
  description: "Thông tin căn Gôn Home nguyên căn, 2 phòng ngủ, tối đa 5 khách.",
};

export default function RoomsPage() {
  const room = publicRooms[0];

  return (
    <section className="bg-[#fffaf2] py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <ImageFrame src={room.coverImageUrl} alt={room.name} className="aspect-[4/3]" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a5a36]">
            Phòng & căn
          </p>
          <h1 className="mt-2 text-4xl font-bold text-[#2f241b]">{room.name}</h1>
          <p className="mt-5 leading-8 text-[#594536]">{room.description}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <p className="text-sm text-[#6d5a49]">Sức chứa</p>
              <p className="mt-1 text-2xl font-bold text-[#2f5d46]">{room.maxGuests} khách</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-[#6d5a49]">Giá từ</p>
              <p className="mt-1 text-2xl font-bold text-[#2f5d46]">
                {formatCurrencyVND(room.basePrice)}
              </p>
            </Card>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {amenities.map((item) => (
              <div key={item} className="flex gap-3 text-sm text-[#594536]">
                <CheckCircle2 className="shrink-0 text-[#2f5d46]" size={18} />
                {item}
              </div>
            ))}
          </div>
          <ButtonLink href="/booking" className="mt-8">
            Đặt phòng căn này
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

import type { Room } from "@/types";
import { siteConfig } from "./constants";

export const primaryRoom: Room = {
  id: "gon-home",
  name: "Gôn Home nguyên căn",
  slug: "gon-home-nguyen-can",
  description:
    "Homestay nhà gỗ riêng biệt, lối đi riêng, 2 phòng ngủ, bếp và nội thất đầy đủ, phù hợp nghỉ dưỡng hoặc làm việc từ xa.",
  maxGuests: 5,
  basePrice: siteConfig.dailyPricePerGuest,
  status: "AVAILABLE",
  coverImageUrl: "/images/homestay/gon-home-hero.jpg",
};

export const publicRooms = [primaryRoom];

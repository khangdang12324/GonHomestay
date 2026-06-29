import type { BookingStatus, RoomStatus } from "@/types";

export const siteConfig = {
  name: "Gôn Home Đà Lạt",
  shortName: "Gôn Home",
  phone: "033 867 4316",
  backupPhone: "098 221 1342",
  zalo: "https://zalo.me/0338674316",
  facebook: "https://www.facebook.com/profile.php?id=61591639224122",
  address: "Đường 17 Đan Kia, phường Langbiang, Đà Lạt",
  mapEmbedUrl:
    "https://www.google.com/maps?q=G%C3%B4n%20Home%20%C4%90%C6%B0%E1%BB%9Dng%2017%20%C4%90an%20Kia%20ph%C6%B0%E1%BB%9Dng%20Langbiang%20%C4%90%C3%A0%20L%E1%BA%A1t&output=embed",
  description:
    "Gôn Home Đà Lạt là homestay nhà gỗ riêng biệt tại đường 17 Đan Kia, phường Langbiang, có 2 phòng ngủ, tối đa 5 người, bếp đầy đủ, BBQ, wifi mạnh và chỗ đậu ô tô.",
  dailyPricePerGuest: 200000,
  monthlyPrice: 6000000,
  checkIn: "14:00",
  checkOut: "12:00",
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã nhận phòng",
  CHECKED_OUT: "Đã trả phòng",
  CANCELLED: "Đã hủy",
};

export const bookingStatusOrder: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
];

export const roomStatusLabels: Record<RoomStatus, string> = {
  AVAILABLE: "Sẵn sàng",
  BOOKED: "Đã đặt",
  MAINTENANCE: "Bảo trì",
  HIDDEN: "Ẩn",
};

export const features = [
  "Nhà gỗ riêng biệt",
  "Lối đi riêng",
  "2 phòng ngủ",
  "Tối đa 5 khách",
  "Có khu BBQ",
  "Wifi mạnh",
  "Có chỗ đậu ô tô",
];

export const amenities = [
  "Bếp và nội thất đầy đủ",
  "Toilet riêng",
  "Nước nóng",
  "Khu vực BBQ",
  "Free wifi mạnh",
  "Đường lớn dễ vào",
  "Không gian yên tĩnh",
  "Phù hợp nghỉ dưỡng hoặc làm việc từ xa",
  "Có trên Google Map: Gôn Home",
];

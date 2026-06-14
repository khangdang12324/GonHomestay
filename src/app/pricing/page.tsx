import type { Metadata } from "next";
import { PricingSection } from "@/components/site/PricingSection";

export const metadata: Metadata = {
  title: "Bảng giá",
  description: "Gôn Home Đà Lạt giá 200k/người/ngày hoặc 6 triệu/tháng.",
};

export default function PricingPage() {
  return <PricingSection />;
}

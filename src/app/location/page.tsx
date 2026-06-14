import type { Metadata } from "next";
import { MapSection } from "@/components/site/MapSection";

export const metadata: Metadata = {
  title: "Vị trí",
  description: "Vị trí Gôn Home Đà Lạt, đường lớn dễ đi và không gian yên tĩnh.",
};

export default function LocationPage() {
  return <MapSection />;
}

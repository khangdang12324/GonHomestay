import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/data/constants";

export function FloatingContactBar() {
  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-4">
      {/* Messenger Button */}
      <a
        href={siteConfig.facebook}
        target="_blank"
        rel="noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[#e0a02d] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform hover:scale-110"
        aria-label="Messenger"
      >
        <MessageCircle size={22} fill="currentColor" />
      </a>

      {/* Zalo Button */}
      <a
        href={siteConfig.zalo}
        target="_blank"
        rel="noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[#e0a02d] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform hover:scale-110"
        aria-label="Zalo"
      >
        <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white text-[#e0a02d]">
          <span className="text-[9px] font-black leading-none">Zalo</span>
        </div>
      </a>

      {/* Phone Button */}
      <a
        href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[#e0a02d] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform hover:scale-110"
        aria-label="Gọi ngay"
      >
        <Phone size={22} fill="currentColor" />
      </a>
    </div>
  );
}

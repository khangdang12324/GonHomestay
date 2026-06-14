import { MessageCircle, Phone, Send } from "lucide-react";
import { siteConfig } from "@/data/constants";

export function FloatingContactBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-[#d7c7ad] bg-white/95 text-xs font-semibold text-[#2f241b] shadow-[0_-8px_24px_rgba(47,36,27,0.12)] backdrop-blur md:hidden">
      <a href={`tel:${siteConfig.phone}`} className="flex flex-col items-center gap-1 px-2 py-2">
        <Phone size={18} className="text-[#2f5d46]" />
        Gọi ngay
      </a>
      <a href={siteConfig.zalo} className="flex flex-col items-center gap-1 px-2 py-2">
        <Send size={18} className="text-[#2f5d46]" />
        Zalo
      </a>
      <a href={siteConfig.facebook} className="flex flex-col items-center gap-1 px-2 py-2">
        <MessageCircle size={18} className="text-[#2f5d46]" />
        Facebook
      </a>
    </div>
  );
}

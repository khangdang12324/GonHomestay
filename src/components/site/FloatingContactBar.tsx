import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/data/constants";

export function FloatingContactBar() {
  return (
    <>
      {/* Mobile Bottom Bar (Hidden on md and up) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center border-t border-[#e5d8c5] bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden">
        <a
          href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-[#2f5d46] hover:bg-[#fffaf2]"
        >
          <Phone size={20} fill="currentColor" />
          <span className="text-[10px] font-semibold uppercase">Gọi điện</span>
        </a>
        <div className="h-8 w-px bg-[#e5d8c5]" />
        <a
          href={siteConfig.zalo}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 flex-col items-center justify-center gap-1 text-[#0068ff] hover:bg-[#fffaf2]"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0068ff] text-white">
            <span className="text-[9px] font-black leading-none">Zalo</span>
          </div>
          <span className="text-[10px] font-semibold uppercase">Zalo</span>
        </a>
        <div className="h-8 w-px bg-[#e5d8c5]" />
        <a
          href={siteConfig.facebook}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 flex-col items-center justify-center gap-1 text-[#0866ff] hover:bg-[#fffaf2]"
        >
          <MessageCircle size={20} fill="currentColor" />
          <span className="text-[10px] font-semibold uppercase">Nhắn tin</span>
        </a>
      </div>

      {/* Desktop Floating Bubbles (Hidden on mobile) */}
      <div className="fixed bottom-6 right-6 z-50 hidden flex-col gap-4 md:flex">
        <a
          href={siteConfig.facebook}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[#e0a02d] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform hover:scale-110"
          aria-label="Messenger"
        >
          <MessageCircle size={22} fill="currentColor" />
        </a>

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

        <a
          href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[#e0a02d] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform hover:scale-110"
          aria-label="Gọi ngay"
        >
          <Phone size={22} fill="currentColor" />
        </a>
      </div>
    </>
  );
}

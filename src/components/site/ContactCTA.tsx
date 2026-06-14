import { MessageCircle, Phone, Send } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/data/constants";

export function ContactCTA() {
  return (
    <section className="bg-[#2f5d46] py-14 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <h2 className="text-3xl font-bold">Sẵn sàng đặt lịch nghỉ tại Gôn Home?</h2>
          <p className="mt-3 max-w-2xl text-[#d8eadf]">
            Inbox đặt phòng hoặc liên hệ/Zalo ưu tiên {siteConfig.phone}. Nếu số này bận, gọi {siteConfig.backupPhone} hoặc inbox Facebook.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`tel:${siteConfig.phone}`} variant="outline">
            <Phone size={18} /> Gọi điện
          </ButtonLink>
          <ButtonLink href={siteConfig.zalo} variant="secondary">
            <Send size={18} /> Zalo
          </ButtonLink>
          <ButtonLink href={`tel:${siteConfig.backupPhone}`} variant="outline">
            <Phone size={18} /> Số dự phòng
          </ButtonLink>
          <ButtonLink href={siteConfig.facebook} variant="outline">
            <MessageCircle size={18} /> Facebook
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

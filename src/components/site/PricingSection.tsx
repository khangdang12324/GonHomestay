import { prices } from "@/data/pricing";
import { siteConfig } from "@/data/constants";
import { formatCurrencyVND } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

export function PricingSection() {
  return (
    <section className="bg-[#f8f1e7] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a5a36]">
              Bảng giá
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#2f241b]">
              {formatCurrencyVND(siteConfig.dailyPricePerGuest)}/người/ngày
            </h2>
          </div>
          <ButtonLink href="/booking">Gửi yêu cầu đặt phòng</ButtonLink>
        </div>
        <div className="mt-8 overflow-hidden rounded-lg border border-[#e5d8c5] bg-white">
          {prices.map((item) => (
            <div
              key={item.guestCount}
              className="grid grid-cols-2 border-b border-[#efe3d2] px-4 py-4 last:border-0 sm:px-6"
            >
              <span className="font-medium text-[#2f241b]">{item.guestCount} khách</span>
              <span className="text-right font-bold text-[#2f5d46]">
                {formatCurrencyVND(item.price)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg border border-[#e5d8c5] bg-white p-5">
          <p className="text-sm text-[#6d5a49]">Thuê theo tháng</p>
          <p className="mt-1 text-3xl font-bold text-[#2f5d46]">
            {formatCurrencyVND(siteConfig.monthlyPrice)}/tháng
          </p>
        </div>
        <p className="mt-4 text-sm text-[#6d5a49]">
          Giá thuê theo ngày tính theo số khách thực tế. Vui lòng liên hệ để xác nhận lịch trống và giá tại thời điểm đặt.
        </p>
      </div>
    </section>
  );
}

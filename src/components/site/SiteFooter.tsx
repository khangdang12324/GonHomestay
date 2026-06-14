import Link from "next/link";
import { siteConfig } from "@/data/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e6d8c4] bg-[#2f241b] text-[#f8f1e7]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-xl font-bold">{siteConfig.name}</p>
          <p className="mt-3 text-sm leading-6 text-[#d9cbb8]">
            Homestay nhà gỗ riêng biệt cho gia đình, nhóm bạn và khách ở dài ngày tại Đà Lạt.
          </p>
        </div>
        <div>
          <p className="font-semibold">Điều hướng</p>
          <div className="mt-3 grid gap-2 text-sm text-[#d9cbb8]">
            <Link href="/rooms">Phòng & tiện ích</Link>
            <Link href="/pricing">Bảng giá</Link>
            <Link href="/gallery">Hình ảnh</Link>
            <Link href="/booking">Đặt phòng</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Liên hệ</p>
          <p className="mt-3 text-sm text-[#d9cbb8]">
            Ưu tiên/Zalo: {siteConfig.phone}
          </p>
          <p className="text-sm text-[#d9cbb8]">Số dự phòng: {siteConfig.backupPhone}</p>
          <p className="text-sm text-[#d9cbb8]">{siteConfig.address}</p>
          <p className="mt-3 text-xs text-[#b9aa97]">
            Không nhận thú cưng. Không nhận cò đặt phòng.
          </p>
        </div>
      </div>
    </footer>
  );
}

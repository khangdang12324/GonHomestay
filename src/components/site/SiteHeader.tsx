import Link from "next/link";
import { Home, Menu } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/rooms", label: "Phòng" },
  { href: "/pricing", label: "Bảng giá" },
  { href: "/gallery", label: "Hình ảnh" },
  { href: "/location", label: "Vị trí" },
  { href: "/contact", label: "Liên hệ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e6d8c4] bg-[#fffaf2]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-[#2f5d46]">
          <span className="flex size-9 items-center justify-center rounded-lg bg-[#2f5d46] text-white">
            <Home size={18} />
          </span>
          Gôn Home
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[#594536] lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[#2f5d46]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:block">
          <ButtonLink href="/booking">Đặt phòng ngay</ButtonLink>
        </div>
        <details className="relative lg:hidden">
          <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-[#d7c7ad]">
            <Menu size={20} />
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-lg border border-[#e5d8c5] bg-white p-2 shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-[#594536] hover:bg-[#f8f1e7]"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/booking" className="mt-2 w-full">
              Đặt phòng ngay
            </ButtonLink>
          </div>
        </details>
      </div>
    </header>
  );
}

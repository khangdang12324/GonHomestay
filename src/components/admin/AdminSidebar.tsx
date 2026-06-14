import Link from "next/link";
import {
  BarChart3,
  BedDouble,
  CalendarDays,
  ImageIcon,
  LogOut,
  Settings,
  Tags,
  Users,
} from "lucide-react";

const items = [
  { href: "/admin", label: "Tổng quan", icon: BarChart3 },
  { href: "/admin/bookings", label: "Đặt phòng", icon: CalendarDays },
  { href: "/admin/customers", label: "Khách hàng", icon: Users },
  { href: "/admin/rooms", label: "Phòng/căn", icon: BedDouble },
  { href: "/admin/prices", label: "Bảng giá", icon: Tags },
  { href: "/admin/gallery", label: "Hình ảnh", icon: ImageIcon },
  { href: "/admin/settings", label: "Cài đặt", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="rounded-lg border border-[#e5d8c5] bg-white p-3 lg:min-h-[calc(100vh-9rem)]">
      <div className="mb-4 px-3 py-2">
        <p className="text-sm font-bold text-[#2f5d46]">Admin Dashboard</p>
        <p className="text-xs text-[#6d5a49]">Gôn Home Đà Lạt</p>
      </div>
      <nav className="grid gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#594536] hover:bg-[#f8f1e7] hover:text-[#2f5d46]"
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/admin/login"
          className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#594536] hover:bg-[#f8f1e7]"
        >
          <LogOut size={18} />
          Đăng xuất
        </Link>
      </nav>
    </aside>
  );
}

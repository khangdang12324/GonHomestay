"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateVN } from "@/lib/utils";
import type { Booking, Room } from "@/types";

const DAYS_OF_WEEK = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export function CalendarView({
  bookings,
  rooms,
  configured,
}: {
  bookings: Booking[];
  rooms: Room[];
  configured: boolean;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    return bookings.filter((b) => b.checkIn <= dateStr && b.checkOut >= dateStr);
  };

  // Generate calendar days
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  if (!configured) {
    return (
      <div className="rounded-lg border border-[#e5d8c5] bg-white p-6 text-center">
        <p className="text-[#6d5a49]">Supabase chưa được cấu hình</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between rounded-lg border border-[#e5d8c5] bg-white p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="rounded-lg p-2 hover:bg-[#f8f1e7]"
          >
            <ChevronLeft size={20} className="text-[#594536]" />
          </button>
          <h2 className="min-w-[200px] text-center text-lg font-semibold text-[#2f241b]">
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={handleNextMonth}
            className="rounded-lg p-2 hover:bg-[#f8f1e7]"
          >
            <ChevronRight size={20} className="text-[#594536]" />
          </button>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleToday}
          className="h-9"
        >
          Hôm nay
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-lg border border-[#e5d8c5] bg-white p-4">
        {/* Day headers */}
        <div className="mb-4 grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-[#594536]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday =
              new Date().toDateString() ===
              new Date(year, month, day).toDateString();
            const dayBookings = getBookingsForDate(day);

            return (
              <div
                key={`day-${day}`}
                className={`aspect-square rounded-lg border-2 p-2 text-sm ${
                  isToday
                    ? "border-[#2f5d46] bg-[#f0faf8]"
                    : "border-[#e5d8c5] bg-white"
                } hover:bg-[#f8f1e7]`}
              >
                <div className="font-semibold text-[#2f241b]">{day}</div>
                <div className="mt-1 space-y-1">
                  {dayBookings.slice(0, 2).map((booking) => (
                    <div
                      key={booking.id}
                      className={`truncate rounded px-1 py-0.5 text-xs font-medium text-white ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-500"
                          : booking.status === "PENDING"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                      }`}
                      title={booking.customerName}
                    >
                      {booking.customerName}
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-xs text-[#6d5a49]">
                      +{dayBookings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-lg border border-[#e5d8c5] bg-white p-4">
        <h3 className="mb-3 font-semibold text-[#2f241b]">Chú thích</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-green-500" />
            <span className="text-sm text-[#594536]">Đã xác nhận</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-yellow-500" />
            <span className="text-sm text-[#594536]">Chờ xác nhận</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-gray-500" />
            <span className="text-sm text-[#594536]">Khác</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border-2 border-[#2f5d46]" />
            <span className="text-sm text-[#594536]">Hôm nay</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-lg border border-[#e5d8c5] bg-[#fffaf2] p-4">
        <p className="text-sm text-[#594536]">
          <strong>Tip:</strong> Click vào booking để xem chi tiết hoặc chỉnh sửa. Tìm trong trang "Đặt phòng" để quản lý từng booking cụ thể.
        </p>
      </div>
    </div>
  );
}

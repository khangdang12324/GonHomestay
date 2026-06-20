"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface DateRangeCalendarProps {
  value: { checkIn: string; checkOut: string } | null;
  onChange: (value: { checkIn: string; checkOut: string }) => void;
  roomId?: string;
  disabled?: boolean;
}

const DAYS_OF_WEEK = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
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

export function DateRangeCalendar({
  value,
  onChange,
  roomId,
  disabled,
}: DateRangeCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [tempCheckIn, setTempCheckIn] = useState<string | null>(null);

  // Fetch blocked dates
  useEffect(() => {
    if (!roomId) return;

    const fetchBlockedDates = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/bookings/blocked-dates?roomId=${roomId}`
        );
        const data = await res.json();
        setBlockedDates(new Set(data.blockedDates || []));
      } catch (error) {
        console.error("Error fetching blocked dates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedDates();
  }, [roomId]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("vi-VN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handleDateClick = (day: number, month: Date) => {
    const year = month.getFullYear();
    const monthNum = month.getMonth();
    const dateStr = `${year}-${String(monthNum + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // Check if date is blocked
    if (blockedDates.has(dateStr)) {
      return;
    }

    // First click: set check-in
    if (tempCheckIn === null) {
      setTempCheckIn(dateStr);
    } else {
      // Second click: set check-out
      const checkIn = new Date(tempCheckIn + "T00:00:00");
      const checkOut = new Date(dateStr + "T00:00:00");

      if (checkOut <= checkIn) {
        // Reset if check-out is before check-in
        setTempCheckIn(dateStr);
      } else {
        // Valid range
        onChange({
          checkIn: tempCheckIn,
          checkOut: dateStr,
        });
        setTempCheckIn(null);
        setIsOpen(false);
      }
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleReset = () => {
    setTempCheckIn(null);
    onChange({ checkIn: "", checkOut: "" });
    setIsOpen(false);
  };

  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);

  const isDateBetween = (day: number, month: Date): boolean => {
    if (!tempCheckIn || !value?.checkIn) return false;

    const year = month.getFullYear();
    const monthNum = month.getMonth();
    const dateStr = `${year}-${String(monthNum + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const start = new Date(value.checkIn + "T00:00:00");
    const end = new Date(value.checkOut + "T00:00:00");
    const current = new Date(dateStr + "T00:00:00");

    return current >= start && current < end;
  };

  const isDateCheckIn = (day: number, month: Date): boolean => {
    if (!value?.checkIn) return false;

    const year = month.getFullYear();
    const monthNum = month.getMonth();
    const dateStr = `${year}-${String(monthNum + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return dateStr === value.checkIn;
  };

  const isDateCheckOut = (day: number, month: Date): boolean => {
    if (!value?.checkOut) return false;

    const year = month.getFullYear();
    const monthNum = month.getMonth();
    const dateStr = `${year}-${String(monthNum + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return dateStr === value.checkOut;
  };

  const renderMonth = (month: Date, title: string) => {
    const days = generateCalendarDays(month);
    const year = month.getFullYear();
    const monthNum = month.getMonth();

    return (
      <div className="flex-1 min-w-0 sm:min-w-[320px]">
        <h3 className="mb-4 text-center font-semibold text-[#2f241b]">
          {title}
        </h3>

        <div className="mb-4 grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-[#594536] py-1 sm:py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateStr = `${year}-${String(monthNum + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isBlocked = blockedDates.has(dateStr);
            const isBetween = isDateBetween(day, month);
            const isCheckIn = isDateCheckIn(day, month);
            const isCheckOut = isDateCheckOut(day, month);
            const isToday =
              new Date().toDateString() ===
              new Date(year, monthNum, day).toDateString();

            return (
              <button
                key={`day-${day}`}
                onClick={() => handleDateClick(day, month)}
                disabled={isBlocked || disabled}
                className={`aspect-square text-xs sm:text-sm font-semibold rounded transition-all ${
                  isBlocked
                    ? "bg-red-100 text-red-800 cursor-not-allowed border border-red-300"
                    : isBetween
                      ? "bg-[#d4e8e2] text-[#2f5d46]"
                      : isCheckIn || isCheckOut
                        ? "bg-[#2f5d46] text-white border-2 border-[#2f5d46]"
                        : isToday
                          ? "border-2 border-[#2f5d46] text-[#2f5d46] bg-white"
                          : "bg-white text-[#2f241b] hover:bg-[#f8f1e7] border border-[#e5d8c5]"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Display selected dates */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-[#594536] mb-2">
            Ngày nhận phòng
          </label>
          <input
            type="text"
            readOnly
            value={value?.checkIn ? formatDate(value.checkIn) : ""}
            placeholder="Chọn ngày"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-3 py-2 border border-[#d4b5a0] rounded-lg bg-white text-[#2f241b] cursor-pointer hover:border-[#594536]"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-[#594536] mb-2">
            Ngày trả phòng
          </label>
          <input
            type="text"
            readOnly
            value={value?.checkOut ? formatDate(value.checkOut) : ""}
            placeholder="Chọn ngày"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-3 py-2 border border-[#d4b5a0] rounded-lg bg-white text-[#2f241b] cursor-pointer hover:border-[#594536]"
          />
        </div>
        {value?.checkIn && (
          <button
            type="button"
            onClick={handleReset}
            className="self-end px-3 py-2 text-[#594536] hover:bg-[#f8f1e7] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Calendar picker */}
      {isOpen && (
        <div className="border border-[#e5d8c5] rounded-lg bg-white p-3 sm:p-4 space-y-4">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-[#f8f1e7] rounded transition-colors"
            >
              <ChevronLeft size={20} className="text-[#594536]" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date())}
              className="text-sm px-3 py-1 text-[#594536] hover:bg-[#f8f1e7] rounded transition-colors"
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-[#f8f1e7] rounded transition-colors"
            >
              <ChevronRight size={20} className="text-[#594536]" />
            </button>
          </div>

          {/* Status */}
          {loading && (
            <div className="text-center text-sm text-[#6d5a49]">
              Đang tải ngày bị khóa...
            </div>
          )}

          {tempCheckIn && (
            <div className="text-center text-sm bg-blue-50 text-blue-700 py-2 rounded border border-blue-200">
              Đã chọn ngày nhận: {formatDate(tempCheckIn)}. Chọn ngày trả phòng.
            </div>
          )}

          {/* Calendars */}
          <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto">
            {renderMonth(
              currentMonth,
              `${MONTHS[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`
            )}
            {renderMonth(
              nextMonth,
              `${MONTHS[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs border-t border-[#e5d8c5] pt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#2f5d46]" />
              <span className="text-[#594536]">Chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#d4e8e2]" />
              <span className="text-[#594536]">Khoảng chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
              <span className="text-[#594536]">Đã đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-[#2f5d46]" />
              <span className="text-[#594536]">Hôm nay</span>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full sm:hidden py-2 px-3 bg-[#2f5d46] text-white rounded-lg font-medium hover:bg-[#245941] transition-colors"
          >
            Đóng lịch
          </button>
        </div>
      )}
    </div>
  );
}

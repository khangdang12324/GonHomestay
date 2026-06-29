"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateVN } from "@/lib/utils";
import { blockRoom, unblockRoom, unblockRoomByDateRange } from "@/server/bookings";
import { toast } from "sonner";
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
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Block Dialog State
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [blockCheckIn, setBlockCheckIn] = useState("");
  const [blockCheckOut, setBlockCheckOut] = useState("");
  const [blockNote, setBlockNote] = useState("");
  const [isPending, startTransition] = useTransition();

  // Drag State
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [dragEnd, setDragEnd] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1));
  const handleToday = () => setCurrentDate(new Date());

  const getBookingsForDate = (date: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    return bookings.filter((b) => b.checkIn <= dateStr && b.checkOut >= dateStr);
  };

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  async function handleBlockRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!blockCheckIn || !blockCheckOut) return toast.error("Vui lòng chọn ngày");
    if (blockCheckOut < blockCheckIn) return toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu");

    // Add 1 day to checkout for standard homestay logic if they selected the same day
    const finalCheckOut = blockCheckOut === blockCheckIn 
      ? new Date(new Date(blockCheckOut).getTime() + 86400000).toISOString().split('T')[0] 
      : blockCheckOut;

    startTransition(async () => {
      const res = await blockRoom(blockCheckIn, finalCheckOut, blockNote);
      if (res.ok) {
        toast.success(res.message);
        setIsBlockDialogOpen(false);
        setBlockCheckIn("");
        setBlockCheckOut("");
        setBlockNote("");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  async function handleUnblockRoom(id: string) {
    if (!confirm("Bạn có chắc chắn muốn mở khóa phòng này không?")) return;
    startTransition(async () => {
      const res = await unblockRoom(id);
      if (res.ok) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  async function handleUnblockByRange() {
    if (!blockCheckIn || !blockCheckOut) return toast.error("Vui lòng chọn ngày");
    if (blockCheckOut < blockCheckIn) return toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu");

    const finalCheckOut = blockCheckOut === blockCheckIn 
      ? new Date(new Date(blockCheckOut).getTime() + 86400000).toISOString().split('T')[0] 
      : blockCheckOut;

    startTransition(async () => {
      const res = await unblockRoomByDateRange(blockCheckIn, finalCheckOut);
      if (res.ok) {
        toast.success(res.message);
        setIsBlockDialogOpen(false);
        setBlockCheckIn("");
        setBlockCheckOut("");
        setBlockNote("");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  if (!configured) {
    return (
      <div className="rounded-lg border border-[#e5d8c5] bg-white p-6 text-center">
        <p className="text-[#6d5a49]">Supabase chưa được cấu hình</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative select-none">
      {/* Block Dialog */}
      {isBlockDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-[#2f241b] flex items-center gap-2">
              <Lock size={20} /> Khóa / Mở phòng
            </h3>
            <form onSubmit={handleBlockRoom} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#594536]">Từ ngày</label>
                  <Input type="date" value={blockCheckIn} onChange={(e) => setBlockCheckIn(e.target.value)} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#594536]">Đến ngày</label>
                  <Input type="date" value={blockCheckOut} onChange={(e) => setBlockCheckOut(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#594536]">Lý do (Tùy chọn)</label>
                <Input type="text" placeholder="Sửa chữa, dọn dẹp..." value={blockNote} onChange={(e) => setBlockNote(e.target.value)} />
              </div>
              <div className="flex justify-between pt-4">
                <Button type="button" variant="destructive" onClick={handleUnblockByRange} disabled={isPending}>
                  {isPending ? "..." : "Mở khóa"}
                </Button>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsBlockDialogOpen(false)}>Hủy</Button>
                  <Button type="submit" className="bg-[#2f5d46] hover:bg-[#204432]" disabled={isPending}>{isPending ? "Đang xử lý..." : "Xác nhận khóa"}</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg border border-[#e5d8c5] bg-white p-4">
        <div className="flex items-center gap-4">
          <button onClick={handlePrevMonth} className="rounded-lg p-2 hover:bg-[#f8f1e7]">
            <ChevronLeft size={20} className="text-[#594536]" />
          </button>
          <h2 className="min-w-[150px] text-center text-lg font-semibold text-[#2f241b]">
            {MONTHS[month]} {year}
          </h2>
          <button onClick={handleNextMonth} className="rounded-lg p-2 hover:bg-[#f8f1e7]">
            <ChevronRight size={20} className="text-[#594536]" />
          </button>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleToday} className="h-9">
            Hôm nay
          </Button>
          <Button type="button" onClick={() => {
            const today = new Date().toISOString().split('T')[0];
            setBlockCheckIn(today);
            setBlockCheckOut(today);
            setIsBlockDialogOpen(true);
          }} className="h-9 gap-1 bg-[#6d5a49] hover:bg-[#594536]">
            <Lock size={16} /> Đóng phòng
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-lg border border-[#e5d8c5] bg-white p-4">
        <div className="mb-4 grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-[#594536]">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2" onMouseLeave={() => setIsDragging(false)}>
          {calendarDays.map((day, index) => {
            if (day === null) return <div key={`empty-${index}`} className="aspect-square" />;

            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            const dayBookings = getBookingsForDate(day);
            
            const isDraggingOver = isDragging && dragStart && dragEnd && 
              ((dateStr >= dragStart && dateStr <= dragEnd) || (dateStr <= dragStart && dateStr >= dragEnd));

            return (
              <div
                key={`day-${day}`}
                onMouseDown={() => {
                  setDragStart(dateStr);
                  setDragEnd(dateStr);
                  setIsDragging(true);
                }}
                onMouseEnter={() => {
                  if (isDragging) setDragEnd(dateStr);
                }}
                onMouseUp={() => {
                  if (isDragging && dragStart && dragEnd) {
                    setIsDragging(false);
                    const start = dragStart < dragEnd ? dragStart : dragEnd;
                    const end = dragStart < dragEnd ? dragEnd : dragStart;
                    setBlockCheckIn(start);
                    setBlockCheckOut(end);
                    setIsBlockDialogOpen(true);
                  }
                }}
                className={`flex min-h-[120px] flex-col rounded-lg border-2 p-2 text-sm cursor-crosshair transition-colors ${
                  isDraggingOver ? "bg-[#d7c7ad]/30 border-[#8a5a36]" :
                  isToday ? "border-[#2f5d46] bg-[#f0faf8]" : "border-[#e5d8c5] bg-white"
                } hover:bg-[#f8f1e7]`}
              >
                <div className="mb-1 font-semibold text-[#2f241b] pointer-events-none">{day}</div>
                <div className="flex-1 space-y-1 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-[#d7c7ad]">
                  {dayBookings.map((booking) => {
                    const isBlocked = booking.status === "BLOCKED";
                    return (
                      <div
                        key={booking.id}
                        onMouseDown={(e) => e.stopPropagation()} 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isBlocked) {
                            handleUnblockRoom(booking.id);
                          } else {
                            router.push(`/admin/bookings/${booking.id}`);
                          }
                        }}
                        className={`truncate rounded px-1 py-0.5 text-xs font-medium text-white cursor-pointer hover:opacity-80 ${
                          isBlocked ? "bg-[#594536] hover:bg-red-600 flex items-center justify-between" :
                          booking.status === "CONFIRMED" ? "bg-green-500" :
                          booking.status === "PENDING" ? "bg-yellow-500" : "bg-gray-500"
                        }`}
                        title={isBlocked ? "Click để mở khóa" : `${booking.customerName} (${booking.guests} khách)`}
                      >
                        {isBlocked ? (
                          <>
                            <span className="truncate flex-1">[ĐÓNG] {booking.note}</span> 
                            <Unlock size={12} className="ml-1 flex-shrink-0" />
                          </>
                        ) : (
                          booking.customerName
                        )}
                      </div>
                    );
                  })}
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
          <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-green-500" /><span className="text-sm text-[#594536]">Đã xác nhận</span></div>
          <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-yellow-500" /><span className="text-sm text-[#594536]">Chờ xác nhận</span></div>
          <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-[#594536]" /><span className="text-sm text-[#594536]">Khóa phòng</span></div>
          <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-gray-500" /><span className="text-sm text-[#594536]">Khác</span></div>
          <div className="flex items-center gap-2"><div className="h-4 w-4 rounded border-2 border-[#2f5d46]" /><span className="text-sm text-[#594536]">Hôm nay</span></div>
        </div>
      </div>
      
      {/* Info */}
      <div className="rounded-lg border border-[#e5d8c5] bg-[#fffaf2] p-4">
        <p className="text-sm text-[#594536]">
          <strong>Tip 1:</strong> Click vào booking để xem chi tiết hoặc chỉnh sửa.<br/>
          <strong>Tip 2:</strong> Nhấn giữ chuột và <strong>kéo (drag) qua nhiều ngày</strong> để Khóa phòng nhanh chóng.
        </p>
      </div>
    </div>
  );
}

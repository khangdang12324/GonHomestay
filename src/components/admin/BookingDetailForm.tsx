"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { updateBooking, deleteBooking } from "@/server/booking-actions";
import { bookingStatusLabels, bookingStatusOrder } from "@/data/constants";
import { formatCurrencyVND, formatDateVN } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";

export function BookingDetailForm({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  const [formData, setFormData] = useState({
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    customerEmail: booking.customerEmail || "",
    note: booking.note || "",
    status: booking.status as BookingStatus,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateBooking(booking.id, formData);
      if (result.success) {
        toast.success("Cập nhật booking thành công!");
        router.refresh();
      } else {
        toast.error(result.error || "Có lỗi xảy ra");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Bạn chắc chắn muốn xóa booking này?")) return;

    startDeleting(async () => {
      const result = await deleteBooking(booking.id);
      if (result.success) {
        toast.success("Xóa booking thành công!");
        router.push("/admin/bookings");
      } else {
        toast.error(result.error || "Có lỗi xảy ra");
      }
    });
  }

  const nextStatuses = getNextStatuses(booking.status);

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <div className="rounded-lg border border-[#e5d8c5] bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-[#6d5a49]">Check-in</p>
            <p className="text-lg font-semibold text-[#2f241b]">{formatDateVN(booking.checkIn)}</p>
          </div>
          <div>
            <p className="text-sm text-[#6d5a49]">Check-out</p>
            <p className="text-lg font-semibold text-[#2f241b]">{formatDateVN(booking.checkOut)}</p>
          </div>
          <div>
            <p className="text-sm text-[#6d5a49]">Khách</p>
            <p className="text-lg font-semibold text-[#2f241b]">{booking.guests} khách</p>
          </div>
          <div>
            <p className="text-sm text-[#6d5a49]">Tổng tiền</p>
            <p className="text-lg font-semibold text-[#2f241b]">{formatCurrencyVND(booking.totalPrice)}</p>
          </div>
          <div>
            <p className="text-sm text-[#6d5a49]">Trạng thái</p>
            <div className="mt-1">
              <BookingStatusBadge status={booking.status} />
            </div>
          </div>
          <div>
            <p className="text-sm text-[#6d5a49]">Nguồn</p>
            <p className="text-lg font-semibold text-[#2f241b]">{booking.source || "-"}</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-[#e5d8c5] bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[#3a2a1d]">
            Tên khách hàng
            <Input
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#3a2a1d]">
            Số điện thoại
            <Input
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#3a2a1d]">
            Email
            <Input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#3a2a1d]">
            Trạng thái
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as BookingStatus })}
              className="rounded border border-[#e5d8c5] bg-white px-3 py-2 text-sm"
            >
              {bookingStatusOrder.map((status) => (
                <option key={status} value={status}>
                  {bookingStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-[#3a2a1d]">
          Ghi chú
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            rows={3}
            className="rounded border border-[#e5d8c5] bg-white px-3 py-2 text-sm"
            placeholder="Ghi chú thêm về booking..."
          />
        </label>

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={isDeleting}
            onClick={handleDelete}
            className="flex-1"
          >
            {isDeleting ? "Đang xóa..." : "Xóa booking"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function getNextStatuses(currentStatus: BookingStatus): BookingStatus[] {
  const transitions: Record<BookingStatus, BookingStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["CHECKED_IN", "CANCELLED"],
    CHECKED_IN: ["CHECKED_OUT", "CANCELLED"],
    CHECKED_OUT: [],
    CANCELLED: [],
  };

  return transitions[currentStatus] || [];
}

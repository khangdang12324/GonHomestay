"use server";

import { formatCurrencyVND, formatDateVN } from "@/lib/utils";

type BookingEmailInput = {
  bookingId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  note: string | null;
  source: string;
};

export async function sendBookingNotification(input: BookingEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to =
    process.env.BOOKING_NOTIFICATION_EMAIL ||
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    "dangkhang.120304@gmail.com";
  const from = process.env.BOOKING_EMAIL_FROM;

  if (!apiKey || !from) {
    return {
      ok: false,
      skipped: true,
      message: "Chưa cấu hình RESEND_API_KEY hoặc BOOKING_EMAIL_FROM.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Booking mới Gôn Home: ${input.customerName}`,
      html: buildBookingEmailHtml(input),
      reply_to: input.customerEmail || undefined,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return {
      ok: false,
      skipped: false,
      message: detail || "Resend không gửi được email.",
    };
  }

  return {
    ok: true,
    skipped: false,
    message: "Đã gửi email thông báo booking.",
  };
}

function buildBookingEmailHtml(input: BookingEmailInput) {
  const rows = [
    ["Mã booking", input.bookingId || "Chưa đọc được mã"],
    ["Khách hàng", input.customerName],
    ["Số điện thoại", input.customerPhone],
    ["Email khách", input.customerEmail || "Không có"],
    ["Check-in", formatDateVN(input.checkIn)],
    ["Check-out", formatDateVN(input.checkOut)],
    ["Số khách", String(input.guests)],
    ["Tổng tiền", formatCurrencyVND(input.totalPrice)],
    ["Trạng thái", input.status],
    ["Nguồn", input.source],
    ["Ghi chú", input.note || "Không có"],
  ];

  return `
    <div style="font-family: Arial, sans-serif; color: #2f241b; line-height: 1.5">
      <h1 style="margin: 0 0 16px">Có booking mới tại Gôn Home</h1>
      <table style="border-collapse: collapse; width: 100%; max-width: 640px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="border: 1px solid #e5d8c5; padding: 10px; font-weight: 700; width: 180px">${escapeHtml(label)}</td>
                <td style="border: 1px solid #e5d8c5; padding: 10px">${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

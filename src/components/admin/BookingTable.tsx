"use client";

/* eslint-disable react-hooks/incompatible-library */

import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { bookingStatusLabels } from "@/data/constants";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { formatCurrencyVND, formatDateVN } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";

const columnHelper = createColumnHelper<Booking>();

export function BookingTable({ bookings }: { bookings: Booking[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [status, setStatus] = useState<BookingStatus | "ALL">("ALL");
  const data = useMemo(
    () => (status === "ALL" ? bookings : bookings.filter((item) => item.status === status)),
    [bookings, status],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("customerName", {
        header: "Khách hàng",
        cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
      }),
      columnHelper.accessor("customerPhone", { header: "Số điện thoại" }),
      columnHelper.accessor("checkIn", {
        header: "Check-in",
        cell: (info) => formatDateVN(info.getValue()),
      }),
      columnHelper.accessor("checkOut", {
        header: "Check-out",
        cell: (info) => formatDateVN(info.getValue()),
      }),
      columnHelper.accessor("guests", { header: "Khách" }),
      columnHelper.accessor("totalPrice", {
        header: "Tổng tiền",
        cell: (info) => formatCurrencyVND(info.getValue()),
      }),
      columnHelper.accessor("status", {
        header: "Trạng thái",
        cell: (info) => <BookingStatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor("note", {
        header: "Ghi chú",
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("createdAt", {
        header: "Ngày tạo",
        cell: (info) => formatDateVN(info.getValue()),
      }),
      columnHelper.display({
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="h-9 px-3">
              Chi tiết
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-9 px-3"
              onClick={() => updateBookingStatus(row.original.id, "CONFIRMED")}
            >
              Xác nhận
            </Button>
            <Button
              type="button"
              variant="danger"
              className="h-9 px-3"
              onClick={() => updateBookingStatus(row.original.id, "CANCELLED", true)}
            >
              Hủy
            </Button>
          </div>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="rounded-lg border border-[#e5d8c5] bg-white">
      <div className="grid gap-3 border-b border-[#e5d8c5] p-4 md:grid-cols-[1fr_220px]">
        <Input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder="Tìm theo tên, số điện thoại..."
        />
        <Select value={status} onChange={(event) => setStatus(event.target.value as BookingStatus | "ALL")}>
          <option value="ALL">Tất cả trạng thái</option>
          {Object.entries(bookingStatusLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-[#fffaf2] text-[#594536]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[#efe3d2]">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-[#3a2a1d]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-[#6d5a49]">
                  Chưa có booking phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  requireConfirm = false,
) {
  if (requireConfirm && !window.confirm("Hủy booking này?")) return;

  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    window.alert("Chưa cấu hình Supabase nên không thể cập nhật booking thật.");
    return;
  }

  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);

  if (error) {
    window.alert(error.message);
    return;
  }

  window.location.reload();
}

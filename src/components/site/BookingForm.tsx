"use client";

import { useEffect, useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { createBooking } from "@/server/bookings";
import { bookingSchema, type BookingFormValues } from "@/lib/validations/booking";

const defaultValues: BookingFormValues = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  checkIn: "",
  checkOut: "",
  guests: 2,
  note: "",
  source: "Facebook",
};

export function BookingForm() {
  const [isPending, startTransition] = useTransition();
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  // Check availability when dates change
  useEffect(() => {
    if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      setAvailabilityMessage(null);
      return;
    }

    setIsCheckingAvailability(true);
    fetch(`/api/bookings/available-dates?checkIn=${checkIn}&checkOut=${checkOut}`)
      .then((res) => res.json())
      .then((data) => {
        setAvailabilityMessage({
          type: data.available ? "success" : "error",
          text: data.message,
        });
      })
      .catch(() => {
        setAvailabilityMessage(null);
      })
      .finally(() => {
        setIsCheckingAvailability(false);
      });
  }, [checkIn, checkOut]);

  function onSubmit(values: BookingFormValues) {
    startTransition(async () => {
      const result = await createBooking(values);
      if (result.ok) {
        toast.success(result.message);
        reset(defaultValues);
        setAvailabilityMessage(null);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <Field label="Họ tên" error={errors.customerName?.message}>
        <Input {...register("customerName")} placeholder="Nguyễn Văn A" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Số điện thoại" error={errors.customerPhone?.message}>
          <Input {...register("customerPhone")} placeholder="09..." />
        </Field>
        <Field label="Email (nếu có)" error={errors.customerEmail?.message}>
          <Input {...register("customerEmail")} type="email" placeholder="email@example.com" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ngày nhận phòng" error={errors.checkIn?.message}>
          <Input {...register("checkIn")} type="date" />
        </Field>
        <Field label="Ngày trả phòng" error={errors.checkOut?.message}>
          <Input {...register("checkOut")} type="date" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Số khách" error={errors.guests?.message}>
          <Input {...register("guests", { valueAsNumber: true })} min={1} max={5} type="number" />
        </Field>
        <Field label="Nguồn khách biết đến" error={errors.source?.message}>
          <Select {...register("source")}>
            <option>Facebook</option>
            <option>Google</option>
            <option>Bạn bè</option>
            <option>Khác</option>
          </Select>
        </Field>
      </div>
      <Field label="Ghi chú" error={errors.note?.message}>
        <Textarea {...register("note")} placeholder="Thời gian đến, nhu cầu BBQ, lưu ý khác..." />
      </Field>

      {/* Availability Status */}
      {(isCheckingAvailability || availabilityMessage) && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            availabilityMessage?.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isCheckingAvailability ? "Đang kiểm tra tính khả dụng..." : availabilityMessage?.text}
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending || (availabilityMessage?.type === "error") || isCheckingAvailability}
        className="w-full sm:w-auto"
      >
        {isPending ? "Đang gửi..." : "Gửi yêu cầu đặt phòng"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#3a2a1d]">
      {label}
      {children}
      {error ? <span className="text-xs font-medium text-[#b42318]">{error}</span> : null}
    </label>
  );
}

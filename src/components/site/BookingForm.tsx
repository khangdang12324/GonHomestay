"use client";

import { useEffect, useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { DateRangeCalendar } from "@/components/site/DateRangeCalendar";
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
    setValue,
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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:gap-6">
      <Field label="Họ tên" error={errors.customerName?.message}>
        <Input {...register("customerName")} placeholder="Nguyễn Văn A" />
      </Field>
      
      <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
        <Field label="Số điện thoại" error={errors.customerPhone?.message}>
          <Input {...register("customerPhone")} placeholder="09..." />
        </Field>
        <Field label="Email (nếu có)" error={errors.customerEmail?.message}>
          <Input {...register("customerEmail")} type="email" placeholder="email@example.com" />
        </Field>
      </div>

      {/* Date Range Calendar */}
      <div className="border-t border-[#e5d8c5] pt-5 sm:pt-6">
        <DateRangeCalendar
          value={{ checkIn, checkOut }}
          onChange={(dates) => {
            setValue("checkIn", dates.checkIn);
            setValue("checkOut", dates.checkOut);
          }}
          roomId="default"
        />
        {errors.checkIn && (
          <p className="mt-2 text-xs font-medium text-[#b42318]">{errors.checkIn.message}</p>
        )}
        {errors.checkOut && (
          <p className="mt-2 text-xs font-medium text-[#b42318]">{errors.checkOut.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
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
        <Textarea {...register("note")} placeholder="Thời gian đến, nhu cầu BBQ, lưu ý khác..." rows={4} />
      </Field>

      {/* Availability Status */}
      {(isCheckingAvailability || availabilityMessage) && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium border ${
            availabilityMessage?.type === "success"
              ? "bg-green-50 text-green-800 border-green-300"
              : "bg-red-50 text-red-800 border-red-300"
          }`}
        >
          {isCheckingAvailability ? "Đang kiểm tra tính khả dụng..." : availabilityMessage?.text}
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending || (availabilityMessage?.type === "error") || isCheckingAvailability}
        className="w-full h-12 text-base font-semibold"
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

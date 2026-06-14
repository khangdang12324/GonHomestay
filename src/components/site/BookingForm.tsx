"use client";

import { useTransition } from "react";
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  function onSubmit(values: BookingFormValues) {
    startTransition(async () => {
      const result = await createBooking(values);
      if (result.ok) {
        toast.success(result.message);
        reset(defaultValues);
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
      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
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

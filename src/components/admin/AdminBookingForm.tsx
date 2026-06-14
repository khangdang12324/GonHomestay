"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { createAdminBooking } from "@/server/bookings";
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

export function AdminBookingForm() {
  const router = useRouter();
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
      const result = await createAdminBooking(values);

      if (result.ok) {
        toast.success(result.message);
        reset(defaultValues);
        router.refresh();
        return;
      }

      toast.error(result.message);
    });
  }

  return (
    <div className="mb-6 rounded-lg border border-[#e5d8c5] bg-white p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#2f241b]">Tạo booking thật</h2>
        <p className="mt-1 text-sm text-[#6d5a49]">
          Dùng cho khách đặt qua Zalo, Facebook hoặc gọi điện. Booking sẽ lưu trực tiếp vào Supabase.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 lg:grid-cols-4">
        <Field label="Họ tên" error={errors.customerName?.message}>
          <Input {...register("customerName")} placeholder="Tên khách" />
        </Field>
        <Field label="Số điện thoại" error={errors.customerPhone?.message}>
          <Input {...register("customerPhone")} placeholder="09..." />
        </Field>
        <Field label="Email" error={errors.customerEmail?.message}>
          <Input {...register("customerEmail")} type="email" placeholder="Không bắt buộc" />
        </Field>
        <Field label="Số khách" error={errors.guests?.message}>
          <Input {...register("guests", { valueAsNumber: true })} min={1} max={5} type="number" />
        </Field>
        <Field label="Check-in" error={errors.checkIn?.message}>
          <Input {...register("checkIn")} type="date" />
        </Field>
        <Field label="Check-out" error={errors.checkOut?.message}>
          <Input {...register("checkOut")} type="date" />
        </Field>
        <Field label="Nguồn" error={errors.source?.message}>
          <Select {...register("source")}>
            <option>Facebook</option>
            <option>Google</option>
            <option>Bạn bè</option>
            <option>Khác</option>
          </Select>
        </Field>
        <div className="flex items-end">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Đang lưu..." : "Lưu booking thật"}
          </Button>
        </div>
        <div className="lg:col-span-4">
          <Field label="Ghi chú" error={errors.note?.message}>
            <Textarea {...register("note")} placeholder="Cọc, giờ đến, yêu cầu BBQ..." />
          </Field>
        </div>
      </form>
    </div>
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

import { z } from "zod";

export const bookingSchema = z
  .object({
    customerName: z.string().min(2, "Vui lòng nhập họ tên."),
    customerPhone: z.string().min(8, "Vui lòng nhập số điện thoại hợp lệ."),
    customerEmail: z
      .string()
      .email("Email chưa hợp lệ.")
      .optional()
      .or(z.literal("")),
    checkIn: z.string().min(1, "Vui lòng chọn ngày nhận phòng."),
    checkOut: z.string().min(1, "Vui lòng chọn ngày trả phòng."),
    guests: z
      .number()
      .int("Số khách phải là số nguyên.")
      .min(1, "Tối thiểu 1 khách.")
      .max(5, "Gôn Home nhận tối đa 5 khách."),
    note: z.string().optional(),
    source: z.enum(["Facebook", "Google", "Bạn bè", "Khác"]),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "Ngày trả phòng phải sau ngày nhận phòng.",
    path: ["checkOut"],
  });

export type BookingFormValues = z.infer<typeof bookingSchema>;

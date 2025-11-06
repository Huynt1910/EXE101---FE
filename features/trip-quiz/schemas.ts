import { z } from "zod";

export const BudgetEnum = z.enum(["LOW", "MID", "HIGH"]);
export const TripTypeEnum = z.enum(["short", "long"]);

export const baseStep1 = z.object({
  budget: BudgetEnum,
  tripType: TripTypeEnum,
});

export const shortTrip = z.object({
  startDate: z.string().min(1, "Chọn thời điểm bắt đầu"),
  duration: z.string().min(1, "Chọn số giờ"),
});

export const longTrip = z
  .object({
    startDateLong: z.string().min(1, "Chọn ngày bắt đầu"),
    endDateLong: z.string().min(1, "Chọn ngày kết thúc"),
  })
  .refine(
    (v) =>
      v.startDateLong &&
      v.endDateLong &&
      new Date(v.endDateLong) >= new Date(v.startDateLong),
    { message: "Ngày kết thúc phải ≥ ngày bắt đầu", path: ["endDateLong"] }
  );

export const step2Schema = z
  .object({
    groupSize: z.number().min(1).max(20),
    travelStyle: z.array(z.string()),
    interests: z.array(z.string()),
  })
  .refine((d) => d.travelStyle.length > 0 || d.interests.length > 0, {
    message: "Chọn ít nhất 1 phong cách hoặc 1 sở thích",
    path: ["travelStyle"],
  });

export const step3Schema = z.object({
  name: z.string().min(1, "Nhập tên"),
  email: z.string().email("Email không hợp lệ"),
  notes: z.string().optional(),
});

export type FormState = z.infer<typeof baseStep1> &
  Partial<z.infer<typeof shortTrip>> &
  Partial<z.infer<typeof longTrip>> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema>;

import { z } from "zod";
import type {
  TripRequestFormData,
  TripRequestValidationErrors,
} from "@/lib/trip-request";

export const TRIP_REQUEST_LOCATION_GROUPS = [
  {
    district: "Quận 1",
    wards: ["Sài Gòn", "Tân Định", "Bến Thành", "Cầu Ông Lãnh"],
  },
  {
    district: "Quận 3",
    wards: ["Bàn Cờ", "Xuân Hòa", "Nhiêu Lộc"],
  },
  {
    district: "Quận 4",
    wards: ["Xóm Chiếu", "Khánh Hội", "Vĩnh Hội"],
  },
  {
    district: "Quận 5",
    wards: ["Chợ Quán", "An Đông", "Chợ Lớn"],
  },
  {
    district: "Quận 6",
    wards: ["Bình Tây", "Bình Tiên", "Bình Phú", "Phú Lâm"],
  },
  {
    district: "Quận 7",
    wards: ["Phú Thuận", "Tân Mỹ", "Tân Hưng", "Tân Thuận"],
  },
  {
    district: "Quận 8",
    wards: ["Chánh Hưng", "Phú Định", "Bình Đông"],
  },
  {
    district: "Quận 10",
    wards: ["Diên Hồng", "Vườn Lài", "Hòa Hưng"],
  },
  {
    district: "Quận 11",
    wards: ["Minh Phụng", "Bình Thới", "Hòa Bình", "Phú Thọ"],
  },
  {
    district: "Quận 12",
    wards: ["Đông Hưng Thuận", "Trung Mỹ Tây", "Tân Thới Hiệp", "Thới An"],
  },
  {
    district: "Bình Tân",
    wards: ["An Lạc", "Bình Tân", "Tân Tạo", "Bình Trị Đông", "Bình Hưng Hòa"],
  },
  {
    district: "Bình Thạnh",
    wards: ["Gia Định", "Bình Thạnh", "Bình Lợi Trung", "Thạnh Mỹ Tây", "Bình Quới"],
  },
  {
    district: "Gò Vấp",
    wards: ["Hạnh Thông", "An Nhơn", "Gò Vấp", "An Hội Đông", "Thông Tây Hội", "An Hội Tây"],
  },
  {
    district: "Phú Nhuận",
    wards: ["Đức Nhuận", "Cầu Kiệu", "Phú Nhuận"],
  },
  {
    district: "Tân Bình",
    wards: ["Tân Sơn Hòa", "Tân Sơn Nhất", "Tân Hòa", "Bảy Hiền", "Tân Bình", "Tân Sơn"],
  },
  {
    district: "Tân Phú",
    wards: ["Tây Thạnh", "Tân Sơn Nhì", "Phú Thọ Hòa", "Tân Phú", "Phú Thạnh"],
  },
  {
    district: "TP. Thủ Đức",
    wards: [
      "Hiệp Bình",
      "Thủ Đức",
      "Tam Bình",
      "Linh Xuân",
      "Tăng Nhơn Phú",
      "Long Bình",
      "Long Phước",
      "Long Trường",
      "Cát Lái",
      "Bình Trưng",
      "Phước Long",
      "An Khánh",
    ],
  },
  {
    district: "Huyện Bình Chánh",
    wards: [
      "Xã Vĩnh Lộc",
      "Xã Tân Vĩnh Lộc",
      "Xã Tân Nhựt",
      "Xã Bình Chánh",
      "Xã Hưng Long",
      "Xã Bình Hưng",
      "Xã Bình Lợi",
    ],
  },
  {
    district: "Huyện Củ Chi",
    wards: [
      "Xã An Nhơn Tây",
      "Xã Thái Mỹ",
      "Xã Nhuận Đức",
      "Xã Tân An Hội",
      "Xã Phú Hòa Đông",
      "Xã Bình Mỹ",
      "Xã Củ Chi",
    ],
  },
  {
    district: "Huyện Cần Giờ",
    wards: ["Xã Bình Khánh", "Xã Cần Giờ", "Xã An Thới Đông", "Xã Thạnh An"],
  },
  {
    district: "Huyện Hóc Môn",
    wards: ["Xã Hóc Môn", "Xã Bà Điểm", "Xã Xuân Thới Sơn", "Xã Đông Thạnh"],
  },
  {
    district: "Huyện Nhà Bè",
    wards: ["Xã Nhà Bè", "Xã Hiệp Phước"],
  },
] as const;

export const TRIP_REQUEST_LOCATION_OPTIONS = TRIP_REQUEST_LOCATION_GROUPS.flatMap(
  (group) => group.wards.map((ward) => `${ward}, ${group.district}`),
);

export const TRIP_REQUEST_DURATION_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const TRIP_REQUEST_ACTIVITY_OPTIONS = [
  "Food",
  "Shopping",
  "Nightlife",
  "Street food",
  "Coffee",
  "History",
  "Museums",
  "Culture",
  "Photography",
  "Walking tour",
  "Hidden gems",
  "Markets",
] as const;

export const TRIP_REQUEST_LANGUAGE_OPTIONS = [
  "English",
  "Vietnamese",
  "Japanese",
  "Korean",
  "Chinese",
  "French",
  "German",
  "Spanish",
] as const;

export const defaultTripRequestFormData: TripRequestFormData = {
  city: "",
  startTime: "",
  durationHours: 3,
  adults: 1,
  children: 0,
  activities: [],
  preferredLanguages: ["English"],
  notes: "",
};

function isValidDateString(value: string) {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

export const tripRequestFormSchema = z
  .object({
    city: z.string().trim().min(1, "Location is required."),
    startTime: z.string(),
    durationHours: z.number().finite(),
    adults: z.number().finite(),
    children: z.number().finite(),
    activities: z.array(z.string().trim()).min(1, "Choose at least one activity."),
    preferredLanguages: z
      .array(z.string().trim())
      .min(1, "Choose at least one preferred language."),
    notes: z.string(),
  })
  .superRefine((formData, ctx) => {
    if (!formData.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Please choose a start time.",
      });
    } else if (!isValidDateString(formData.startTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Start time is invalid.",
      });
    } else if (new Date(formData.startTime).getTime() <= Date.now()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Start time must be in the future.",
      });
    }

    if (formData.durationHours <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["durationHours"],
        message: "Duration must be greater than 0.",
      });
    }

    if (formData.adults < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["adults"],
        message: "At least one adult traveler is required.",
      });
    }

    if (formData.children < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["children"],
        message: "Children count cannot be negative.",
      });
    }
  });

export function validateTripRequest(
  formData: TripRequestFormData,
): TripRequestValidationErrors {
  const parsed = tripRequestFormSchema.safeParse(formData);

  if (parsed.success) {
    return {};
  }

  const fieldErrors = parsed.error.flatten().fieldErrors;

  return Object.fromEntries(
    Object.entries(fieldErrors)
      .filter(([, messages]) => Array.isArray(messages) && messages.length > 0)
      .map(([field, messages]) => [field, messages[0]]),
  ) as TripRequestValidationErrors;
}

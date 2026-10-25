import { LoyaltySource } from "@/types/common";
import * as z from "zod";

export const loyaltyClaimValidationSchema = z.object({
  phone_number: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại dùng để đặt hàng")
    .regex(
      /^(0)\d{9}$/,
      "Số điện thoại không hợp lệ, phải có 10 số và bắt đầu bằng 0",
    ),
  order_number: z.string().min(1, "Vui lòng nhập mã đơn hàng"),
  source: z.enum(LoyaltySource),
});

export type LoyaltyClaimValidationType = z.infer<
  typeof loyaltyClaimValidationSchema
>;

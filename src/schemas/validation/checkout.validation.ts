import { DeliveryMethod } from "@/types/checkout";
import { z } from "zod";

export const CustomerInfoValidation = z.object({
  name: z.string().min(1, "Vui lòng nhập tên"),
  phone_number: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
    .optional()
    .nullable(),
});

export const checkoutValidation = z.object({
  customer: CustomerInfoValidation,
  delivery_method: z.enum(
    Object.entries(DeliveryMethod).map(([key, _]) => key),
  ),
  pickup_at: z.string().optional(),
  note: z.string().max(100, "Số lượng kí tự không vượt quá 100").optional(),
});

export const checkoutFormValidation = checkoutValidation.superRefine(
  (data, ctx) => {
    if (data.delivery_method === "pre_order" && !data.pickup_at) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn thời gian nhận hàng",
        path: ["pickup_at"],
      });
    }
  },
);

export const validateCustomerInfoForm = (data: CustomerInfoValidationType) => {
  return CustomerInfoValidation.safeParse(data);
};

export const validateCheckoutForm = (data: CheckoutFormValidationType) => {
  return checkoutFormValidation.safeParse(data);
};

export type CustomerInfoValidationType = z.infer<typeof CustomerInfoValidation>;
export type CheckoutFormValidationType = z.infer<typeof checkoutFormValidation>;

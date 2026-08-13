import { ProductType } from "@/types/product";
import {
  PromotionDiscountType,
  PromotionStatusType,
  TriggerType,
} from "@/types/promotions";
import z from "zod";

export const conditionValidation = z.object({
  min_order_value: z
    .number()
    .min(0, "Giá trị đơn hàng tối thiểu phải lớn hơn 0")
    .default(0),
  max_discount_amount: z.number().default(0),
  min_discount_amount: z.number().default(0),
  applicable_categories: z.enum(ProductType).optional(),
  time_apply: z.object({
    date_range: z.array(z.string()),
    days_of_week: z.array(z.string()).optional(),
    hour_range: z
      .object({
        from: z.string().nullable().optional(),
        to: z.string().nullable().optional(),
      })
      .optional(),
  }),
});

export const promotionValidation = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Tên khuyến mãi phải có ít nhất 3 ký tự").default(""),
  description: z
    .string()
    .min(3, "Mô tả phải có ít nhất 3 ký tự")
    .nullable()
    .optional(),
  limit: z.number().default(0),
  trigger: z.enum(TriggerType, "Vui lòng chọn loại khuyến mãi"),
  status: z.enum(PromotionStatusType).default(PromotionStatusType.draft),
  discount_value: z.number().default(0),
  discount_type: z.enum(PromotionDiscountType, "Vui lòng chọn loại giảm giá"),
  conditions: conditionValidation,
});

export const promotionFormValidationSchema = promotionValidation.superRefine(
  (data, ctx) => {
    if (data.trigger !== TriggerType.manual) {
      if (!data.conditions.time_apply.date_range) {
        ctx.addIssue({
          code: "custom",
          message: "Thời gian bắt buộc phải có khi kich hoạt tự động",
          path: ["time"],
        });
      }
    }
  },
);

export type promotionValidation = z.infer<typeof promotionValidation>;

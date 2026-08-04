import { ProductType } from "@/types/product";
import { PromotionDiscountType, TriggerType } from "@/types/promotions";
import z from "zod";

export const conditionValidation = z.object({
  min_order_value: z.number(),
  max_discount_value: z.number(),
  min_discount_amount: z.number(),
  applicable_categories: z.enum(ProductType).optional(),
  time_apply: z.object({
    days_of_week: z.array(z.number()).optional(),
    time_range: z.array(z.string()).optional(),
  }),
});

export const addPromotionValidation = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  discount_type: z.enum(PromotionDiscountType),
  trigger: z.enum(TriggerType),
  time: z.string(),
  conditions: conditionValidation,
});

export type AddPromotionValidation = z.infer<typeof addPromotionValidation>;

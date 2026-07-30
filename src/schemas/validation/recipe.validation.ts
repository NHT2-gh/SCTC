import { ItemType } from "@/types/product";
import { z } from "zod";

export const productRecipeItemValidationSchema = z.object({
  id: z.string().optional(),
  ingredient_id: z.string().min(1, "Chọn nguyên liệu").nullable().optional(),
  component_id: z.string().min(1, "Chọn thành phần").nullable().optional(),
  item_type: z.enum(ItemType).optional(),
  quantity: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  recipe_version_id: z.string().min(1, "Mã phiên bản công thức").optional(),
});

export const productRecipeItemsValidationSchema = z.object({
  recipe_items: z.array(productRecipeItemValidationSchema),
});

export type ProductRecipeItemValidationSchema = z.infer<
  typeof productRecipeItemValidationSchema
>;

export type ProductRecipeItemsValidationSchema = z.infer<
  typeof productRecipeItemsValidationSchema
>;

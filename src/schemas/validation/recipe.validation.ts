import { ItemType } from "@/types/product";
import { z } from "zod";

export const productRecipeItemValidationSchema = z.object({
  id: z.string().optional(),
  ingredient_id: z.string().nullable().optional(),
  component_id: z.string().nullable().optional(),
  item_type: z.enum(ItemType).optional(),
  quantity: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  recipe_version_id: z.string().min(1, "Mã phiên bản công thức").optional(),
  recipe_item_name: z.string().optional(),
  cost: z.number().optional(),
});

export const productRecipeItemsValidationSchema = z.object({
  recipe_items: z
    .array(productRecipeItemValidationSchema)
    .min(1, "Phải có ít nhất 1 thành phần"),
  note: z.string().optional(),
});

export type ProductRecipeItemValidationSchema = z.infer<
  typeof productRecipeItemValidationSchema
>;

export type ProductRecipeItemsValidationSchema = z.infer<
  typeof productRecipeItemsValidationSchema
>;

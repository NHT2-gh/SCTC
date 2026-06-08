import { z } from "zod";

export const recipeItemValidationSchema = z.object({
  id: z.string().optional(),
  ingredient_id: z.string().min(1, "Chọn nguyên liệu"),
  component_id: z.string().min(1, "Mã thành phần là bắt buộc"),
  quantity: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
});

export const componentRecipeItemsValidationSchema = z.object({
  component_items: z.array(recipeItemValidationSchema),
});

export type RecipeItemValidationSchema = z.infer<
  typeof recipeItemValidationSchema
>;

export type ComponentRecipeItemsValidationSchema = z.infer<
  typeof componentRecipeItemsValidationSchema
>;

import { z } from "zod";

export const componentRecipeItemValidationSchema = z.object({
  id: z.string().optional(),
  ingredient_id: z.string().min(1, "Chọn nguyên liệu"),
  quantity: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  component_id: z.string(),
});

export const componentRecipeItemsValidationSchema = z.object({
  recipe_items: z.array(componentRecipeItemValidationSchema),
  yield_quantity: z
    .number()
    .min(0, "Lượng nguyên liệu thành phẩm phải lớn hơn hoặc bằng 0"),
});

export const componentValidationSchema = z.object({
  name: z.string().min(1, "Tên thành phần là bắt buộc"),
  component_type: z.string().min(1, "Loại thành phần là bắt buộc"),
  description: z.string().optional(),
});

export type ComponentValidationSchema = z.infer<
  typeof componentValidationSchema
>;

export type RecipeItemValidationSchema = z.infer<
  typeof componentRecipeItemValidationSchema
>;

export type ComponentRecipeItemsValidationSchema = z.infer<
  typeof componentRecipeItemsValidationSchema
>;

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

export const componentValidationSchema = z.object({
  name: z.string().min(1, "Tên thành phần là bắt buộc"),
  description: z.string().optional(),
  yield_quantity: z
    .number()
    .min(0, "Lượng nguyên liệu thành phẩm phải lớn hơn hoặc bằng 0"),
  yield_unit: z.string().min(1, "Đơn vị là bắt buộc"),
  component_type: z.string().min(1, "Loại thành phần là bắt buộc"),
  items: z.array(recipeItemValidationSchema).optional(),
});

export type ComponentValidationSchema = z.infer<
  typeof componentValidationSchema
>;

export type RecipeItemValidationSchema = z.infer<
  typeof recipeItemValidationSchema
>;

export type ComponentRecipeItemsValidationSchema = z.infer<
  typeof componentRecipeItemsValidationSchema
>;

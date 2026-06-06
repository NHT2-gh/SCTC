import { z } from "zod";

export const componentRecipeItemsValidationSchema = z.object({
  ingredient_id: z.string().min(1, "Chọn nguyên liệu"),
  quantity: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  unit: z.string().min(1, "Chọn đơn vị"),
});

export type ComponentRecipeItemsValidationSchema = z.infer<
  typeof componentRecipeItemsValidationSchema
>;

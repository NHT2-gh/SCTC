import { z } from "zod";

export const ingredientValidationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Tên là bắt buộc"),
  code: z.string().min(1, "Mã nguyên liệu là bắt buộc"),
  category_code: z.string().min(1, "Danh mục là bắt buộc"),
  purchase_quantity: z.number().min(0, "Số lượng mua phải lớn hơn hoặc bằng 0"),
  unit: z.string().min(1, "Đơn vị là bắt buộc"),
  purchase_price: z.number().min(0, "Giá mua phải lớn hơn hoặc bằng 0"),
  yield_percentage: z.number().min(0, "% Thu hồi phải lớn hơn hoặc bằng 0"),
  notes: z.string().optional(),
});

export type IngredientValidationSchema = z.infer<
  typeof ingredientValidationSchema
>;

import { FormSchema } from "@/components/form/type";
import { ingredientValidationSchema } from "../validation/ingredient.validation";

export const units = [
  { value: "gram", label: "Gram" },
  { value: "ml", label: "Mililit" },
];

export const categories = [
  { value: "DAIRY", label: "Kem" },
  { value: "TEA", label: "Trà" },
  { value: "SYRUP", label: "Siro" },
  { value: "COFFEE", label: "Cà phê" },
  { value: "CHOCOLATE", label: "Socola" },
  { value: "FRUIT", label: "Trái cây" },
  { value: "MILK", label: "Sữa tươi" },
  { value: "MATCHA", label: "Matcha" },
  { value: "HOUJICHA", label: "Houjicha" },
  { value: "OTHER", label: "Khác" },
];

export const ingredientFormSchema: FormSchema = {
  title: "Thêm nguyên liệu",
  fields: [
    {
      name: "category_code",
      type: "select",
      label: "Danh mục",
      defaultValue: "OTHER",
      options: categories,
    },
    {
      name: "name",
      type: "text",
      label: "Tên",
      placeholder: "Nhập tên nguyên liệu",
    },
    {
      name: "purchase_quantity",
      type: "number",
      label: "Số lượng mua",
      placeholder: "Nhập số lượng mua",
    },
    {
      name: "unit",
      type: "select",
      label: "Đơn vị",
      placeholder: "Chọn đơn vị",
      defaultValue: "gram",
      options: units,
    },
    {
      name: "purchase_price",
      type: "number",
      label: "Giá mua",
      formatCurrency: true,
      placeholder: "Nhập giá mua",
    },
    {
      name: "yield_percentage",
      type: "number",
      defaultValue: 100,
      label: "% Thu hồi",
      placeholder: "Nhập % thu hồi",
    },
  ],
  validation: ingredientValidationSchema,
  layout: {
    type: "grid",
  },
};

import { FormSchema } from "@/components/form/type";
import { ingredientValidationSchema } from "../validation/ingredient.validation";
import {
  IngredientCategoryType,
  MapTextIngredientCategoryType,
} from "@/types/ingredient";

export const units = [
  { value: "gram", label: "Gram" },
  { value: "ml", label: "Mililit" },
];

const defaultValues = {
  name: "",
  category_code: "OTHER",
  purchase_price: 0,
  purchase_quantity: 0,
  code: "",
  unit: "gram",
  yield_percentage: 100,
  notes: "",
};

export const ingredientFormSchema: FormSchema = {
  title: "Thêm nguyên liệu",
  fields: [
    {
      name: "category_code",
      type: "select",
      label: "Danh mục",
      options: Object.values(IngredientCategoryType).map((category) => ({
        value: category,
        label: MapTextIngredientCategoryType[category],
      })),
    },
    {
      name: "name",
      type: "text",
      label: "Tên nguyên liệu",
      placeholder: "Nhập tên nguyên liệu",
    },
    {
      name: "code",
      type: "text",
      label: "Mã nguyên liệu",
      placeholder: "Nhập mã nguyên liệu",
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
    {
      name: "notes",
      type: "textarea",
      label: "Ghi chú",
      placeholder: "Nhập ghi chú nguyên liệu",
      className: "col-span-2",
    },
  ],
  validation: ingredientValidationSchema,
  layout: {
    type: "grid",
  },
  defaultValues: defaultValues,
};

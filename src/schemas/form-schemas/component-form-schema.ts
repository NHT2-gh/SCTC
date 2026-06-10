import { FormSchema } from "@/components/form/type";
import { componentValidationSchema } from "../validation/component.validation";
import { ComponentType } from "@/types/component";

export const units = [
  { value: "g", label: "Gram" },
  { value: "ml", label: "Mililit" },
];

export const componentFormSchema: FormSchema = {
  fields: [
    {
      name: "name",
      type: "text",
      label: "Tên",
      className: "col-span-2",
      placeholder: "Nhập tên công thức",
    },
    {
      name: "yield_quantity",
      type: "number",
      label: "Số lượng thành phẩm",
      placeholder: "Nhập số lượng thành phẩm",
    },
    {
      name: "yield_unit",
      type: "select",
      label: "Đơn vị",
      placeholder: "Chọn đơn vị",
      defaultValue: "gram",
      options: units,
    },

    {
      name: "component_type",
      type: "select",
      label: "Loại thành phần",
      placeholder: "Chọn loại thành phần",
      options: Object.entries(ComponentType).map(([key, value]) => ({
        value: key,
        label: value,
      })),
    },

    {
      name: "description",
      type: "textarea",
      className: "col-span-2",
      label: "Mô tả",
      placeholder: "Nhập mô tả cho công thức thành phần",
    },
  ],
  validation: componentValidationSchema,
  layout: {
    type: "grid",
  },
};

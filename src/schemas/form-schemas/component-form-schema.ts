import { ComponentType } from "@/types/component";
import { FormSchema } from "@/components/form/type";
import { componentValidationSchema } from "../validation/component.validation";

export const componentFormSchema: FormSchema = {
  fields: [
    {
      name: "name",
      type: "text",
      label: "Tên",
      className: "",
      placeholder: "Nhập tên công thức",
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
      className: "md:col-span-2",
      label: "Mô tả",
      placeholder: "Nhập mô tả cho công thức thành phần",
    },
  ],
  validation: componentValidationSchema,
  defaultValues: {
    name: "",
    component_type: "",
    description: "",
  },
  layout: {
    type: "grid",
  },
};

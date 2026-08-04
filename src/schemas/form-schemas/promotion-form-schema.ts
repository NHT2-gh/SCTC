import { FormSchema } from "@/components/form/type";
import { ProductType } from "@/types/product";
import { PromotionDiscountType, TriggerType } from "@/types/promotions";

export const addPromotionFormSchema: FormSchema = {
  fields: [
    {
      name: "name",
      label: "Tiêu đề",
      type: "text",
      placeholder: "Nhập tên khuyến mãi",
    },
    {
      name: "description",
      label: "Mô tả",
      type: "text",
      placeholder: "Nhập mô tả khuyến mãi",
    },
    {
      name: "trigger",
      label: "Loại",
      type: "select",
      placeholder: "Chọn loại khuyến mãi",
      options: Object.values(TriggerType).map((item) => ({
        label: item,
        value: item,
      })),
    },
    {
      id: "time",
      name: "time",
      label: "Thời gian áp dụng",
      type: "date",
      mode: "range",
      placeholder: "Chọn khoảng thời gian áp dụng",
    },
    {
      id: "discount_type",
      name: "discount_type",
      label: "Loại giảm giá",
      type: "select",
      placeholder: "Chọn loại giảm giá",
      options: Object.values(PromotionDiscountType).map((item) => ({
        label: item,
        value: item,
      })),
    },

    {
      id: "min_order_value",
      name: "conditions.min_order_value",
      label: "Giá trị đơn hàng tối thiểu",
      placeholder: "Nhập giá trị đơn hàng tối thiểu",
      type: "number",
    },
    {
      id: "max_discount_value",
      name: "conditions.max_discount_value",
      label: "Giảm giá tối đa",
      placeholder: "Nhập số tiền giảm tối đa",
      type: "number",
    },
    {
      id: "min_discount_amount",
      name: "conditions.min_discount_amount",
      label: "Giá trị giảm tối thiểu",
      placeholder: "Nhập số tiền giảm tối thiểu",
      type: "number",
    },

    {
      id: "applicable_categories",
      name: "conditions.applicable_categories",
      placeholder: "Chọn loại sản phẩm áp dụng",
      label: "Loại sản phẩm áp dụng",
      type: "select",
      mode: "multiple",
      options: Object.values(ProductType).map((item) => ({
        label: item,
        value: item,
      })),
    },
    {
      name: "conditions.time_apply.days_of_week",
      placeholder: "Chọn ngày trong tuần",
      label: "Ngày trong tuần",
      type: "multiselect",
      options: [
        { label: "Thứ 2", value: 1 },
        { label: "Thứ 3", value: 2 },
        { label: "Thứ 4", value: 3 },
        { label: "Thứ 5", value: 4 },
        { label: "Thứ 6", value: 5 },
        { label: "Thứ 7", value: 6 },
        { label: "Chủ Nhật", value: 0 },
      ],
    },
    {
      id: "time_range",
      placeholder: "Chọn giờ áp dụng",
      name: "conditions.time_apply.time_range",
      label: "Giờ áp dụng",
      type: "date",
      mode: "multiple",
      pickerType: "time",
    },
  ],
  layout: {
    type: "grid",
  },
};

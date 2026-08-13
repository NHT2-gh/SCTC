import { FormSchema } from "@/components/form/type";
import { ProductType, ProductTypeMapText } from "@/types/product";
import {
  DaysOfWeek,
  DaysOfWeekMapText,
  PromotionDiscountType,
  PromotionDiscountTypeMapText,
  TriggerType,
  TriggerTypeMapText,
} from "@/types/promotions";
import { promotionFormValidationSchema } from "../validation/promotion.validation";

export const addPromotionFormSchema: FormSchema = {
  fields: [
    {
      name: "name",
      label: "Tiêu đề",
      type: "text",
      placeholder: "Nhập tiêu đề khuyến mãi",
      required: true,
    },

    {
      name: "trigger",
      label: "Loại khuyến mãi",
      type: "select",
      placeholder: "Chọn loại khuyến mãi",
      options: Object.entries(TriggerType).map(([key, value]) => ({
        label: TriggerTypeMapText[value],
        value: key,
      })),
      required: true,
    },
    {
      name: "description",
      label: "Mô tả",
      type: "text",
      placeholder: "Nhập mô tả khuyến mãi",
      className: "col-span-2",
    },

    {
      id: "min_order_value",
      name: "conditions.min_order_value",
      label: "Giá trị đơn hàng tối thiểu",
      placeholder: "Nhập giá trị đơn hàng tối thiểu",
      type: "number",
      formatCurrency: true,
      className: "col-span-2",
    },

    {
      name: "discount_value",
      label: "Giá trị giảm",
      type: "number",
      placeholder: "Nhập giá trị giảm",
      formatCurrency: true,
      required: true,
    },

    {
      id: "discount_type",
      name: "discount_type",
      label: "Loại giảm giá",
      type: "select",
      placeholder: "Chọn loại giảm giá",
      options: Object.entries(PromotionDiscountType).map(([key, value]) => ({
        label: PromotionDiscountTypeMapText[value],
        value: key,
      })),
      required: true,
    },

    {
      id: "min_discount_amount",
      name: "conditions.min_discount_amount",
      label: "Giá trị giảm tối thiểu",
      placeholder: "Nhập số tiền giảm tối thiểu",
      type: "number",
      formatCurrency: true,
    },

    {
      id: "max_discount_value",
      name: "conditions.max_discount_amount",
      label: "Giảm giá tối đa",
      placeholder: "Nhập số tiền giảm tối đa",
      type: "number",
      formatCurrency: true,
    },

    {
      id: "time",
      name: "conditions.time_apply.date_range",
      label: "Thời gian áp dụng",
      type: "date",
      mode: "range",
      placeholder: "Chọn khoảng thời gian áp dụng",
      required: true,
    },

    {
      id: "applicable_categories",
      name: "conditions.applicable_categories",
      placeholder: "Chọn loại sản phẩm áp dụng",
      label: "Loại sản phẩm áp dụng",
      type: "select",
      mode: "multiple",
      className: "col-span-2",
      options: Object.entries(ProductType).map(([key, value]) => ({
        label: ProductTypeMapText[value],
        value: key,
      })),
    },
    {
      name: "conditions.time_apply.days_of_week",
      placeholder: "Chọn ngày trong tuần",
      label: "Ngày trong tuần",
      type: "multiselect",
      options: Object.entries(DaysOfWeek).map(([key, value]) => ({
        label: DaysOfWeekMapText[value],
        value: key,
      })),
      className: "col-span-2",
    },
    {
      id: "hour_range_from",
      placeholder: "Chọn giờ bắt đầu áp dụng",
      name: "conditions.time_apply.hour_range.from",
      label: "Giờ áp dụng trong ngày",
      type: "date",
      mode: "single",
      pickerType: "time",
    },
    {
      id: "hour_range_to",
      placeholder: "Chọn giờ kết thúc áp dụng",
      name: "conditions.time_apply.hour_range.to",
      label: "  ",
      type: "date",
      mode: "single",
      pickerType: "time",
      className: "",
    },
  ],
  layout: {
    type: "accordion",
    sections: [
      {
        id: "info",
        title: "Thông tin",
        description: "Thông tin cơ bản về khuyến mãi",
        fields: [
          "name",
          "description",
          "trigger",
          "discount_type",
          "discount_value",
        ],
        defaultOpen: true,
      },
      {
        id: "conditions",
        title: "Điều kiện",
        description: "Điều kiện áp dụng khuyến mãi",
        fields: [
          "conditions.min_order_value",
          "conditions.max_discount_amount",
          "conditions.min_discount_amount",
          "conditions.applicable_categories",
        ],
      },
      {
        id: "time",
        title: "Thời gian",
        description: "Thời gian áp dụng khuyến mãi",
        fields: [
          "conditions.time_apply.time_range",
          "conditions.time_apply.days_of_week",
          "conditions.time_apply.hour_range.from",
          "conditions.time_apply.hour_range.to",
        ],
      },
    ],
  },
  validation: promotionFormValidationSchema,
};

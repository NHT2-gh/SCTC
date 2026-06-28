import { FormSchema } from "@/components/form/type";
import { DeliveryMethod } from "@/types/checkout";
import { checkoutFormValidation } from "../validation/checkout.validation";

export const checkoutFormSchema: FormSchema = {
  fields: [
    {
      name: "customer.name",
      label: "Tên / Nickname",
      placeholder: "Nhập tên hoặc nickname",
      type: "text",
    },
    {
      name: "customer.phone_number",
      label: "Số điện thoại",
      placeholder: "Nhập số điện thoại",
      type: "text",
    },
    {
      name: "note",
      label: "Ghi chú",
      placeholder: "Nhập ghi chú",
      maxLength: 1000,
      type: "textarea",
      className: "col-span-2",
    },
    {
      name: "pickup_at",
      id: "pickup_at",
      mode: "single",
      pickerType: "datetime",
      label: "Thời gian lấy hàng",
      defaultDate: new Date(),
      placeholder: "Chọn thời gian",
      message: "Nhập nếu bạn chọn đặt trước",
      type: "date",
      className: "col-span-2",
    },
  ],
  validation: checkoutFormValidation,
  layout: {
    type: "grid",
  },
};

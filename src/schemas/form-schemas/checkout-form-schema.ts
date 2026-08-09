import { FormSchema } from "@/components/form/type";
import { checkoutFormValidation } from "../validation/checkout.validation";
import { MapTextPaymentMethod } from "@/types/order";

export const checkoutFormSchema: FormSchema = {
  fields: [
    {
      name: "customer.name",
      label: "Tên / Nickname",
      placeholder: "Nhập tên hoặc nickname",
      type: "text",
      className: "col-span-1",
      required: true,
    },
    {
      name: "customer.phone_number",
      label: "Số điện thoại",
      placeholder: "Nhập số điện thoại",
      type: "text",
      required: false,
      className: "col-span-1",
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

    {
      name: "payment_method",
      label: "Phương thức thanh toán",
      className: "col-span-2",
      placeholder: "Chọn phương thức thanh toán",
      required: true,
      multiple: false,
      type: "select",
      options: Object.entries(MapTextPaymentMethod).map(([key, value]) => ({
        label: value,
        value: key,
      })),
    },
  ],
  validation: checkoutFormValidation,
  layout: {
    type: "grid",
  },
};

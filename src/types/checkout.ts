export enum DeliveryMethod {
  pickup_now = "Lấy hàng ngay",
  pre_order = "Đặt trước",
}

export interface CustomerInfo {
  name: string;
  phone_number?: string;
}

export interface CheckoutState {
  customer: CustomerInfo;
  delivery_method: DeliveryMethod;
  pickup_at?: Date;
  note?: string;
  is_submitting: boolean;
  order_id?: string;
}

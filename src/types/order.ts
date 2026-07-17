import { CheckoutInfo } from "@/store/checkout/config";
import { CartItem } from "./cart";
import { DeliveryMethod } from "./checkout";
import { MenuItem, OptionType } from "./menu";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY = "ready",
  DONE = "done",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  MOMO = "momo",
  ZALO = "zalo",
  MB = "mb",
}

export enum PaymentType {
  GROUP = "group",
  INDIVIDUAL = "individual",
}

export const MapTextStatusOrder: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Chờ xác nhận",
  [OrderStatus.CONFIRMED]: "Đã xác nhận",
  [OrderStatus.PREPARING]: "Đang chuẩn bị",
  [OrderStatus.READY]: "Đã sẵn sàng giao món",
  [OrderStatus.DONE]: "Đã xong",
  [OrderStatus.COMPLETED]: "Đã hoàn tất",
  [OrderStatus.CANCELLED]: "Đã hủy",
};

export enum OrderType {
  dine_in = "dine_in",
  take_away = "take_away",
}

export const OrderTypeMap: Record<OrderType, string> = {
  [OrderType.dine_in]: "Tại chỗ",
  [OrderType.take_away]: "Mang đi",
};

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  notes: string | null;
  subtotal: number;
  status: OrderStatus;
  pick_up_time: string;
  order_items_count: number;
  delivery_method: DeliveryMethod;
  tracking_order: string;
  order_type: OrderType;
  created_at: string;
  updated_at: string;
  table_id?: number | null;
  tables?: {
    id: number;
    name: string;
  };
}

export interface OrderDetail {
  order: Order;
  items: OrderItem[];
}

export interface OptionItem {
  id: string;
  name: string;
  price: number;
  type: keyof typeof OptionType;
}

export interface OrderItem {
  order_item: {
    id: string;
    order_id: string;
    quantity: number;
    total_price: number;
    options: OptionItem[];
    menu_item_id: string;
    line_note: string | null;
  };
  product: {
    id: string;
    product_name: string;
    product_description: string | null;
    product_selling_price: number;
  };
}

export interface OrderItemCard {
  id: string;
  order_id: string;
  quantity: number;
  total_price: number;
  options: OptionItem[];
  menu_items: MenuItem;
  line_note: string | null;
}

export interface UpdateOrderDTO {
  trackingCodes: string[];
  status: OrderStatus;
}

export interface CreateOrderDTO {
  order_type: keyof typeof OrderType;
  cartItems: CartItem[];
  checkoutInfo: CheckoutInfo;
  table_id?: number;
}

export interface AddOrderResponen {
  order_id: string;
  subtotal: number;
  status: OrderStatus;
  order_items_count: number;
  tracking_order: string;
  pick_up_time: string;
}

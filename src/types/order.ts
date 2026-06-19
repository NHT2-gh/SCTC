import { DeliveryMethod } from "./checkout";
import { OptionType } from "./menu";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  DELIVERING = "delivering",
  READY = "ready",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  notes: string | null;
  subtotal: number;
  status?: OrderStatus;
  pick_up_time: string;
  delivery_method: keyof typeof DeliveryMethod;
  tracking_order: string;
  created_at: string;
  updated_at: string;
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

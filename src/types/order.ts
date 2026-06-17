import { MenuItem } from "./menu";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY = "ready",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone_number: string;
  notes: string;
  subtotal: number;
  status?: OrderStatus;
  pick_up_time: string;
  tracking_order: string;
}

export interface OrderDetail {
  id: string;
  order_id: string;
  quantity: number;
  total_price: number;
  option_ids: string[];
  menu_item_id: MenuItem;
}

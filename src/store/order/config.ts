import { Order, OrderStatus } from "@/types/order";

export interface OrderState {
  orders: Order[];
}

export interface OrderActions {
  addOrder: (order: Order) => void;

  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  removeOrder: (orderId: string) => void;

  clearOrders: () => void;
}
export type OrderStore = OrderState & OrderActions;

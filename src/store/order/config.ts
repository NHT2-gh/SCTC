import { Order, OrderStatus, AddOrderResponen } from "@/types/order";

export interface OrderState {
  orders: AddOrderResponen[];
}

export interface OrderActions {
  addOrder: (order: AddOrderResponen) => void;

  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  removeOrder: (orderId: string) => void;

  clearOrders: () => void;
}
export type OrderStore = OrderState & OrderActions;

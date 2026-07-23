import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OrderStore } from "./config";
import { STORAGE_KEYS } from "../storage_keys";
import { OrderStatus } from "@/types/order";

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.order_id === orderId
              ? {
                  ...order,
                  status,
                }
              : order,
          ),
        })),

      removeOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.order_id !== orderId),
        })),

      clearOrders: () =>
        set({
          orders: [],
        }),
    }),
    {
      name: STORAGE_KEYS.ORDERS,
      partialize: (state) => ({
        orders: state.orders.filter((order) => {
          if (
            order.pick_up_time &&
            new Date(order.pick_up_time).getDate() === new Date().getDate()
          ) {
            return true;
          } else if (!order.pick_up_time) {
            return false;
          }

          return false;
        }),
      }),
    },
  ),
);

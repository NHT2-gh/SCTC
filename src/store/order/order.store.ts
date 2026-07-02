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
            order.id === orderId
              ? {
                  ...order,
                  status,
                }
              : order,
          ),
        })),

      removeOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
        })),

      clearOrders: () =>
        set({
          orders: [],
        }),
    }),
    {
      name: STORAGE_KEYS.ORDERS,
      partialize: (state) => ({
        orders: state.orders.filter(
          (order) => order.status !== OrderStatus.COMPLETED,
        ),
      }),
    },
  ),
);

import { useOrderStore } from "@/store/order/order.store";
import { OrderStatus } from "@/types/order";
import { useMemo } from "react";

export function useOrderHistory() {
  const historyOrders = useOrderStore((state) => state.orders);
  const activeOrders = useMemo(
    () =>
      historyOrders.filter((order) => order.status !== OrderStatus.COMPLETED),
    [historyOrders],
  );
  const addOrder = useOrderStore((state) => state.addOrder);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const removeOrder = useOrderStore((state) => state.removeOrder);
  const clearOrders = useOrderStore((state) => state.clearOrders);
  return {
    historyOrders,
    activeOrders,

    addOrder,
    updateOrderStatus,
    removeOrder,
    clearOrders,
  };
}

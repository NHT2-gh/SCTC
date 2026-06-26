import { Order } from "@/types/order";
import { QueryClient } from "@tanstack/react-query";

export function updateOrderInCache(
  queryClient: QueryClient,
  updatedOrder: Order,
) {
  queryClient.setQueryData<Order[]>(["orders"], (current = []) =>
    current.map((order) =>
      order.id === updatedOrder.id ? updatedOrder : order,
    ),
  );
}

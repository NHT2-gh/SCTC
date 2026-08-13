import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";
import { mutationKeys } from "@/config/mutation-keys";
import { queryKeys } from "@/config/query-keys";
import { orderService } from "@/services/order.service";
import { subscribeOrders } from "@/supabase/realtime/order.sub";

import { GetWithFilterParams, ResponseStandard } from "@/types/common";
import {
  CreateOrderDTO,
  Order,
  OrderStatus,
  UpdateOrderDTO,
} from "@/types/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useCreateOrder() {
  return useMutation({
    mutationKey: mutationKeys.order.add,
    mutationFn: (payload: CreateOrderDTO) => orderService.createOrder(payload),
  });
}

export function useGetAllOrder(params?: GetWithFilterParams<Order>) {
  return useQuery({
    queryKey: queryKeys.order.getAll(params),
    queryFn: () => orderService.getAllOrder(params),
  });
}

export function useOrderRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = subscribeOrders({
      onInsert(order) {
        queryClient.setQueryData(
          queryKeys.order.getAll(),
          (current: ResponseStandard<Order[]>) => {
            if (!current) return current;

            return {
              ...current,
              data: [order, ...current.data],
            };
          },
        );
      },

      onUpdate(updatedOrder) {
        queryClient.setQueryData(
          queryKeys.order.getAll(),
          (current: ResponseStandard<Order[]>) => {
            if (!current) return current;
            return {
              ...current,
              data: current.data.map((order: Order) =>
                order.id === updatedOrder.id ? updatedOrder : order,
              ),
            };
          },
        );
      },
    });

    return unsubscribe;
  }, [queryClient]);
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.order.update,
    mutationFn: (payload: UpdateOrderDTO) => orderService.updateOrder(payload),

    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.order.detail(variables.ids[0]),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.order.getAll({
          filters: {
            status: variables.status!,
          },
        }),
      });
    },
  });
}

export function useGetDetailOrder(trackingCode: string) {
  return useQuery({
    queryKey: queryKeys.order.detail(trackingCode),
    queryFn: () => orderService.getOrderDetail(trackingCode),
  });
}

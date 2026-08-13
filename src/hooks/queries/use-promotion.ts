"use client";
import { queryKeys } from "@/config/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { promotionService } from "@/services/promotion.service";
import { mutationKeys } from "@/config/mutation-keys";
import { promotionValidation } from "@/schemas/validation/promotion.validation";
import { GetWithFilterParams } from "@/types/common";
import {
  Promotion,
  RequestApplyPromotion,
  RequestPromotionAllow,
} from "@/types/promotions";

export function useGetAllPromotion(params?: GetWithFilterParams<Promotion>) {
  return useQuery({
    queryKey: queryKeys.promotion.getAll(params),
    queryFn: () => promotionService.getAll(params!),
  });
}

export function useAddPromotion() {
  return useMutation({
    mutationKey: mutationKeys.promotion.add,
    mutationFn: (data: promotionValidation) =>
      promotionService.addPromotion(data),
  });
}

export function useGetPromotionDetail(id?: string) {
  return useQuery({
    queryKey: queryKeys.promotion.getById(id!),
    queryFn: () => promotionService.getDetail(id!),
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.promotion.add,
    mutationFn: (data: promotionValidation) =>
      promotionService.updatePromotion(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.promotion.getAll(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.promotion.getById(variables.id!),
      });
    },
  });
}

export function useApplyPromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.promotion.apply,
    mutationFn: (data: RequestApplyPromotion[]) =>
      promotionService.applyPromotion(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.promotion.orderDiscount(variables[0].order_id),
      });
    },
  });
}

export function useGetPromotionAllow(resquest: RequestPromotionAllow) {
  return useQuery({
    queryKey: queryKeys.promotion.allow(resquest),
    queryFn: () => promotionService.getPromotionAllow(resquest),
  });
}

export function useGetOrderDiscount(orderId: string) {
  return useQuery({
    queryKey: queryKeys.promotion.orderDiscount(orderId),
    queryFn: () => promotionService.getOrderDiscount(orderId),
  });
}

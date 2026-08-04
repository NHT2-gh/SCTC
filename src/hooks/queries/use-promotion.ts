import { queryKeys } from "@/config/query-keys";
import { useMutation, useQuery } from "@tanstack/react-query";
import { promotionService } from "@/services/promotion.service";
import { mutationKeys } from "@/config/mutation-keys";
import { Promotion } from "@/types/promotions";
import { AddPromotionValidation } from "@/schemas/validation/promotion.validation";

export function useGetAllPromotion() {
  return useQuery({
    queryKey: queryKeys.promotion.getAll(),
    queryFn: () => promotionService.getAll(),
  });
}

export function useAddPromotion() {
  return useMutation({
    mutationKey: mutationKeys.promotion.add,
    mutationFn: (data: AddPromotionValidation) =>
      promotionService.addPromotion(data),
  });
}

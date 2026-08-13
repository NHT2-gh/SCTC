import { EligiblePromotion } from "@/hooks/use-promotion";

import { Promotion, PromotionForOrder } from "@/types/promotions";

export function PromotionCalculatorAdapter(
  promotions: PromotionForOrder[],
): EligiblePromotion[] {
  return promotions.map((promotion) => ({
    promotion_id: promotion.promotion.id,
    promotion_name: promotion.promotion.name,
    discount_type: promotion.promotion.discount_type,
    discount_value: promotion.promotion.discount_value,
    applicable_products: promotion.promotion.conditions.applicable_products,
    applicable_categories: promotion.promotion.conditions.applicable_categories,
    max_discount_value: promotion.promotion.conditions.max_discount_value,
  }));
}

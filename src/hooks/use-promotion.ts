import { OrderItem } from "@/types/order";
import { Product, ProductType } from "@/types/product";
import { PromotionDiscountType } from "@/types/promotions";
import { useMemo } from "react";

export interface EligiblePromotion {
  promotion_id: string;
  promotion_name: string;
  discount_type: PromotionDiscountType;
  discount_value: number;
  max_discount_value: number | null;
  applicable_products?: string[];
  applicable_categories?: ProductType[];
}

export interface UsePromotionCalculatorProps {
  orderSubtotal: number;
  eligiblePromotions: EligiblePromotion[];
  products: Pick<
    Product,
    "id" | "name" | "description" | "product_type" | "selling_price"
  >[];
  selectedPromotion: string[];
}

export function usePromotionCalculator({
  orderSubtotal,
  eligiblePromotions,
  selectedPromotion,
  products,
}: UsePromotionCalculatorProps) {
  return useMemo(() => {
    const maxTotalDiscount = orderSubtotal * 0.4;

    const currentTotalDiscount = eligiblePromotions
      .filter((promotion) => selectedPromotion.includes(promotion.promotion_id))
      .reduce((total, promotion) => total + promotion.discount_value, 0);

    const promotionResults = eligiblePromotions
      .filter((promotion) => selectedPromotion.includes(promotion.promotion_id))
      .map((promotion) => {
        const eligibleSubtotal = products
          .filter(
            (product) =>
              promotion.applicable_products?.includes(product.id) ||
              promotion.applicable_categories?.includes(product.product_type),
          )
          .reduce((total, product) => total + product.selling_price, 0);

        let discount = 0;

        if (promotion.discount_type === PromotionDiscountType.percentage) {
          discount = (eligibleSubtotal * promotion.discount_value) / 100;
        } else {
          discount = promotion.discount_value;
        }

        if (promotion.max_discount_value != null) {
          discount = Math.min(discount, promotion.max_discount_value);
        }

        if (
          currentTotalDiscount > maxTotalDiscount &&
          discount > currentTotalDiscount - maxTotalDiscount
        ) {
          discount = discount - (currentTotalDiscount - maxTotalDiscount);
        }

        return {
          promotionId: promotion.promotion_id,
          promotionName: promotion.promotion_name,
          eligibleSubtotal,
          discount,
        };
      });

    const rawTotalDiscount = promotionResults.reduce(
      (total, promotion) => total + promotion.discount,
      0,
    );

    const totalDiscount = Math.min(rawTotalDiscount, maxTotalDiscount);

    return {
      promotionResults,
      totalDiscount,
    };
  }, [orderSubtotal, eligiblePromotions, selectedPromotion]);
}

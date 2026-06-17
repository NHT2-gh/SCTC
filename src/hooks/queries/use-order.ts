import { mutationKeys } from "@/config/mutation-keys";
import { orderService } from "@/services/order.service";
import { CheckoutInfo } from "@/store/checkout/config";
import { CartItem } from "@/types/cart";
import { useMutation } from "@tanstack/react-query";

export function useCreateOrder() {
  return useMutation({
    mutationKey: mutationKeys.order.add,
    mutationFn: (payload: {
      cartItems: CartItem[];
      checkoutInfo: CheckoutInfo;
    }) => orderService.createOrder(payload.cartItems, payload.checkoutInfo),
  });
}

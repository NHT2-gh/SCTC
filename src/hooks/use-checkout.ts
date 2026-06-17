import { useCheckoutStore } from "@/store/checkout/checkout.store";

export function useCheckout() {
  const checkoutInfo = useCheckoutStore((state) => state.checkout);
  const updateCheckout = useCheckoutStore((state) => state.updateCheckout);
  return {
    checkoutInfo,
    updateCheckout,
  };
}

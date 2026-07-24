import { CustomerInfo, DeliveryMethod } from "@/types/checkout";
import { PaymentMethod } from "@/types/order";

export interface CheckoutInfo {
  customer: CustomerInfo;
  delivery_method: DeliveryMethod;
  pickup_at?: string;
  note?: string;
  payment_method?: PaymentMethod;
}
export interface CheckoutState {
  checkout: CheckoutInfo;
  is_submitting: boolean;
}

export interface CheckoutActions {
  updateCheckout(payload: CheckoutInfo): void;
  reset(): void;
}

export type CheckoutStore = CheckoutState & CheckoutActions;

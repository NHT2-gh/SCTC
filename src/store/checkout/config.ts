import { CustomerInfo, DeliveryMethod } from "@/types/checkout";

export interface CheckoutInfo {
  customer: CustomerInfo;
  delivery_method: keyof typeof DeliveryMethod | string;
  pickup_at?: string;
  note?: string;
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

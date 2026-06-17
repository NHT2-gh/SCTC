import { CheckoutInfo, CheckoutState, CheckoutStore } from "./config";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../storage_keys";
import { DeliveryMethod } from "@/types/checkout";

const createInitialCheckout = (): CheckoutInfo => ({
  customer: {
    name: "",
    phone_number: "",
  },
  delivery_method: "pickup_now",
  pickup_at: undefined,
  note: "",
});

const initialState: CheckoutState = {
  checkout: createInitialCheckout(),
  is_submitting: false,
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateCheckout: (payload) => {
        set((state) => ({
          checkout: {
            ...state.checkout,
            ...payload,
            customer: {
              ...state.checkout.customer,
              ...payload.customer,
            },
          },
        }));
      },

      reset: () => {
        set(() => ({
          checkout: initialState.checkout,
          is_submitting: false,
        }));
      },
    }),
    {
      name: STORAGE_KEYS.CHECKOUT,
      partialize: (state) => ({
        checkout: {
          customer: state.checkout.customer,
        },
      }),
    },
  ),
);

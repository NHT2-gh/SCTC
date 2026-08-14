import { useMemo } from "react";
import { getCartSummary } from "@/store/cart/helper";
import { useCartStore } from "@/store/cart/cart.store";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const isEmpty = useCartStore((state) => state.items.length === 0);
  const isHydrated = useCartStore((state) => state.isHydrated);
  const add = useCartStore((state) => state.add_item);
  const updateQuantity = useCartStore((state) => state.update_quantity);
  const updateNote = useCartStore((state) => state.update_note);
  const updateCartItemOptions = useCartStore((state) => state.update_options);
  const remove = useCartStore((state) => state.remove_item);
  const clearCart = useCartStore((state) => state.clear);

  const cartSummary = useMemo(() => getCartSummary(items), [items]);

  return {
    //Action
    add,
    updateQuantity,
    clearCart,
    updateNote,
    updateCartItemOptions,
    remove,
    //State
    items,
    isEmpty,
    cartSummary,
    isLoading: !isHydrated,
  };
}

import { useCartStore } from "@/store/cart/cart.store";
import { getCartSummary } from "@/store/cart/helper";
import { useMemo } from "react";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const count = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0),
  );
  const isEmpty = useCartStore((state) => state.items.length === 0);
  const add = useCartStore((state) => state.add_item);

  const cartSummary = useMemo(() => getCartSummary(items), [items]);

  return {
    //Action
    add,

    //State
    items,
    count,
    isEmpty,
    cartSummary,
  };
}

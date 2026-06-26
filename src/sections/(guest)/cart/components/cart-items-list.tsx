import React from "react";
import CartItem from "./cart-item";
import { CartItem as CartItemType } from "@/types/cart";
import { cn } from "@/lib/utils";
import SwipeableCartItem from "./swipeable-cart-item";

export default function CartItemsList({
  items,
  className,
}: {
  items: CartItemType[];
  className?: string;
}) {
  return (
    <section className={cn("grow space-y-5 py-5 px-4", className)}>
      {items.length === 0 && <span>Chưa có ưng món nào hả ???</span>}
      {items.map((item) => (
        <SwipeableCartItem item={item} key={item.id} />
      ))}
    </section>
  );
}

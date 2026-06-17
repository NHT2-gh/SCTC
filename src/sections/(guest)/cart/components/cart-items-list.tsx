import React from "react";
import CartItem from "./cart-item";
import { useCart } from "@/hooks/use-cart";

export default function CartItemsList() {
  const { items } = useCart();
  return (
    <section className="grow space-y-3">
      {items.length === 0 && <span>Hiện tại không có sản phẩm nào</span>}
      {items.map((item) => (
        <CartItem key={String(item.id)} item={item} />
      ))}
    </section>
  );
}

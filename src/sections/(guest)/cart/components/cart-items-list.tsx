import React from "react";
import CartItem from "./cart-item";
import { CartItem as CartItemType } from "@/types/cart";

export default function CartItemsList({ items }: { items: CartItemType[] }) {
  return (
    <section className="grow space-y-5 py-5 px-4">
      {items.length === 0 && <span>Hiện tại không có sản phẩm nào</span>}
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </section>
  );
}

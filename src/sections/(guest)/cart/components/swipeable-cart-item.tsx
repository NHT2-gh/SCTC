import React, { useRef, useState } from "react";
import CartItem from "./cart-item";
import { CartItem as CartItemType } from "@/types/cart";
import { useCart } from "@/hooks/use-cart";

interface SwipeableCartItemProps {
  item: CartItemType;
}

export default function SwipeableCartItem({ item }: SwipeableCartItemProps) {
  const { remove } = useCart();
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const dragging = useRef(false);

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    startX.current = e.clientX;
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;

    const delta = e.clientX - startX.current;

    setOffset(Math.max(-80, Math.min(0, delta)));
  }

  function onPointerUp() {
    dragging.current = false;

    setOffset(offset < -40 ? -80 : 0);
  }
  return (
    <div className="relative overflow-hidden rounded-lg">
      <button
        onClick={() => remove(item.id)}
        className="absolute right-0 top-0 h-full w-20 bg-[#8D1111] text-white"
      >
        Xoá
      </button>

      <div
        className="bg-[#FFFAEA] touch-pan-y"
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragging.current ? "none" : "transform .2s ease",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <CartItem item={item} />
      </div>
    </div>
  );
}

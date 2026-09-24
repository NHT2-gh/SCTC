"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CartItem } from "@/types/cart";
import { useCart } from "@/hooks/use-cart";
import { useModal } from "@/hooks/useModal";
import { CartItemsList } from "../components";
import { delagothic, itim } from "@/lib/fonts";
import { APP_ROUTES } from "@/config/app-routes";
import { useUrlState } from "@/hooks/use-url-state";
import { formatCurrency } from "@/utils/format-data";
import EditProductInfo from "../components/edit-product-info";
import { NavigationBar } from "@/components/common/navigation-bar";

export default function CartPageView() {
  const [itemEditting, setItemEditting] = useState<CartItem | null>(null);
  const [idItemEditing, setIdItemEditting] = useUrlState("edit", "");
  const { items, cartSummary, clearCart } = useCart();
  const editBlock = useModal();

  useEffect(() => {
    if (items.every((item) => item.menu_item.product === undefined)) {
      clearCart();
    }
  }, [items]);

  useEffect(() => {
    const itemEditting = items.find(
      (item) => String(item.id) === String(idItemEditing),
    );

    if (itemEditting) {
      editBlock.openModal();
      setItemEditting(itemEditting);
    } else editBlock.closeModal();
  }, [idItemEditing, itemEditting, items]);

  return (
    <section className="flex relative flex-col h-[100dvh]">
      <NavigationBar
        backHref={APP_ROUTES.GUEST.ROOT}
        title="Túi hàng"
        className="[&_svg]:!text-[#8D1111] [&_h1]:text-[#8D1111] bg-[#FFFAEA]"
      />

      <CartItemsList
        items={items}
        className="max-h-[calc(100%-4rem)] min-h-[calc(100%-8rem)] overflow-y-scroll z-10"
      />

      <div className="w-full bottom-4 p-1.5 after:absolute after:inset-0 after:z-[-1] after:bg-[linear-gradient(90deg,rgba(255,250,234,0)_0%,rgba(255,250,234,0.3)_25.96%)] after:backdrop-blur-[20px] after:blur-[1px]">
        <Link href={APP_ROUTES.GUEST.CHECKOUT.VIEW}>
          <button
            disabled={
              cartSummary.item_count === 0 ||
              items.every((item) => !item.menu_item.product?.is_active)
            }
            className={cn(
              "w-full bg-[#8D1111] py-4 px-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed",
              delagothic.className,
            )}
          >
            <span className=" text-sm text-white ">
              {cartSummary.item_count === 0
                ? "Chưa có gì để chốt bà ơi !!!"
                : "Chốt đơn"}
              <span className={itim.className}>
                {cartSummary.item_count === 0
                  ? ""
                  : " - " + formatCurrency(cartSummary.subtotal)}
                {cartSummary.item_count > 0 &&
                  `  ( ${cartSummary.item_count} món )`}
              </span>
            </span>
          </button>
        </Link>
      </div>

      {editBlock.isOpen && itemEditting && (
        <EditProductInfo
          cartItem={itemEditting}
          onClose={() => {
            editBlock.closeModal();
            setIdItemEditting(undefined);
          }}
          onSubmit={() => {}}
        />
      )}
    </section>
  );
}

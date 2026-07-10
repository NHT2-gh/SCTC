"use client";
import React, { useEffect, useState } from "react";
import { CartItemsList, CartSummary } from "../components";
import { APP_ROUTES } from "@/config/app-routes";
import { NavigationBar } from "@/components/common/navigation-bar";
import { useRouter } from "next/navigation";
import { CartItem } from "@/types/cart";
import EditProductInfo from "../components/edit-product-info";
import { useUrlState } from "@/hooks/use-url-state";
import { useCart } from "@/hooks/use-cart";
import { useModal } from "@/hooks/useModal";
import { delagothic, itim } from "@/lib/fonts";
import { formatCurrency } from "@/utils/format-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CartPageView() {
  const [itemEditting, setItemEditting] = useState<CartItem | null>(null);
  const [idItemEditing, setIdItemEditting] = useUrlState("edit", "");
  const { items, cartSummary, count, clearCart } = useCart();
  const editBlock = useModal();
  const router = useRouter();

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
    <section className="flex relative flex-col h-[100vh]">
      <NavigationBar
        backHref={APP_ROUTES.GUEST.ROOT}
        title="Túi hàng"
        className="[&_svg]:!text-[#8D1111] [&_h1]:text-[#8D1111] bg-[#FFFAEA]"
      />

      <CartItemsList
        items={items}
        className="max-h-[calc(100vh-9rem)] overflow-y-scroll"
      />

      <div className="w-full sticky bottom-[0] p-1.5 after:absolute after:inset-0 after:z-[-1] after:bg-[linear-gradient(90deg,rgba(255,250,234,0)_0%,rgba(255,250,234,0.3)_25.96%)] after:backdrop-blur-[20px] after:blur-[1px]">
        <Link href={APP_ROUTES.GUEST.CHECKOUT.VIEW}>
          <button
            disabled={count === 0}
            className={cn(
              "w-full bg-[#8D1111] py-4 px-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed",
              delagothic.className,
            )}
          >
            <span className=" text-sm text-white ">
              {count === 0 ? "Chưa có gì để chốt bà ơi !!!" : "Chốt đơn"}
              <span className={itim.className}>
                {count === 0 ? "" : " -" + formatCurrency(cartSummary.subtotal)}
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

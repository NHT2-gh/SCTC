"use client";
import React, { useEffect, useState } from "react";
import { CartItemsList, CartSummary } from "../components";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { APP_ROUTES } from "@/config/app-routes";
import { NavigationBar } from "@/components/common/navigation-bar";
import { useRouter } from "next/navigation";
import { CartItem } from "@/types/cart";
import EditProductInfo from "../components/edit-product-info";
import { useUrlState } from "@/hooks/use-url-state";
import { useCart } from "@/hooks/use-cart";
import { useModal } from "@/hooks/useModal";

export default function CartPageView() {
  const [itemEditting, setItemEditting] = useState<CartItem | null>(null);
  const [idItemEditing, setIdItemEditting] = useUrlState("edit");
  const { items } = useCart();
  const editBlock = useModal();

  useEffect(() => {
    const itemEditting = items.find((item) => item.id == idItemEditing);

    if (itemEditting) {
      setItemEditting(itemEditting);
      editBlock.openModal();
    }
  }, [idItemEditing]);

  return (
    <section className="flex relative flex-col pb-4 h-screen">
      <NavigationBar
        backHref={APP_ROUTES.GUEST.ROOT}
        title="Túi hàng"
        className="[&_svg]:!text-[#8D1111] [&_h1]:text-[#8D1111]"
      />

      <CartItemsList items={items} />

      <CartSummary />
      <Link href={APP_ROUTES.GUEST.CHECKOUT.VIEW}>
        <Button className="w-full">Đặt hàng</Button>
      </Link>
      {editBlock.isOpen && (
        <EditProductInfo
          cartItem={itemEditting!}
          onClose={() => {
            editBlock.closeModal();
            setIdItemEditting(undefined);
          }}
          onSubmit={() => {
            console.log("ping");
          }}
        />
      )}
    </section>
  );
}

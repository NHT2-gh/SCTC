"use client";
import React from "react";
import { useCart } from "@/hooks/use-cart";
import { APP_ROUTES } from "@/config/app-routes";
import { CheckoutInfoForm } from "../components";
import { CartItemsList } from "../../cart/components";
import { NavigationBar } from "@/components/common/navigation-bar";

export default function CheckoutPageView() {
  const { items, cartSummary } = useCart();
  return (
    <section className="p-4 h-fit min-h-[100dvh] flex flex-col gap-3">
      <NavigationBar
        backHref={APP_ROUTES.GUEST.CART.VIEW}
        title="Checkout"
        className="[&_svg]:!text-[#8D1111] [&_h1]:text-[#8D1111] bg-[#FFFAEA]"
      />

      <CartItemsList
        items={items}
        className="max-h-[30vh] gap-4 overflow-y-scroll p-0 grow-0"
      />

      <p className="ml-auto">Tổng: {cartSummary.item_count} món</p>
      <hr />
      <CheckoutInfoForm />
    </section>
  );
}

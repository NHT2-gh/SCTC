"use client";
import React from "react";
import { CheckoutInfoForm } from "../components";
import { CartItemsList } from "../../cart/components";
import { useCart } from "@/hooks/use-cart";
import { NavigationBar } from "@/components/common/navigation-bar";
import { APP_ROUTES } from "@/config/app-routes";

export default function CheckoutPageView() {
  const { items, count } = useCart();
  return (
    <section className="p-4 h-full space-y-5">
      <NavigationBar
        backHref={APP_ROUTES.GUEST.CART.VIEW}
        title="Checkout"
        className="[&_svg]:!text-[#8D1111] [&_h1]:text-[#8D1111] bg-[#FFFAEA]"
      />
      <CartItemsList
        items={items}
        className="max-h-[30vh] gap-4 overflow-y-scroll p-0"
      />
      <hr />
      <CheckoutInfoForm />
    </section>
  );
}

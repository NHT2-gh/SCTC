"use client";
import React from "react";
import { CheckoutInfoForm } from "../components";
import { CartItemsList } from "../../cart/components";
import { useCart } from "@/hooks/use-cart";

export default function CheckoutPageView() {
  const { items } = useCart();
  return (
    <section className="p-4 h-full space-y-5">
      <h1>Checkout</h1>
      <CartItemsList items={items} />
      <hr />
      <CheckoutInfoForm />
    </section>
  );
}

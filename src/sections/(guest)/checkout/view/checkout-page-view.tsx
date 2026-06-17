"use client";
import React from "react";
import { CheckoutInfoForm } from "../components";
import { CartItemsList } from "../../cart/components";

export default function CheckoutPageView() {
  return (
    <section className="p-4 h-full space-y-5">
      <h1>Checkout</h1>
      <CartItemsList />
      <hr />
      <CheckoutInfoForm />
    </section>
  );
}

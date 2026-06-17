"use client";
import React from "react";
import { CartItemsList, CartSummary } from "../components";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { APP_ROUTES } from "@/config/app-routes";

export default function CartPageView() {
  return (
    <section className="p-4 h-screen flex flex-col gap-2">
      <h1>Giỏ hàng</h1>
      <CartItemsList />
      <CartSummary />
      <Link href={APP_ROUTES.GUEST.CHECKOUT.VIEW}>
        <Button>Đặt hàng</Button>
      </Link>
    </section>
  );
}

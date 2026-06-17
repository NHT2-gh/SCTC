"use client";
import { APP_ROUTES } from "@/config/app-routes";
import { useCart } from "@/hooks/use-cart";
import { CupSoda } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function FloatingCartButton() {
  const { count } = useCart();
  return (
    <Link
      className="fixed bottom-20 right-2 "
      href={APP_ROUTES.GUEST.CART.VIEW}
    >
      <button className="relative size-14 aspect-square rounded-full border bg-brand-500 flex justify-center items-center">
        <CupSoda className="size-7 text-white" />
        <span className="absolute -top-1 -left-2 bg-black text-white size-6 text-sm inline-flex justify-center items-center rounded-full aspect-square">
          {count}
        </span>
      </button>
    </Link>
  );
}

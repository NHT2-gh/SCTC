"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { IcCart } from "@/assets/svgs";
import { useCart } from "@/hooks/use-cart";
import { APP_ROUTES } from "@/config/app-routes";
import Link from "next/link";

export default function FloatingCartButton({
  className,
}: {
  className?: string;
}) {
  const { cartSummary, isLoading } = useCart();
  if (cartSummary.item_count === 0) {
    return null;
  }
  return (
    <Link href={APP_ROUTES.GUEST.CART.VIEW}>
      <button
        className={cn("fixed bottom-20 z-[50] right-4", {
          "animate-bounce": isLoading,
          className,
        })}
      >
        <IcCart
          style={{
            width: `${cartSummary.item_count + 53}`,
            height: `${cartSummary.item_count + 53}`,
          }}
          className=" text-white"
        />
        <span className="absolute -top-1 -left-2 bg-black text-white size-6 text-sm inline-flex justify-center items-center rounded-full aspect-square">
          {cartSummary.item_count}
        </span>
      </button>
    </Link>
  );
}

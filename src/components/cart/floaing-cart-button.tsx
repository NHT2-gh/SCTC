"use client";
import React, { useEffect } from "react";

import { cn } from "@/lib/utils";
import { IcCart } from "@/assets/svgs";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { APP_ROUTES } from "@/config/app-routes";
import Link from "next/link";

export default function FloatingCartButton({
  className,
}: {
  className?: string;
}) {
  const { count, isLoading } = useCart();
  const router = useRouter();
  if (count === 0) {
    return null;
  }
  return (
    <Link href={APP_ROUTES.GUEST.CART.VIEW}>
      <button
        className={cn("fixed bottom-6 z-[50] right-4", {
          "animate-bounce": isLoading,
          className,
        })}
      >
        <IcCart
          style={{
            width: `${count + 53}`,
            height: `${count + 53}`,
          }}
          className=" text-white"
        />
        <span className="absolute -top-1 -left-2 bg-black text-white size-6 text-sm inline-flex justify-center items-center rounded-full aspect-square">
          {count}
        </span>
      </button>
    </Link>
  );
}

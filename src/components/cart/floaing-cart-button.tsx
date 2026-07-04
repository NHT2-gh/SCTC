"use client";
import React, { useEffect } from "react";

import { cn } from "@/lib/utils";
import { IcCart } from "@/assets/svgs";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { APP_ROUTES } from "@/config/app-routes";

export default function FloatingCartButton({
  className,
}: {
  className?: string;
}) {
  const { count, isLoading } = useCart();
  const router = useRouter();
  useEffect(() => {
    if (count === 0) {
      return;
    }
  }, [count]);
  return (
    <button
      onClick={() => router.push(APP_ROUTES.GUEST.CART.VIEW)}
      className={cn("fixed bottom-20 z-[10] right-2", {
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
  );
}

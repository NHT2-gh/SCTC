"use client";
import { IcCart } from "@/assets/svgs";
import { APP_ROUTES } from "@/config/app-routes";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

export default function FloatingCartButton({
  className,
}: {
  className?: string;
}) {
  const { count, isLoading } = useCart();
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(APP_ROUTES.GUEST.CART.VIEW)}
      className={cn("fixed bottom-20 z-[10] right-2", {
        "animate-bounce": isLoading,
      })}
    >
      {/* <button className="relative p-3 aspect-square rounded-full bg-[#FEEEB8] flex justify-center items-center"> */}
      <IcCart className="size-14 text-white" />
      <span className="absolute -top-1 -left-2 bg-black text-white size-6 text-sm inline-flex justify-center items-center rounded-full aspect-square">
        {count}
      </span>
      {/* </button> */}
    </div>
  );
}

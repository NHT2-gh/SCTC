import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { delagothic } from "@/lib/fonts";

interface DrinkCardProps {
  item: Product;
  className?: string;
}

export default function MenuItemCard({ item, className }: DrinkCardProps) {
  return (
    <article
      className={cn("flex gap-4 w-full items-center bg-orange-50", className)}
    >
      <Image
        unoptimized
        src={
          item.image_url ? item.image_url[0] : "/images/logo/logo-text-1.webp"
        }
        alt={item.name}
        width={100}
        height={100}
        className="object-contain rounded-xl aspect-[1/1] w-[100px]"
      />
      <div className="space-y-2 grow">
        <h5
          className={cn(
            "font-medium leading-tight line-clamp-1 text-[1.25rem] text-[#8D1111]",
            delagothic.className,
          )}
        >
          {item.name}
        </h5>
        <p className={cn("line-clamp-2 text-sm text-black")}>
          {item.description || "Chưa có mô tả"}
        </p>
      </div>
      <p className={cn("text-xs text-[#8D1111]", delagothic.className)}>
        {item.selling_price / 1000}
      </p>
    </article>
  );
}

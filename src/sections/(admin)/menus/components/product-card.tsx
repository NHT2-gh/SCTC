import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatCurrency } from "@/utils/format-data";
import { cn } from "@/lib/utils";

interface DrinkCardProps {
  item: Product;
  className?: string;
}

export default function ProductCard({ item, className }: DrinkCardProps) {
  return (
    <article
      className={cn(
        "space-y-2 max-w-full p-2 bg-orange-50 rounded-xl flex gap-3 dark:bg-black/50 dark:text-white",
        className,
      )}
    >
      <Image
        src={
          item.image_url ? item.image_url[0] : "/images/logo/logo-text-1.webp"
        }
        alt="Drink"
        width={40}
        height={40}
        className="aspect-square object-cover rounded-xl size-[3.125rem]"
      />
      <div className="space-y-2">
        <h5 className="font-medium leading-tight line-clamp-2">{item.name}</h5>
        <p className="text-xs text-gray-600 line-clamp-2">
          {item.description || "Chưa có mô tả"}
        </p>

        <p className="text-sm text-brand-600">
          Profit: {formatCurrency(item.selling_price - item.cost)}
        </p>
      </div>
    </article>
  );
}

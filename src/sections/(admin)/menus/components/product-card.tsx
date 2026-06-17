import React from "react";
import Image from "next/image";
import { Product } from "@/types/menu";
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
        "space-y-2 max-w-[150px] p-2 bg-orange-50 rounded-xl",
        className,
      )}
    >
      <Image
        src={
          item.image_url ||
          "https://i.pinimg.com/webp/1200x/f3/bc/e4/f3bce49049ddbe09de3377999ddb0951.webp"
        }
        alt="Drink"
        width={100}
        height={100}
        className="aspect-square object-cover rounded-xl w-full"
      />
      <div className="space-y-2">
        <h5 className="font-medium leading-tight line-clamp-2">{item.name}</h5>
        <p className="text-xs text-gray-600">
          {item.description ||
            "Sử dụng cà phê mix Arabica và Robusta với tỉ lệ 3/7 và sữa đặc"}
        </p>

        <p className="text-sm">{formatCurrency(item.selling_price)} </p>
      </div>
    </article>
  );
}

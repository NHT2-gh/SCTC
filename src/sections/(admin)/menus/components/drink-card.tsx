import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Drink, MenuItem } from "@/types/menu";
import { formatCurrency } from "@/utils/format-data";

interface DrinkCardProps {
  item: MenuItem;
}

export default function DrinkCard({ item }: DrinkCardProps) {
  return (
    <article className="space-y-2 max-w-[150px] p-2 bg-orange-50 rounded-xl">
      <Image
        src={
          item.drinks.image_url ||
          "https://i.pinimg.com/webp/1200x/f3/bc/e4/f3bce49049ddbe09de3377999ddb0951.webp"
        }
        alt="Drink"
        width={100}
        height={100}
        className="aspect-square object-cover rounded-xl w-full"
      />
      <div className="space-y-2">
        <h5 className="font-medium leading-tight line-clamp-2">
          {item.drinks.name}
        </h5>
        <p className="text-xs text-gray-600">
          {item.drinks.description ||
            "Sử dụng cà phê mix Arabica và Robusta với tỉ lệ 3/7 và sữa đặc"}
        </p>

        <p className="text-sm">{formatCurrency(item.drinks.selling_price)} </p>
      </div>
    </article>
  );
}

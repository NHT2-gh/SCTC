import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Product } from "@/types/menu";
import { useRouter } from "next/navigation";
import { delagothic } from "@/lib/fonts";
import { APP_ROUTES } from "@/config/app-routes";

interface DrinkCardProps {
  item: Product;
  className?: string;
  onClick?: () => void;
}

export default function MenuItemCard({
  item,
  className,
  onClick,
}: DrinkCardProps) {
  return (
    <article
      onClick={() => onClick && onClick()}
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
          {item.description ||
            "Sử dụng cà phê mix Arabica và Robusta với tỉ lệ 3/7 và sữa đặc"}
        </p>
      </div>
      <p className={cn("text-xs text-[#8D1111]", delagothic.className)}>
        {item.selling_price / 1000}
      </p>
    </article>
  );
}

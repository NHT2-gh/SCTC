import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/types/menu";
import { showToast } from "@/lib/toast";
import { Switch } from "@/components/ui/switch";
import { APP_ROUTES } from "@/config/app-routes";
import { formatCurrency } from "@/utils/format-data";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { useUpdateProductInfo } from "@/hooks/queries/use-menu";

interface DrinkCardProps {
  item: MenuItem;
  className?: string;
  onChangeStatus: (id: string, value: boolean) => void;
}

export default function ProductCard({
  item,
  className,
  onChangeStatus,
}: DrinkCardProps) {
  const productInfo = item.product;

  return (
    <article
      className={cn(
        "space-y-2 max-w-full flex flex-col items-end justify-between p-2 bg-orange-50 rounded-xl  dark:bg-black/50 dark:text-white",
        className,
      )}
    >
      <Link
        href={APP_ROUTES.ADMIN.MENUS.ITEMS.DETAIL(item.menu_id, item.id)}
        className={cn("w-full ", {
          "opacity-50": !productInfo.is_active,
        })}
      >
        <div className="w-full flex items-center gap-3">
          <Image
            src={
              productInfo.image_url && productInfo.image_url.length > 0
                ? productInfo.image_url[0]
                : "/images/logo/logo-text-1.webp"
            }
            alt="Drink"
            width={40}
            height={40}
            className="aspect-square object-contain rounded-xl size-[3.125rem]"
          />
          <div className="space-y-2">
            <h5 className="font-medium leading-tight line-clamp-2">
              {productInfo.name}
            </h5>
            <p className="text-xs text-gray-600 line-clamp-1">
              {productInfo.description || "Chưa có mô tả"}
            </p>
            <span className="text-sm text-brand-600">
              {formatCurrency(productInfo.selling_price)}
            </span>
          </div>
        </div>
      </Link>
      <div className="w-full flex items-center justify-between">
        <p className="text-sm text-emerald-600">
          Profit:
          {formatCurrency(productInfo.selling_price - productInfo.cost)}
        </p>
        <Switch
          type="switch"
          handleOnChange={() =>
            onChangeStatus(productInfo.id, !productInfo.is_active)
          }
          value={productInfo.is_active}
        />
      </div>
    </article>
  );
}

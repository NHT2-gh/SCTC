import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatCurrency } from "@/utils/format-data";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useUpdateProductInfo } from "@/hooks/queries/use-menu";
import { MenuItem } from "@/types/menu";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { showToast } from "@/lib/toast";
import Link from "next/link";
import { APP_ROUTES } from "@/config/app-routes";

interface DrinkCardProps {
  item: MenuItem;
  className?: string;
}

export default function ProductCard({ item, className }: DrinkCardProps) {
  const updateMenuItem = useUpdateProductInfo(item.id);
  const productInfo = item.products;
  const handleUpdate = async (value: boolean) => {
    try {
      const result = await updateMenuItem.mutateAsync({
        id: item.id,
        is_active: value,
      });

      if (result.success) {
        showToast.success({ title: "Cập nhật thành công" });
      }
    } catch (error) {
      showToast.error({ title: "Lỗi", description: mapErrorToMessage(error) });
    }
  };
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
          "opacity-50": !item.products.is_active,
        })}
      >
        <div className="w-full flex items-center gap-3">
          <Image
            src={
              productInfo.image_url
                ? productInfo.image_url[0]
                : "/images/logo/logo-text-1.webp"
            }
            alt="Drink"
            width={40}
            height={40}
            className="aspect-square object-cover rounded-xl size-[3.125rem]"
          />
          <div className="space-y-2">
            <h5 className="font-medium leading-tight line-clamp-2">
              {productInfo.name}
            </h5>
            <p className="text-xs text-gray-600 line-clamp-1">
              {productInfo.description || "Chưa có mô tả"}
            </p>

            <p className="text-sm text-brand-600">
              Profit:
              {formatCurrency(productInfo.selling_price - productInfo.cost)}
            </p>
          </div>
        </div>
      </Link>
      <Switch
        onChange={(value: boolean) => handleUpdate(value)}
        value={productInfo.is_active}
      />
    </article>
  );
}

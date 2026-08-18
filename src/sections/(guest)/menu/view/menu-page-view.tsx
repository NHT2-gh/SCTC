"use client";
import React, { useMemo } from "react";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MenuLayoutItem } from "@/types/menu";
import { APP_ROUTES } from "@/config/app-routes";
import { MenuItemCard } from "@/components/menu";
import { useUrlState } from "@/hooks/use-url-state";
import CategoryTabs from "../components/category-tabs";
import CurrentOrders from "../components/current-orders";
import FloatingCartButton from "@/components/cart/floaing-cart-button";
import { FloatingHelpButton } from "@/components/floading-help-button";

interface MenuPageViewProps {
  menuLayout: MenuLayoutItem[];
}

export default function MenuPageView({ menuLayout }: MenuPageViewProps) {
  const [page, setPage] = useUrlState<number>("page", 1);

  const max_y = useMemo(() => {
    const itemMax = menuLayout
      .filter((item) => Number(item.page) === Number(page))
      .map((item) => item.y + item.h + 50);

    return itemMax.length > 0 ? Math.max(...itemMax) : 0;
  }, [menuLayout, page]);

  return (
    <section className="pt-4 bg-[#FFFAEA] min-w-[375px] min-h-[100vh] h-fit relative after:absolute after:inset-0 after:content-['']  after:bg-[url('/images/backgrounds/bg-menu.webp')] after:bg-cover after:bg-no-repeat after:opacity-10">
      <div className="pl-[3.125rem] pr-5 mb-4 flex justify-between">
        <div
          className="bg-[url('/images/logo/logo-text.webp')] w-[7rem] aspect-[93/56] bg-cover bg-center bg-no-repeat relative before:absolute before:top-3 before:left-[-3.125rem] before:bg-[url('/images/logo/logo-left-hand.webp')] before:bg-cover before:bg-center before:bg-no-repeat before:aspect-square before:size-[4.5rem]
          after:absolute after:-top-4 after:right-[-3.125rem] after:w-[4rem] after:aspect-[81/67] after:bg-[url('/images/logo/logo-right-hand.webp')] after:bg-cover after:bg-center after:bg-no-repeat
        "
        />

        <Image
          src={"/images/logo/menu-text.webp"}
          alt="Menu Title"
          width={108}
          height={60}
          className="w-[108px] aspect-[108/60] object-contain"
        />
      </div>
      <div className={cn("mx-auto w-full overflow-hidden p-4 h-fit")}>
        <CategoryTabs
          value={Number(page)}
          onSelected={(page) => setPage(Number(page))}
        />
        <div className={cn("relative")} style={{ height: max_y }}>
          {menuLayout
            .filter((item) => Number(item.page) === Number(page))
            .map((item) => (
              <div
                key={item.id}
                className={cn(
                  "w-full overflow-hidden z-1 rounded-xl flex flex-col items-center hover:opacity-80",
                  {
                    "pointer-events-none opacity-30":
                      !item.menu_items.products.is_active,
                  },
                )}
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  top: item.y,
                  left: item.x,
                  minWidth: item.w,
                  right: item.x,
                  height: item.h,
                }}
              >
                <Link
                  className="block w-full"
                  href={APP_ROUTES.GUEST.PRODUCT.VIEW_DETAIL(
                    item.menu_items.id,
                  )}
                >
                  <MenuItemCard
                    item={item.menu_items.products}
                    className={cn("bg-transparent", {
                      "flex-row-reverse text-right": item.x > 1,
                    })}
                  />
                </Link>
              </div>
            ))}
        </div>
      </div>

      <CurrentOrders />

      <FloatingCartButton />
    </section>
  );
}

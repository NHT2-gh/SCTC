"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MenuLayoutItem } from "@/types/menu";
import { MenuItemCard } from "@/components/menu";
import { APP_ROUTES } from "@/config/app-routes";
import useWindowSize from "@/hooks/use-window-size";

interface MenuPageViewProps {
  menuLayout: MenuLayoutItem[];
}

export default function MenuPageView({ menuLayout }: MenuPageViewProps) {
  const windowSize = useWindowSize();
  return (
    <section className="pt-4 bg-[#FFFAEA] after:absolute after:inset-0 after:content-['']  after:bg-[url('/images/backgrounds/bg-menu.webp')] after:bg-cover after:bg-no-repeat after:opacity-10">
      <div className="px-[3.125rem] mb-4">
        <div
          className="bg-[url('/images/logo/logo-text.webp')] w-[7rem] aspect-[93/56] bg-cover bg-center bg-no-repeat relative before:absolute before:top-3 before:left-[-3.125rem] before:bg-[url('/images/logo/logo-hand-2.webp')] before:bg-cover before:bg-center before:bg-no-repeat before:aspect-square before:size-[4.125rem]
          after:absolute after:-top-4 after:right-[-3.125rem] after:w-[3.125rem] after:aspect-[81/67] after:bg-[url('/images/logo/logo-hand-1.webp')] after:bg-cover after:bg-center after:bg-no-repeat
        "
        />
      </div>
      <div className={cn("w-[375px] mx-auto overflow-hidden p-4 h-screen")}>
        <div className="relative">
          {menuLayout
            .filter((item) => item.x < windowSize.width)
            .map((item) => (
              <div
                key={item.id}
                className="overflow-hidden z-1 rounded-xl flex flex-col items-center hover:opacity-80"
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  top: item.y,
                  left: item.x,
                  width: item.w,
                  height: item.h,
                }}
              >
                <Link
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
    </section>
  );
}

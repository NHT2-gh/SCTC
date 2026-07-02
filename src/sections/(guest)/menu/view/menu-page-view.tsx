"use client";
import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MenuLayoutItem } from "@/types/menu";
import { MenuItemCard } from "@/components/menu";
import { APP_ROUTES } from "@/config/app-routes";
import useWindowSize from "@/hooks/use-window-size";
import FloatingCartButton from "@/components/cart/floaing-cart-button";
import Image from "next/image";
import CategoryTabs from "../components/category-tabs";
import CurrentOrders from "../components/current-orders";

interface MenuPageViewProps {
  menuLayout: MenuLayoutItem[];
}

export default function MenuPageView({ menuLayout }: MenuPageViewProps) {
  const [page, setPage] = useState<number>(1);

  return (
    <>
      <section className="pt-4 bg-[#FFFAEA] relative after:absolute after:inset-0 after:content-['']  after:bg-[url('/images/backgrounds/bg-menu.webp')] after:bg-cover after:bg-no-repeat after:opacity-10">
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
        <div
          className={cn(
            "min-w-[375px] w-full mx-auto overflow-hidden p-4 h-screen",
          )}
        >
          <CategoryTabs onSelected={(page) => setPage(page)} />
          <div className="relative">
            {menuLayout
              .filter((item) => item.page === page && item.x < 10)
              .map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden z-1 rounded-xl flex flex-col items-center hover:opacity-80"
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: item.y,
                    left: item.x,
                    minWidth: item.w,
                    width: "fit-content",
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

        <CurrentOrders />

        <FloatingCartButton />
      </section>
    </>
  );
}

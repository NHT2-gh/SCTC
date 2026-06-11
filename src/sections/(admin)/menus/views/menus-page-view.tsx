"use client";
import React from "react";
import { MenuType } from "@/types/menu";
import { useGetMenus } from "@/hooks/queries/use-menu";
import { MainContainer } from "@/components/common/page-layout";
import { MenuCard } from "../components";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/config/app-routes";

export default function MenusPageView() {
  const { data: menus } = useGetMenus();
  const router = useRouter();
  return (
    <MainContainer title={"Quản lý Menu"}>
      <div className="space-y-4">
        {menus?.data.map((item) => (
          <MenuCard
            key={item.id}
            menuData={item}
            onView={(id) => router.push(APP_ROUTES.ADMIN.MENUS.DETAIL(id))}
          />
        ))}
      </div>
    </MainContainer>
  );
}

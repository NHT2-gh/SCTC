import { MenusPageView } from "@/sections/(admin)/menus/view";
import { MenuType } from "@/types/menu";
import React from "react";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  return <MenusPageView type={type as MenuType} />;
}

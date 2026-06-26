import { serverActionGetMenuItemInfo } from "@/lib/server-action/menu.action";
import { MenuItemDetailPageView } from "@/sections/(admin)/menus/views";
import { notFound } from "next/navigation";
import React from "react";

export default async function MenuItemDetailPage({
  params,
}: {
  params: Promise<{ menu_item_id: string }>;
}) {
  const { menu_item_id } = await params;
  const menuItemInfo = await serverActionGetMenuItemInfo(menu_item_id);

  if (!menuItemInfo.data) return notFound();

  return <MenuItemDetailPageView data={menuItemInfo.data} />;
}

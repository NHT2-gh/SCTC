import React from "react";
import { MenuDetailPageView } from "@/sections/(admin)/menus/views";
import { MenuType } from "@/types/menu";

export default async function MenuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MenuDetailPageView id={id} />;
}

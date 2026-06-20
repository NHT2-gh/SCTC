import { serverActionGetMenuItemInfo } from "@/lib/server-action/menu.action";
import { ProductPageView } from "@/sections/(guest)/products/view";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ menu_item_id: string }>;
}) {
  const { menu_item_id } = await params;
  const { data, success } = await serverActionGetMenuItemInfo(menu_item_id);

  if (!success || !data) return notFound();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductPageView product={data} />
    </Suspense>
  );
}

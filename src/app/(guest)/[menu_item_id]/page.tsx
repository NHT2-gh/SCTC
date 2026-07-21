import LoadingPageView from "@/components/common/loading/loading-page-view";
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

  return (
    <Suspense fallback={<LoadingPageView />}>
      <ProductPageView menu_item_id={menu_item_id} />
    </Suspense>
  );
}

import React, { Suspense } from "react";
import { MainContentProductPage } from "../components";
import LoadingPageView from "@/components/common/loading/loading-page-view";
import { serverActionGetMenuItemInfo } from "@/lib/server-action/menu.action";
import { notFound } from "next/navigation";

interface ProductPageViewProps {
  menu_item_id: string;
}

export default async function ProductPageView({
  menu_item_id,
}: ProductPageViewProps) {
  const { data, success } = await serverActionGetMenuItemInfo(menu_item_id);

  if (!success || !data) return notFound();
  return (
    <Suspense fallback={<LoadingPageView />}>
      <MainContentProductPage product={data} />
    </Suspense>
  );
}

import LoadingPageView from "@/components/common/loading/loading-page-view";
import { serverActionGetMenuLayoutPublic } from "@/lib/server-action/menu.action";
import { MenuPageView } from "@/sections/(guest)/menu/view";
import { Suspense } from "react";

export default async function HomePage() {
  const { data } = await serverActionGetMenuLayoutPublic();
  return (
    <Suspense fallback={<LoadingPageView />}>
      <MenuPageView menuLayout={data || []} />
    </Suspense>
  );
}

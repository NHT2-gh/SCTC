import LoadingPageView from "@/components/common/loading/loading-page-view";
import { serverActionGetMenuLayoutPublic } from "@/lib/server-action/menu.action";
import { MenuPageView } from "@/sections/(guest)/menu/view";
import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";

export default async function HomePage() {
  noStore();
  const { data } = await serverActionGetMenuLayoutPublic();

  return (
    <Suspense fallback={<LoadingPageView />}>
      <MenuPageView menuLayout={data || []} />
    </Suspense>
  );
}

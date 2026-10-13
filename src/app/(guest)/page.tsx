import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { MenuPageView } from "@/sections/(guest)/menu/view";
import { serverActionGetMenuLayoutPublic } from "@/lib/server-action/menu.action";
import LoadingPageView from "@/components/common/loading/loading-page-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  noStore();
  const { data } = await serverActionGetMenuLayoutPublic();

  return (
    <Suspense fallback={<LoadingPageView />}>
      <MenuPageView menuLayout={data || []} />
    </Suspense>
  );
}

import LoadingPageView from "@/components/common/loading/loading-page-view";
import { CartPageView } from "@/sections/(guest)/cart/view";
import React, { Suspense } from "react";

export default function Cartpage() {
  return (
    <Suspense fallback={<LoadingPageView />}>
      <CartPageView />
    </Suspense>
  );
}

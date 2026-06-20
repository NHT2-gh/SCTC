import { CartPageView } from "@/sections/(guest)/cart/view";
import React, { Suspense } from "react";

export default function Cartpage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartPageView />
    </Suspense>
  );
}

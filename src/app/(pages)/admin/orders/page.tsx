import React, { Suspense } from "react";
import { OrdersPageView } from "@/sections/(admin)/orders/view";

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersPageView />
    </Suspense>
  );
}

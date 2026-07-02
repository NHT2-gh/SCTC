import React, { useEffect } from "react";
import { useOrderHistory } from "@/hooks/use-order";

export default function CurrentOrders() {
  const { activeOrders } = useOrderHistory();

  useEffect(() => {
    if (activeOrders.length === 0) {
      return;
    }
  }, [activeOrders]);
  return (
    <div
      slot="bottom"
      className="max-w-[385px] w-full mx-auto h-fit fixed bottom-5 left-4 right-4 z-[100] flex justify-center bg-brand-800 rounded-full p-2"
    >
      {activeOrders.length > 0 && (
        <p className="text-white">
          Ỏooo, cục dàng đang có {activeOrders.length} đơn á nha !!!
        </p>
      )}
    </div>
  );
}

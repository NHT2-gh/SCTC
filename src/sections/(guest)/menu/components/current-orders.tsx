import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { OrderStatus } from "@/types/order";
import { APP_ROUTES } from "@/config/app-routes";
import { formatCurrency } from "@/utils/format-data";
import { useOrderHistory } from "@/hooks/use-order";

export default function CurrentOrders() {
  const { activeOrders } = useOrderHistory();
  const [view, setView] = useState(false);
  if (!activeOrders || activeOrders.length === 0) return null;

  return (
    <div
      slot="bottom"
      className="max-w-[340px] w-full mx-auto fixed bottom-5 left-4 right-4 z-[100] bg-brand-800 rounded-3xl py-3 px-4"
    >
      <button
        onClick={() => setView(!view)}
        className="text-white w-full flex items-center justify-between gap-2"
      >
        <p className="text-nowrap text-sm">
          Ỏooo, cục dàng đang có {activeOrders.length} đơn á nha !!!
        </p>

        <ChevronDown
          color="white"
          className={cn("hover:cursor-pointer", { "rotate-180": view })}
        />
      </button>

      {view && activeOrders.length > 0 && (
        <div className="space-4">
          <button className={cn("mt-2 w-full space-y-2")}>
            {activeOrders.map((order) => (
              <Link
                key={order.order_id}
                className={cn("block")}
                href={APP_ROUTES.GUEST.ORDER.VIEW(order.tracking_order)}
              >
                <div
                  className={cn(
                    "flex items-center justify-between bg-amber-50 rounded-2xl p-2",
                    {
                      "line-through": order.status === OrderStatus.CANCELLED,
                    },
                  )}
                >
                  <p className="text-base">
                    No: <span>{order.tracking_order}</span>
                  </p>

                  <p>
                    {formatCurrency(order.subtotal)} {" ("}
                    {order.order_items_count} {" món)"}
                  </p>
                </div>
              </Link>
            ))}
          </button>
        </div>
      )}
    </div>
  );
}

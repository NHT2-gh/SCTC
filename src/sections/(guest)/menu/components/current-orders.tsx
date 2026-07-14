import React from "react";
import { useOrderHistory } from "@/hooks/use-order";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format-data";
import Link from "next/link";
import { APP_ROUTES } from "@/config/app-routes";
import { OrderStatus } from "@/types/order";

export default function CurrentOrders() {
  const { activeOrders } = useOrderHistory();
  const [view, setView] = useState(false);

  if (activeOrders && activeOrders.length === 0) {
    return;
  }
  return (
    <div
      slot="bottom"
      className="max-w-[340px] w-full mx-auto h-fit fixed bottom-5 left-4 right-4 z-[100] bg-brand-800 rounded-3xl py-2 px-2"
    >
      <button
        onClick={() => setView(!view)}
        className="text-white w-full flex items-center justify-between gap-2 px-4"
      >
        <p className="text-nowrap text-sm">
          Ỏooo, cục dàng đang có {activeOrders.length} đơn á nha !!!
        </p>

        <ChevronDown
          color="white"
          className={cn("hover:cursor-pointer", { "rotate-180": view })}
        />
      </button>
      {activeOrders.length > 0 && (
        <button className={cn("mt-2 w-full space-y-2", { hidden: !view })}>
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
                  {order.order_items_count} {" items)"}
                </p>
              </div>
            </Link>
          ))}
        </button>
      )}

      {/* <button onClick={() => clearOrders()}>Clear</button> */}
    </div>
  );
}

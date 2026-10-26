import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReceiptText } from "lucide-react";
import { APP_ROUTES } from "@/config/app-routes";
import { useOrderHistory } from "@/hooks/use-order";
import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";

export default function CurrentOrders() {
  const { activeOrders } = useOrderHistory();
  if (!activeOrders || activeOrders.length === 0) return null;

  return (
    <div
      slot="bottom"
      className="flex items-center max-w-[500px] w-full mx-auto fixed bottom-5 left-0 right-0 z-[100] rounded-3xl px-7 [&_button]:-ml-4 "
    >
      <hr className="border border-brand-500 w-full absolute top-0 left-0" />
      {activeOrders.map((item, idx) => (
        <Link
          key={item.order_id}
          target="_blank"
          href={APP_ROUTES.GUEST.ORDER.VIEW(item.tracking_order)}
        >
          <button
            className={cn(
              "text-white w-fit group z-10 relative mt-1.5 shadow-2xl rounded-xl p-2 transition-colors duration-300 before:absolute before:-top-2.5 before:content-[''] before:h-2.5 before:w-4 before:rounded-tl-md before:rounded-tr-md before:bg-neutral-500 before:-translate-x-1/2",
              `bg-blue-${(idx + 2) * 100}`,
            )}
          >
            <ReceiptText className="text-black" />
          </button>
        </Link>
      ))}
    </div>
  );
}

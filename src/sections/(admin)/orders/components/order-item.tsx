import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";
import { Button } from "@/components/ui/button";
import { useUpdateOrderStatus } from "@/hooks/queries/use-order";
import { cn } from "@/lib/utils";
import { DeliveryMethod } from "@/types/checkout";
import { Order, OrderItem, OrderStatus } from "@/types/order";
import { formatCurrency, formatDateTime } from "@/utils/format-data";
import React from "react";

interface OrderItemCardProp {
  order: Order;
  onSelected: (orderId: string) => void;
  onConfirm: (orderId: string) => void;
}
export default function OrderItemCard({
  order,
  onSelected,
  onConfirm,
}: OrderItemCardProp) {
  return (
    <article
      onClick={() => onSelected(order.tracking_order)}
      className="border rounded-lg p-4 cursor-pointer"
    >
      <div className="flex justify-between">
        <p>No: {order.tracking_order}</p>
        <div className="capitalize flex gap-3 items-center">
          <span
            className={cn("size-4 rounded-full block", {
              "animate-ping":
                _product_setting.processOrder[order.status].value < 5,
            })}
            style={{
              backgroundColor:
                _product_setting.processOrder[order.status].color,
            }}
          />
          <span>{_product_setting.processOrder[order.status].label}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Total items:
        <span className="capitalize">{order.order_items_count}</span>
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Total price: {formatCurrency(order.subtotal)}
      </p>

      <p className="text-sm text-muted-foreground mt-2">
        Delivery method: {DeliveryMethod[order.delivery_method]}
      </p>

      <p className="text-sm text-muted-foreground mt-2">
        Pickup time: {formatDateTime(order.pick_up_time, { withTime: true })}
      </p>

      {order.status === OrderStatus.PENDING && (
        <Button size="sm" className="mt-4" onClick={() => onConfirm(order.id)}>
          Confirm order
        </Button>
      )}
    </article>
  );
}

import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";
import { Button } from "@/components/ui/button";
import { useUpdateOrderStatus } from "@/hooks/queries/use-order";
import { cn } from "@/lib/utils";
import { DeliveryMethod, DeliveryMethodMapText } from "@/types/checkout";
import { MapTextPaymentMethod, Order, OrderStatus } from "@/types/order";
import {
  formatCurrency,
  formatDateTime,
  formatDateTimev2,
} from "@/utils/format-data";
import React from "react";

interface OrderItemCardProp {
  order: Order;
  onSelected: (orderId: string) => void;
  onViewed: (trackingCode: string) => void;
  onConfirm: (orderId: string) => void;
  onCancel: (orderId: string) => void;
}
export default function OrderItemCard({
  order,
  onSelected,
  onViewed,
  onConfirm,
  onCancel,
}: OrderItemCardProp) {
  return (
    <article
      className={cn("border flex flex-col rounded-lg p-4 h-full", {
        "border-brand-500 ": order.tables?.id,
      })}
    >
      <ul
        className="cursor-pointer text-sm text-muted-foreground grow"
        onClick={() => {
          onSelected(order.id);
        }}
        onDoubleClick={() => onViewed(order.tracking_order)}
      >
        <li className="text-base font-bold capitalize flex gap-3 justify-between items-center">
          <span>No: {order.tracking_order}</span>
          <div className="flex items-center gap-3">
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
        </li>
        {order.tables?.name && (
          <li>
            <span className="capitalize">{order.tables?.name}</span>
          </li>
        )}
        <li className="flex items-center gap-2">
          <p>Customer Name:</p> <span>{order.customer_name}</span>
        </li>
        <li>Delivery method: {DeliveryMethodMapText[order.delivery_method]}</li>
        <li>Payment method: {MapTextPaymentMethod[order.payment_method]}</li>
        <li>
          Created at: {formatDateTime(order.created_at, { withTime: true })}
        </li>
        <li>
          Pickup time:
          {order.delivery_method === "pre_order"
            ? formatDateTimev2(order.pick_up_time, { withTime: true })
            : formatDateTime(order.created_at, { withTime: true })}
        </li>
        {order.notes && (
          <li className="whitespace-pre-line">Note: {order.notes}</li>
        )}
      </ul>

      <div className="flex gap-1 justify-end font-semibold text-brand-500 text-base">
        {formatCurrency(order.subtotal)} {" ("}
        <span className="capitalize">{order.order_items_count || 0}</span>
        {" items )"}
      </div>

      {order.status === OrderStatus.PENDING && (
        <div className="flex justify-between">
          <Button
            size="sm"
            variant={"outline"}
            className="mt-4"
            onClick={() => onCancel(order.id)}
          >
            Cancel order
          </Button>
          <Button
            size="sm"
            className="mt-4"
            onClick={() => onConfirm(order.id)}
          >
            Confirm order
          </Button>
        </div>
      )}
    </article>
  );
}

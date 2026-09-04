import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";
import ModalAlert from "@/components/modal/alerts/modal-alert";
import { Button } from "@/components/ui/button";
import { useGetDetailOrder } from "@/hooks/queries/use-order";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { DeliveryMethod, DeliveryMethodMapText } from "@/types/checkout";
import { Order, OrderStatus } from "@/types/order";
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
  const { data: detailOrder, refetch } = useGetDetailOrder(
    order.tracking_order,
  );

  return (
    <>
      <article className={cn("border flex flex-col rounded-lg h-full ")}>
        <div
          className={cn(
            "bg-neutral-200 p-2 flex items-center justify-between",
            {
              "bg-green-200 text-black": order.tables?.id,
            },
            {
              "bg-warning-100 text-black":
                order.delivery_method === DeliveryMethod.pre_order,
            },
          )}
        >
          <span className="font-bold">
            {order.tracking_order} {" - "}{" "}
            {order.tables?.id ? (
              <span>{order.tables?.name}</span>
            ) : (
              <span>{DeliveryMethodMapText[order.delivery_method]}</span>
            )}
          </span>
        </div>
        <div className="p-2 space-y-2">
          <ul
            className="cursor-pointer text-sm text-muted-foreground grow [&_li]:flex [&_li]:items-center [&_li]:gap-2"
            onClick={() => {
              onSelected(order.id);
            }}
            onDoubleClick={() => onViewed(order.tracking_order)}
          >
            <li className="flex items-center justify-between">
              <span>{order.customer_name}</span>

              <span className="text-xs italic">
                {order.delivery_method === DeliveryMethod.pre_order
                  ? formatDateTimev2(order.pick_up_time, { withTime: true })
                  : formatDateTime(order.created_at, { withTime: true })}
              </span>
            </li>

            <ul>
              {detailOrder?.data.items.map((item) => (
                <li key={item.order_item.id} className="flex justify-between">
                  <span className="flex flex-col">
                    <span className="font-semibold"> {item.product.name}</span>

                    <ul className="flex gap-1 text-xs text-neutral-600">
                      {item.order_item.options?.map((option, index) => (
                        <li
                          className="inline "
                          key={option.id + item.order_item.id + index}
                        >
                          {option.name}
                          {index !== item.order_item.options?.length - 1 && ","}
                        </li>
                      ))}
                    </ul>
                  </span>
                  <span>{item.order_item.quantity}</span>
                </li>
              ))}
            </ul>

            {order.notes && (
              <li className="w-full whitespace-pre-line text-sm text-neutral-600 italic">
                {'"'} {order.notes} {'"'}
              </li>
            )}

            <li className="capitalize font-semibold text-brand-500 justify-between mt-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn("size-2 rounded-full block", {
                    "animate-ping":
                      _product_setting.processOrder[order.status].value < 5,
                  })}
                  style={{
                    backgroundColor:
                      _product_setting.processOrder[order.status].color,
                  }}
                />
                <span className="text-neutral-700">
                  {_product_setting.processOrder[order.status].label}
                </span>
              </div>
              {formatCurrency(order.total)} {" ("}
              {order.order_items_count || 0} {" )"}
            </li>
          </ul>

          {order.status === OrderStatus.PENDING && (
            <div className="flex justify-between">
              <Button
                size="sm"
                variant={"outline"}
                onClick={() => onCancel(order.id)}
              >
                Cancel order
              </Button>
              <Button size="sm" onClick={() => onConfirm(order.id)}>
                Confirm order
              </Button>
            </div>
          )}
        </div>
      </article>
    </>
  );
}

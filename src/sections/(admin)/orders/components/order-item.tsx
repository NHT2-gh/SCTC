import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";
import ModalAlert from "@/components/modal/alerts/modal-alert";
import { Button } from "@/components/ui/button";
import {} from "@/hooks/queries/use-order";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { DeliveryMethodMapText } from "@/types/checkout";
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
  const modalAlert = useModal();

  return (
    <>
      <article
        className={cn("border flex flex-col rounded-lg p-4 h-full", {
          "border-brand-500 ": order.tables?.id,
        })}
      >
        <ul
          className="cursor-pointer text-sm text-muted-foreground grow [&_li]:flex [&_li]:items-center [&_li]:gap-2"
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
          <li>
            <p>Customer Name:</p> <span>{order.customer_name}</span>
          </li>

          <li>
            <p>Delivery method:</p>
            <span> {DeliveryMethodMapText[order.delivery_method]}</span>
          </li>
          <li>
            <p>Payment method:</p>
            <span> {MapTextPaymentMethod[order.payment_method]}</span>
          </li>
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

        <ul className="flex  gap-1 items-center justify-between font-semibold text-brand-500 text-base">
          <li className="text-green-600">
            + {formatCurrency(order.total - (order.cost_snapshot || 0))}
          </li>
          <li className="capitalize">
            $ {formatCurrency(order.total)} {" ("}
            {order.order_items_count || 0} {" )"}
          </li>
        </ul>

        {order.status === OrderStatus.PENDING && (
          <div className="flex justify-between">
            <Button
              size="sm"
              variant={"outline"}
              className="mt-4"
              onClick={() => modalAlert.openModal()}
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

      {modalAlert.isOpen && (
        <ModalAlert
          isOpen={modalAlert.isOpen}
          onClose={modalAlert.closeModal}
          type={"warning"}
          title={"Are you sure you want to cancel this order?"}
          description={"This action cannot be undone"}
          onConfirm={() => {
            onCancel(order.id);
            modalAlert.closeModal();
          }}
          confirmText={"Cancel order"}
        />
      )}
    </>
  );
}

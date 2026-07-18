"use client";
import { Button } from "@/components/ui/button";
import Modal, { ModalProps } from "@/components/ui/modal/modal";
import { useGetDetailOrder } from "@/hooks/queries/use-order";
import { OrderStatus } from "@/types/order";
import React, { useEffect } from "react";
import OrderDetail from "./order-detail";
import { cn } from "@/lib/utils";
import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";

interface ModalViewOrder extends Omit<ModalProps, "children"> {
  trackingCode: string;
  onUpdateStatus: (order_id: string[], status: OrderStatus) => void;
}

export default function ModalViewOrder({
  trackingCode,
  isOpen,
  onClose,
  onUpdateStatus,
}: ModalViewOrder) {
  const { data: order, refetch } = useGetDetailOrder(trackingCode);
  useEffect(() => {
    refetch();
  }, [trackingCode]);

  if (!order?.success) return;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="pt-0 bg-white">
      <div className="p-4 space-y-4">
        <div className="capitalize flex gap-3 items-center justify-center">
          <span
            className={cn("size-4 rounded-full block", {
              "animate-ping":
                _product_setting.processOrder[order.data.order.status].value <
                5,
            })}
            style={{
              backgroundColor:
                _product_setting.processOrder[order.data.order.status].color,
            }}
          />
          <span>
            {_product_setting.processOrder[order.data.order.status].label}
          </span>
        </div>

        <OrderDetail data={order.data} />
      </div>

      {_product_setting.processOrder[order.data.order.status].value < 5 && (
        <Button
          className="block mx-auto mt-5"
          onClick={async () => {
            await onUpdateStatus(
              [order.data.order.id],
              Object.keys(_product_setting.processOrder)[
                _product_setting.processOrder[order.data.order.status].value + 1
              ] as OrderStatus,
            );
            await refetch();
          }}
        >
          Next status :{" "}
          {
            Object.values(_product_setting.processOrder)[
              _product_setting.processOrder[order.data.order.status].value + 1
            ]?.label
          }
        </Button>
      )}
    </Modal>
  );
}

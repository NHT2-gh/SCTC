"use client";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import OrderDetail from "./order-detail";
import { OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import { useGetDetailOrder } from "@/hooks/queries/use-order";
import Modal, { ModalProps } from "@/components/ui/modal/modal";
import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";
import ApplyPromotions from "./apply-promotions";
import { TableDropdown } from "@/components/common/table-dropdown";
import { Settings2Icon } from "lucide-react";
import { DropdownItem } from "@/components/ui/dropdown";

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
    <Modal
      isFullScreen
      isOpen={isOpen}
      onClose={onClose}
      className="md:max-w-[60vw]"
    >
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

        <ApplyPromotions orderDetail={order.data} />
      </div>

      {_product_setting.processOrder[order.data.order.status].value < 5 && (
        <Button
          className="block mx-auto"
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

      <TableDropdown
        dropdownButton={
          <Button
            variant="outline"
            className="text-gray-500 dark:text-gray-400"
          >
            <Settings2Icon />
          </Button>
        }
        dropdownContent={
          <>
            <DropdownItem
              onItemClick={() => {
                async () => {
                  await onUpdateStatus(
                    [order.data.order.id],
                    OrderStatus.CANCELLED,
                  );
                  await refetch();
                };
              }}
            >
              Cancel Order
            </DropdownItem>
          </>
        }
      />
    </Modal>
  );
}

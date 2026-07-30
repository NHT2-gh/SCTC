"use client";
import { useCallback, useEffect, useState } from "react";
import { OrderDetail } from "@/types/order";
import { orderService } from "@/services/order.service";
import { Bill } from "@/sections/(guest)/order/components";
import Modal, { ModalProps } from "@/components/ui/modal/modal";

interface ModalViewExportBillsProps extends Omit<ModalProps, "children"> {
  trackingCodes: string[];
}

export default function ModalViewExportBills({
  isOpen,
  onClose,
  trackingCodes,
}: ModalViewExportBillsProps) {
  const [bills, setBills] = useState<OrderDetail[]>([]);

  const getBillsInfo = useCallback(async (trackingCodes: string[]) => {
    setBills([]);
    try {
      const data = await Promise.all(
        trackingCodes.map(async (trackingCode) => {
          const { data: orderDetail } =
            await orderService.getOrderDetail(trackingCode);
          if (orderDetail.order) {
            setBills((prev) => [...prev, orderDetail]);
          }
        }),
      );

      if (data.length === 0) return false;

      return true;
    } catch {
      return false;
    }
  }, []);
  useEffect(() => {
    if (isOpen) {
      const result = getBillsInfo(trackingCodes);

      if (!result) return;
    }
  }, [isOpen, trackingCodes]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {bills && bills.length > 0 ? (
        bills?.map((item) => <Bill key={item.order.id} data={item} />)
      ) : (
        <p>No bills found</p>
      )}
    </Modal>
  );
}

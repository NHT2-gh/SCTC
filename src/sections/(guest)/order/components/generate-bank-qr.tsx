"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { OrderStatus, PaymentMethod, PaymentType } from "@/types/order";
import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";
import { showToast } from "@/lib/toast";

interface GenerateBankQrProps {
  orderIds: string[];
  tableId: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
}

export default function GenerateBankQr({
  orderIds,
  status,
  paymentMethod,
}: GenerateBankQrProps) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const handlePayment = useCallback(async () => {
    try {
      const result = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: orderIds,
          paymentType:
            orderIds.length === 1 ? PaymentType.INDIVIDUAL : PaymentType.GROUP,

          paymentMethod,
        }),
      });

      const data = await result.json();

      if (data.success && data.data?.qrUrl) {
        setQrUrl(data.data.qrUrl);
      }
    } catch (error) {
      showToast.error({
        title: "Lỗi khi tạo mã thanh toán",
        description: "Vui lòng liên hệ nhân viên",
      });
    }
  }, [orderIds]);

  useEffect(() => {
    if (
      _product_setting.processOrder[status].value >= 1 &&
      _product_setting.processOrder[status].value < 5
    ) {
      handlePayment();
    }
    return;
  }, [handlePayment]);

  return (
    qrUrl && (
      <div className="mt-2 w-fit mx-auto rounded-lg overflow-hidden">
        <Link href={qrUrl} target="_blank">
          <Image src={qrUrl} alt="QR Code" width={150} height={150} />
        </Link>
      </div>
    )
  );
}

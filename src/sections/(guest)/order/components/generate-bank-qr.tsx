"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { OrderStatus, PaymentMethod, PaymentType } from "@/types/order";
import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";
import { showToast } from "@/lib/toast";
import { API_ROUTES } from "@/config/api-routes";

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
      const result = await fetch(API_ROUTES.ADMIN.PAYMENT.CREATE, {
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
        const proxyUrl = API_ROUTES.ADMIN.PAYMENT.QR_IMAGE(data.data.qrUrl);

        setQrUrl(proxyUrl);
      }
    } catch {
      showToast.error({
        title: "Lỗi khi tạo mã thanh toán",
        description: "Vui lòng liên hệ nhân viên",
      });
    }
  }, [orderIds, paymentMethod]);

  useEffect(() => {
    const processValue = _product_setting.processOrder[status].value;

    if (processValue >= 1 && processValue < 5) {
      void handlePayment();
    }
  }, [handlePayment, status]);

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
      <div className="size-[150px] mx-auto overflow-hidden relative">
        <Link
          href={qrUrl}
          target="_blank"
          className="relative block size-full before:z-20 before:absolute before:size-6  before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[url('/images/logo/logo-sctc-v1.webp')] before:bg-center before:bg-no-repeat before:bg-contain"
        >
          <Image
            unoptimized
            src={qrUrl}
            alt="QR Code"
            width={150}
            height={150}
            onError={() => {
              console.error("[SCTC] QR image load failed:", qrUrl);
            }}
          />
        </Link>
      </div>
    )
  );
}

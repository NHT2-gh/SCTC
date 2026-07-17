import { orderService } from "@/services/order.service";
import { createCollectionLink } from "./client";
import { momoConfig } from "./config";
import { createSignature } from "./signature";
import { v4 } from "uuid";
import { MOMO_REQUEST_TYPE } from "./constants";
import { PaymentMethod, PaymentType } from "@/types/order";
import { QrVietQuickLinkResponse } from "../paymentQR/type";
import { createQuickQR } from "../paymentQR/create-quick-qr";

// src/lib/payment/momo/build-create-payment-payload.ts

interface BuildCreatePaymentPayloadParams {
  orderId: string;
  amount: number;
  orderInfo?: string;
  extraData?: string;
  payment_type: PaymentType;
  table_id: string;
}

export function buildCreatePaymentPayload({
  orderId,
  amount,
  orderInfo,
  extraData = "",
}: BuildCreatePaymentPayloadParams) {
  const requestId = v4();

  const payload = {
    partnerCode: momoConfig.partnerCode,
    requestId,
    amount,
    orderId: `SCTC_MOMO_${orderId}`,
    orderInfo: orderInfo ?? `Ủng hộ cho Sáng Cà Tối Cồn 1 tí nha (#${orderId})`,
    redirectUrl: momoConfig.redirectUrl,
    ipnUrl: momoConfig.ipnUrl,
    lang: "vi" as const,
    requestType: MOMO_REQUEST_TYPE,
    autoCapture: true,
    extraData,
  };

  const signature = createSignature(
    {
      accessKey: momoConfig.accessKey,
      partnerCode: payload.partnerCode,
      requestId: payload.requestId,
      amount: payload.amount,
      orderId: payload.orderId,
      orderInfo: payload.orderInfo,
      redirectUrl: payload.redirectUrl,
      ipnUrl: payload.ipnUrl,
      extraData: payload.extraData,
      requestType: payload.requestType,
    },
    momoConfig.secretKey,
  );

  return {
    ...payload,
    signature,
  };
}

export async function createPayment(
  tracking_codes: string[],
  payment_type: PaymentType,
  payment_menthod: PaymentMethod,
  table_id: string,
) {
  const orders = await orderService.getAllOrder({
    filters: { id: tracking_codes },
  });

  if (!orders || !orders.success || !orders.data) {
    throw new Error(orders?.message || "Order not found");
  }

  const totalAmount = orders?.data.reduce(
    (acc, order) => acc + order.subtotal,
    0,
  );

  const orderId = `${payment_type === PaymentType.INDIVIDUAL ? `IND${orders.data[0].tracking_order}` : `GRP${table_id}${Date.now().toString()}`}`;

  if (payment_menthod === PaymentMethod.CASH) {
    return;
  }

  if (payment_menthod === PaymentMethod.QR) {
    try {
      const result = await createQuickQR({
        base_url: process.env.NEXT_PUBLIC_QR_VIET_BASE_URL!,
        amount: totalAmount,
        addInfo: `SCTCQR${orderId}`,
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  if (payment_menthod === PaymentMethod.MOMO) {
    const payload = buildCreatePaymentPayload({
      orderId: orderId,
      amount: totalAmount,
      payment_type,
      table_id,
    });

    try {
      const result = await createCollectionLink(payload);

      return result;
    } catch (error) {
      throw error;
    }
  }
}

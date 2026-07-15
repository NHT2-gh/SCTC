import { orderService } from "@/services/order.service";
import { createCollectionLink } from "./client";
import { momoConfig } from "./config";
import { createSignature } from "./signature";
import { v4 } from "uuid";
import { MOMO_REQUEST_TYPE } from "./constants";

// src/lib/payment/momo/build-create-payment-payload.ts

interface BuildCreatePaymentPayloadParams {
  orderId: string;
  amount: number;
  orderInfo?: string;
  extraData?: string;
}

export function buildCreatePaymentPayload({
  orderId,
  amount,
  orderInfo,
  extraData = "",
}: BuildCreatePaymentPayloadParams) {
  const requestId = crypto.randomUUID();

  const payload = {
    partnerCode: momoConfig.partnerCode,
    requestId,
    amount,
    orderId,
    orderInfo: orderInfo ?? `SCTC - Đơn hàng #${orderId}`,
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

export async function createPayment(tracking_code: string) {
  const order = await orderService.getOrderDetail(tracking_code);

  if (!order) {
    throw new Error("Order not found");
  }

  const payload = buildCreatePaymentPayload({
    orderId: order.data.order.tracking_order,
    amount: order.data.order.subtotal,
  });

  try {
    const result = await createCollectionLink(payload);

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

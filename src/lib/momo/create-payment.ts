import { orderService } from "@/services/order.service";
import { createCollectionLink } from "./client";
import { momoConfig } from "./config";
import { createSignature } from "./signature";
import { v4 } from "uuid";
import { MOMO_REQUEST_TYPE } from "./constants";
import { PaymentType } from "@/types/order";

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
  table_id,
  payment_type,
}: BuildCreatePaymentPayloadParams) {
  const requestId = v4();

  const payload = {
    partnerCode: momoConfig.partnerCode,
    requestId,
    amount,
    orderId,
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
  table_id: string,
) {
  const orders = await orderService.getAllOrder({
    filters: { id: tracking_codes },
  });

  if (!orders || !orders.success || !orders.data) {
    throw new Error(orders?.message || "Order not found");
  }

  const payload = buildCreatePaymentPayload({
    orderId: `MOMO-${payment_type === PaymentType.INDIVIDUAL ? `IND_${tracking_codes[0]}` : `GRP_${table_id}_${Date.now().toString()}`}`,
    amount: orders.data.reduce((acc, order) => acc + order.subtotal, 0),
    payment_type,
    table_id,
  });

  try {
    const result = await createCollectionLink(payload);

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

import { orderService } from "@/services/order.service";
import { momoConfig } from "./config";
import { MomoCreatePaymentRequest, MomoCreatePaymentResponse } from "./type";

export async function createMomoPayment(
  body: MomoCreatePaymentRequest,
): Promise<MomoCreatePaymentResponse> {
  const response = await fetch(momoConfig.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Cannot connect to MoMo");
  }

  return response.json();
}

export async function createCollectionLink(
  request: MomoCreatePaymentRequest,
): Promise<MomoCreatePaymentResponse> {
  const response = await fetch(momoConfig.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to call MoMo");
  }

  return response.json();
}

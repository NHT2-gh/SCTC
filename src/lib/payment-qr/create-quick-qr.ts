import { PaymentMethod } from "@/types/order";
import { createMomoPayment } from "../momo/client";
import { QrVietQuickLinkRequest, QrVietQuickLinkResponse } from "./type";

export async function createQuickQR(
  resquest: QrVietQuickLinkRequest,
): Promise<QrVietQuickLinkResponse> {
  if (resquest.amount === 0) {
    throw new Error("Invalid amount");
  }

  const qrUrl = `${resquest.base_url}&amount=${resquest.amount}&addInfo=${resquest.addInfo}`;
  return { qrUrl: qrUrl };
}

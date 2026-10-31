import { QrVietQuickLinkRequest, QrVietQuickLinkResponse } from "./type";

export async function createQuickQR(
  resquest: QrVietQuickLinkRequest,
): Promise<QrVietQuickLinkResponse> {
  if (resquest.amount === 0) {
    throw new Error("Invalid amount");
  }

  const params = new URLSearchParams();
  params.append("amount", resquest.amount.toString());

  if (resquest.addInfo) {
    params.append("addInfo", resquest.addInfo);
  }

  const qrUrl = `${resquest.base_url}&${params.toString()}`;

  return { qrUrl: qrUrl };
}

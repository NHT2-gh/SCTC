import { QrVietQuickLinkRequest, QrVietQuickLinkResponse } from "./type";

export async function createQuickQR(
  resquest: QrVietQuickLinkRequest,
): Promise<QrVietQuickLinkResponse> {
  if (resquest.amount === 0) {
    throw new Error("Invalid amount");
  }

  const queries = new URLSearchParams();
  queries.append("amount", resquest.amount.toString());
  if (resquest.addInfo) {
    queries.append("addInfo", resquest.addInfo);
  }

  const qrUrl = `${resquest.base_url}?${queries.toString()}`;

  return { qrUrl: qrUrl };
}

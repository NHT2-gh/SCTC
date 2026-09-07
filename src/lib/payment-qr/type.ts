export interface QrVietQuickLinkRequest {
  base_url: string;
  amount: number;
  addInfo?: string;
}

export interface QrVietQuickLinkResponse {
  qrUrl: string;
}

export interface CreatePaymentRequest {
  orderId: string;
}

export interface CreatePaymentResponse {
  payUrl: string;
}

export interface MomoCreatePaymentResponse {
  payUrl: string;
  deeplink: string;
  qrCodeUrl: string;
  resultCode: number;
  message: string;
}

export interface SignatureInput {
  accessKey: string;
  amount: number;
  extraData?: string;
  ipnUrl?: string;
  orderId: string;
  orderInfo?: string;
  partnerCode: string;
  redirectUrl?: string;
  requestId?: string;
  requestType: string;
}

export interface MomoCreatePaymentRequest {
  partnerCode: string;
  partnerName?: string;
  storeId?: string;
  requestId: string;
  amount: number;
  orderId: string;
  orderInfo?: string;
  redirectUrl: string;
  ipnUrl: string;
  lang?: "vi" | "en";
  requestType: string;
  autoCapture?: boolean;
  extraData?: string;
  signature: string;
}

export interface MomoIpnRequest {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: number;
  resultCode: number;
  message: string;
  payType: string;
  responseTime: number;
  extraData: string;
  signature: string;
}

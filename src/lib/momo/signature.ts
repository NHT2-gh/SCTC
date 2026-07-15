import { hmacSHA256 } from "@/utils/create_hmacSHA256";
import { SignatureInput } from "./type";

export function buildRawSignature(data: SignatureInput) {
  return [
    `accessKey=${data.accessKey}`,
    `amount=${data.amount}`,
    `extraData=${data.extraData}`,
    `ipnUrl=${data.ipnUrl}`,
    `orderId=${data.orderId}`,
    `orderInfo=${data.orderInfo}`,
    `partnerCode=${data.partnerCode}`,
    `redirectUrl=${data.redirectUrl}`,
    `requestId=${data.requestId}`,
    `requestType=${data.requestType}`,
  ].join("&");
}

export function createSignature(input: SignatureInput, secretKey: string) {
  const raw = buildRawSignature(input);

  return hmacSHA256(raw, secretKey);
}

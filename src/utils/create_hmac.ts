import crypto from "crypto";

export function hmacSHA256(raw: string, secretKey: string) {
  return crypto.createHmac("sha256", secretKey).update(raw).digest("hex");
}

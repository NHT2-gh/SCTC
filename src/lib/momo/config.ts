export const momoConfig = {
  endpoint: process.env.MOMO_ENDPOINT!,
  partnerCode: process.env.MOMO_PARTNER_CODE!,
  accessKey: process.env.MOMO_ACCESS_KEY!,
  secretKey: process.env.MOMO_SECRET_KEY!,
  redirectUrl: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/payment/result`,
  ipnUrl: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/payment/ipn`,
};

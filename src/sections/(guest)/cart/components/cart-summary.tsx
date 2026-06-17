import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/config/app-routes";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/utils/format-data";
import { useRouter } from "next/navigation";
import React from "react";

export default function CartSummary() {
  const { cartSummary } = useCart();

  return (
    <section className="flex flex-col items-end justify-end">
      <h2>Tóm tắt</h2>
      <span>Thành tiền: {formatCurrency(cartSummary.subtotal)}</span>
    </section>
  );
}

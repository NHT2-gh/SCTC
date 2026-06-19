import { OrderDetail } from "@/types/order";
import React from "react";
import { Bill } from "../components";

interface OrderDetailPageViewProps {
  orderDetail: OrderDetail;
}

export default function OrderDetailPageView({
  orderDetail,
}: OrderDetailPageViewProps) {
  if (!orderDetail.order) return null;
  return (
    <section className="bg-[url('/images/backgrounds/bill-bg-1.webp')] bg-no-repeat bg-center bg-cover max-w-screen h-screen overflow-y-scroll scrollbar-hidden flex justify-center items-center">
      <Bill data={orderDetail} />
    </section>
  );
}

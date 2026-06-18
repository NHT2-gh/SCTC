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
    <section className="bg-[url('/images/backgrounds/bill-bg-1.webp')] bg-no-repeat bg-center bg-cover h-screen overflow-y-scroll scrollbar-hidden w-screen flex justify-center items-start py-7">
      <Bill data={orderDetail} />
    </section>
  );
}

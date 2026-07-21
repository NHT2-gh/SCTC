import { serverActionGetOrderDetail } from "@/lib/server-action/order.action";
import { OrderDetailPageView } from "@/sections/(guest)/order/view";
import { notFound } from "next/navigation";
import React from "react";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ tracking_code: string }>;
}) {
  const { tracking_code } = await params;

  const orderDetail = await serverActionGetOrderDetail(tracking_code);

  if (
    orderDetail.error ||
    !orderDetail.data ||
    orderDetail.data.order === null
  ) {
    return notFound();
  }

  return <OrderDetailPageView orderDetail={orderDetail.data} />;
}

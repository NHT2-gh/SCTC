"use client";
import React, { useRef, useState } from "react";

import Link from "next/link";
import {
  MapTextPaymentMethod,
  MapTextStatusOrder,
  OrderDetail,
  OrderStatus,
} from "@/types/order";
import {
  formatCurrency,
  formatDateTime,
  formatDateTimev2,
} from "@/utils/format-data";
import { showToast } from "@/lib/toast";
import GenerateBankQr from "./generate-bank-qr";
import { APP_ROUTES } from "@/config/app-routes";
import { CheckCircle, CopyIcon } from "lucide-react";
import { useCopyImage } from "@/hooks/use-copy-image";
import { DeliveryMethod, DeliveryMethodMapText } from "@/types/checkout";

interface BillComponentProps {
  data: OrderDetail;
  backgroundUrl?: string;
}

export default function Bill({
  data,
  backgroundUrl = "bill-card-1.webp",
}: BillComponentProps) {
  const billRef = useRef<HTMLDivElement>(null);
  const { copyImage } = useCopyImage();
  const [isLoading, setIsLoading] = useState<boolean>();

  const handleCopy = async () => {
    setIsLoading(true);

    const result = await copyImage(
      billRef.current,
      `SCTC-${data.order.tracking_order}.png`,
    );

    if (result.method === "clipboard") {
      showToast.success({
        title: "Thành công",
        description: "Đã copy ảnh vào clipboard",
      });
    } else if (result.method === "download") {
      showToast.success({ title: "Thành công", description: "Đã tải ảnh" });
    } else {
      showToast.error({ title: "Lỗi", description: "Có lỗi xảy ra" });
    }

    setIsLoading(false);
  };
  return (
    <article
      style={{ backgroundImage: `url(/images/backgrounds/${backgroundUrl})` }}
      className="bill-box relative text-black max-w-[87%] mx-auto h-fit opacity-[0.97] border-brand-500  "
    >
      <button
        onClick={handleCopy}
        className="gap-2 py-1 px-2 flex items-center justify-center absolute right-2 top-3"
      >
        <CopyIcon size={16} />
      </button>
      <div
        ref={billRef}
        className="text-sm [&_hr]:border-dashed bg-cover [&_hr]:border-[#000000B2] px-3.5 py-8 space-y-4"
      >
        <div className="w-full flex items-center justify-between text-center">
          <Link
            href={APP_ROUTES.GUEST.ROOT}
            className="size-[100px] bg-[url('/images/logo/logo-text-1.webp')] bg-center bg-no-repeat bg-contain"
            aria-label="logo"
          />

          <div className="text-left">
            <p className="mt-3 font-bold">No: {data.order.tracking_order}</p>
            <p className="w-fit">
              {data.order.table_id ? `Bàn ${data.order.table_id}` : "Mang về"}
            </p>
          </div>
        </div>
        <hr />
        <ul className="space-y-2 text-wrap [&>li]:flex [&>li>p]:w-[50%] [&>li]:items-center">
          <li>
            <p>Khách hàng: </p> <span>{data.order.customer_name}</span>
          </li>
          <li>
            <p>SĐT: </p> <span>{data.order.customer_phone}</span>
          </li>
          <li>
            <p>Ngày đặt: </p>{" "}
            <span>
              {formatDateTime(data.order.created_at, { withTime: true })}
            </span>
          </li>
          <li>
            <p>Hình thức nhận hàng: </p>{" "}
            <span>{DeliveryMethodMapText[data.order.delivery_method]}</span>
          </li>

          {data.order.delivery_method === DeliveryMethod.pre_order && (
            <li>
              <p>Thời gian nhận hàng: </p>{" "}
              {data.order.delivery_method === DeliveryMethod.pre_order
                ? formatDateTimev2(data.order.pick_up_time, { withTime: true })
                : formatDateTime(data.order.created_at, { withTime: true })}
            </li>
          )}

          <li>
            <p>Thanh toán: </p>{" "}
            <span>{MapTextPaymentMethod[data.order.payment_method]}</span>
          </li>
        </ul>
        <hr />

        <ul className="px-3 overflow-y-scroll scrollbar-hidden [&>li>div]:grid [&>li>div]:grid-cols-[60%_15%_25%] [&>li>div]:items-center">
          {data.items.map((item) => (
            <li key={item.order_item.id}>
              <div>
                <p className="text-wrap max-w-[9.375rem]">
                  {item.product.name}
                </p>
                <span>{item.order_item.quantity}</span>
                <span className="ml-auto">
                  {formatCurrency(item.order_item.total_price)}
                </span>
              </div>
              {item.order_item.options && (
                <ul className="flex gap-1">
                  {item.order_item.options.map((option, idx) => (
                    <li
                      key={idx}
                      className="inline-flex text-[#79725B] gap-1 after:content-[','] last:after:hidden"
                    >
                      {option.name}
                    </li>
                  ))}
                </ul>
              )}
              {item.order_item.line_note && (
                <p className="italic">{item.order_item.line_note}</p>
              )}
            </li>
          ))}
        </ul>

        <hr />

        <ul className="px-3 [&>li]:flex [&>li]:justify-between [&>li]:items-center space-y-4">
          <li>
            <p>Tổng cộng:</p> <span>{formatCurrency(data.order.subtotal)}</span>
          </li>

          <li className="text-start !block mt-4">
            <span className="font-semibold">Ghi chú:</span>
            {data.order.notes ?? " Không có ghi chú"}
          </li>
        </ul>

        <hr />
        <p className="text-center space-y-4">
          * Túi tiền của bạn có thể sẽ khóc một chút, nhưng ít nhất bạn sẽ vui
          vẻ khi thưởng thức một ly nước ngon {":))))"}
        </p>

        <div className="flex items-center justify-center gap-2">
          {data.order.status === OrderStatus.COMPLETED && (
            <CheckCircle className="stroke-2 text-green-700" />
          )}
          <span className="capitalize italic">
            Trạng thái: {MapTextStatusOrder[data.order.status]}
          </span>
        </div>

        <GenerateBankQr
          status={data.order.status}
          orderIds={[data.order.id]}
          paymentMethod={data.order.payment_method}
          tableId={data.order.table_id?.toString() ?? ""}
        />
      </div>
    </article>
  );
}

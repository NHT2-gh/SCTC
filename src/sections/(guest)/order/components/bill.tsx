import React from "react";
import Image from "next/image";
import { MapTextStatusOrder, OrderDetail, OrderStatus } from "@/types/order";
import { DeliveryMethod } from "@/types/checkout";
import { formatCurrency, formatDateTime } from "@/utils/format-data";
import { CheckCircle } from "lucide-react";
import { getCurrentTable } from "@/lib/table/get-current-table";

interface BillComponentProps {
  data: OrderDetail;
  backgroundUrl?: string;
}

export default async function Bill({
  data,
  backgroundUrl = "bill-card-1.webp",
}: BillComponentProps) {
  const currentTable = await getCurrentTable();

  return (
    <article
      style={{ backgroundImage: `url(/images/backgrounds/${backgroundUrl})` }}
      className="bill-box text-black max-w-[87%] mx-auto h-fit text-sm opacity-[0.97] px-3.5 py-8 border-brand-500 space-y-4 [&_hr]:border-dashed bg-cover [&_hr]:border-[#000000B2]"
    >
      <div className="w-full flex items-center justify-between text-center">
        <Image
          width={100}
          height={100}
          src={"/images/logo/logo-text-1.webp"}
          alt={"logo"}
        />
        <div className="text-left">
          {currentTable && <p className="w-fit">Bàn {currentTable.tableId}</p>}
          <p className="mt-3">No: {data.order.tracking_order}</p>
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
          <span>{DeliveryMethod[data.order.delivery_method]}</span>
        </li>
        <li>
          <p>Thời gian nhận hàng: </p> <span>{data.order.pick_up_time}</span>
        </li>
      </ul>
      <hr />

      <ul className="px-3 overflow-y-scroll scrollbar-hidden [&>li>div]:grid [&>li>div]:grid-cols-[60%_15%_25%] [&>li>div]:items-center">
        {data.items.map((item) => (
          <li key={item.order_item.id}>
            <div>
              <p className="text-wrap max-w-[9.375rem]">
                {item.product.product_name}
              </p>
              <span>{item.order_item.quantity}</span>
              <span className="ml-auto">
                {formatCurrency(item.order_item.total_price)}
              </span>
            </div>
            {item.order_item.options && (
              <ul className="flex gap-1">
                {item.order_item.options
                  .filter((option) => option.name !== "Bình thường")
                  .map((option, idx) => (
                    <li
                      key={idx}
                      className="inline-flex text-[#79725B] gap-1 after:content-[','] last:after:hidden"
                    >
                      {option.name}
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <hr />

      <ul className="px-3 [&>li]:flex [&>li]:justify-between [&>li]:items-center space-y-4">
        <li>
          <p>Tổng cộng:</p> <span>{formatCurrency(data.order.subtotal)}</span>
        </li>

        <li className="text-start !block mt-4 italic">
          <span className="font-semibold">Ghi chú:</span>
          {data.order.notes ?? " Không có ghi chú"}
        </li>
      </ul>

      <hr />
      <p className="text-center space-y-4">
        * Túi tiền của bạn có thể sẽ khóc một chút, nhưng ít nhất bạn sẽ vui vẻ
        khi thưởng thức một ly nước ngon {":))))"}
      </p>

      <div className="flex items-center justify-center gap-2">
        {data.order.status === OrderStatus.COMPLETED && (
          <CheckCircle className="stroke-2 text-green-700" />
        )}
        <span className="capitalize">
          {MapTextStatusOrder[data.order.status]}
        </span>
      </div>
    </article>
  );
}

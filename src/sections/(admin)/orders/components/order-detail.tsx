import { DeliveryMethod } from "@/types/checkout";
import { OrderDetail as OrderDetailType } from "@/types/order";
import { formatCurrency, formatDateTime } from "@/utils/format-data";
import React from "react";

export default function OrderDetail({ data }: { data: OrderDetailType }) {
  return (
    <div className="w-full border border-dashed p-4 space-y-4">
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
          <p>Thanh toán: </p> <span>Tiền mặt</span>
        </li>
      </ul>
      <hr />

      <ul className="px-3 overflow-y-scroll scrollbar-hidden [&>li>div]:grid [&>li>div]:grid-cols-[60%_15%_25%] [&>li>div]:items-center">
        {data.items.map((item, index) => (
          <li
            key={item.order_item.id}
            className="border-b py-2 last:border-none"
          >
            <div>
              <p className="text-wrap max-w-[9.375rem]">
                {index + 1}
                {". "} {item.product.product_name}
              </p>
              <span>{item.order_item.quantity}</span>
              <span className="ml-auto">
                {formatCurrency(item.order_item.total_price)}
              </span>
            </div>
            {item.order_item.options && (
              <ul className="flex flex-wrap gap-1">
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

            {item.order_item.line_note}
          </li>
        ))}
      </ul>
      <hr />
      <ul className="px-3 [&>li]:flex [&>li]:justify-between [&>li]:items-center">
        <li>Ghi chú: {data.order.notes}</li>
        <li>
          <p>Tổng cộng:</p> <span>{formatCurrency(data.order.subtotal)}</span>
        </li>
      </ul>
    </div>
  );
}

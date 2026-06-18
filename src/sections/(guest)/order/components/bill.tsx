import { DeliveryMethod } from "@/types/checkout";
import { Order, OrderDetail } from "@/types/order";
import { formatCurrency, formatDateTime } from "@/utils/format-data";
import Image from "next/image";
import React from "react";

interface BillComponentProps {
  data: OrderDetail;
}

export default function Bill({ data }: BillComponentProps) {
  return (
    <article className="bill-box max-w-[87%] h-fit opacity-[0.97] px-4 py-12 border-brand-500 space-y-3 [&_hr]:border-dashed [&_hr]:border-black bg-[url('/images/backgrounds/bill-bg-2.webp')] bg-contain">
      <div className="w-full text-center">
        <Image
          width={100}
          height={100}
          src={"/images/logo/logo-text.webp"}
          alt={"logo"}
          className="mx-auto"
        />
        <p className="mt-3">👏🏻 Đã đặt hàng thành công</p>
      </div>
      <hr />
      <ul className="space-y-2 text-wrap [&>li]:flex [&>li>p]:w-[50%] [&>li]:items-center">
        <li>
          <p>Khách hàng: </p> <span>{data.order.customer_name}</span>
        </li>
        <li>
          <p>Thời gian: </p>{" "}
          <span>
            {formatDateTime(data.order.created_at, { withTime: true })}
          </span>
        </li>
        <li>
          <p>Hình thức đặt hàng: </p>{" "}
          <span>{DeliveryMethod[data.order.delivery_method]}</span>
        </li>
        <li>
          <p>Thanh toán: </p> <span>Tiền mặt</span>
        </li>
      </ul>
      <hr />

      <ul className="px-3 overflow-y-scroll scrollbar-hidden [&>li>div]:grid [&>li>div]:grid-cols-3 [&>li>div]:items-center">
        {data.items.map((item) => (
          <li key={item.order_item.id}>
            <div>
              <p>
                {item.product.product_name}
                {":"}
              </p>

              <span>SL: {item.order_item.quantity}</span>
              <span className="ml-auto">
                {formatCurrency(item.order_item.total_price)}
              </span>
            </div>
            {item.order_item.options && (
              <ul className="flex gap-1">
                {item.order_item.options.map((option) => (
                  <li
                    className="inline-flex gap-1 after:content-[','] last:after:hidden"
                    key={option.id}
                  >
                    {option.name}
                  </li>
                ))}

                {item.order_item.options.map((option) => (
                  <li
                    className="after:content-[','] last:after:hidden"
                    key={option.id}
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
      <ul className="px-3 [&>li]:flex [&>li]:justify-between [&>li]:items-center">
        <li>
          <p>Tổng cộng:</p> <span>{formatCurrency(data.order.subtotal)}</span>
        </li>
      </ul>
      <hr />

      <div className="text-center space-y-4">
        <p>
          🫰 Với hình thức đặt trước các bạn vui lòng thanh toán đơn hàng trước
          10p trước giờ lấy hàng để tụi mình chuẩn bị đơn hàng nha !
        </p>
      </div>
    </article>
  );
}

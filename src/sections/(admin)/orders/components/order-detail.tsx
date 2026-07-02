import React from "react";
import { Checkbox } from "@/components/ui/input";
import { DeliveryMethod } from "@/types/checkout";
import { OrderDetail as OrderDetailType } from "@/types/order";
import { formatCurrency, formatDateTime } from "@/utils/format-data";

export default function OrderDetail({ data }: { data: OrderDetailType }) {
  const [itemsDone, setItemsDone] = React.useState<string[]>([]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <p className="text-lg font-bold">No: {data.order.tracking_order}</p>
        {data.order.table_id && (
          <b className="px-2 py-1 rounded-lg bg-muted">
            Bàn {data.order.table_id}
          </b>
        )}
      </div>
      <div className="w-full border border-dashed p-4 space-y-4 border-red-700 rounded-lg">
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
            <p>Hình thức: </p>{" "}
            <span>{DeliveryMethod[data.order.delivery_method]}</span>
          </li>
        </ul>
        <hr />

        <ul className="overflow-y-scroll scrollbar-hidden [&>li>div]:grid [&>li>div]:grid-cols-2 [&>li>div]:items-center">
          {data.items.map((item, index) => (
            <li
              key={item.order_item.id}
              className="border-b py-2 last:border-none flex gap-3"
            >
              <Checkbox
                id={item.order_item.id}
                checked={itemsDone.includes(item.order_item.id)}
                onChange={() => {
                  setItemsDone((prev) =>
                    prev.includes(item.order_item.id)
                      ? prev.filter((id) => id !== item.order_item.id)
                      : [...prev, item.order_item.id],
                  );
                }}
              />
              <div className="grow">
                <p className="text-wrap">
                  {index + 1}
                  {". "} {item.product.product_name}
                </p>
                <p className="text-right">{item.order_item.quantity}</p>

                {item.order_item.options && (
                  <ul className="flex flex-wrap gap-1 col-span-2">
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
                  <p className="text-wrap max-w-[9.375rem]">
                    {item.order_item.line_note}
                  </p>
                )}
              </div>
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
    </div>
  );
}

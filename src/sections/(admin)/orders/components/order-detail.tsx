import React from "react";
import { Checkbox } from "@/components/ui/input";
import { DeliveryMethod, DeliveryMethodMapText } from "@/types/checkout";
import {
  formatCurrency,
  formatDateTime,
  formatDateTimev2,
} from "@/utils/format-data";
import {
  MapTextPaymentMethod,
  OrderDetail as OrderDetailType,
  OrderTypeMap,
} from "@/types/order";

export default function OrderDetail({ data }: { data: OrderDetailType }) {
  const [itemsDone, setItemsDone] = React.useState<string[]>([]);

  return (
    <div className="space-y-2">
      <div className="flex justify-center items-center gap-2 bg-neutral-500/40 text-neutral-950 w-[80%] mx-auto py-2 px-4">
        <span className="text-md">{OrderTypeMap[data.order.order_type]}</span>
        {data.order.table_id && <span>(Bàn {data.order.table_id})</span>}
      </div>
      <div className="w-full p-4 space-y-4">
        <ul className="space-y-2 text-wrap [&>li]:flex [&>li>p]:w-[50%] [&>li]:items-center">
          <li>
            <p>No:</p> <b>{data.order.tracking_order} </b>
          </li>
          <li>
            <p>Customer: </p>{" "}
            <span>
              {data.order.customer_name} {" - "} {data.order.customer_phone}
            </span>
          </li>
          <li>
            <p>Delivery method: </p>{" "}
            <span>{DeliveryMethodMapText[data.order.delivery_method]}</span>
          </li>
          <li>
            <p>Payment method: </p>{" "}
            <span>{MapTextPaymentMethod[data.order.payment_method]}</span>
          </li>
          <li>
            <p>Created time: </p>{" "}
            <span>
              {formatDateTime(data.order.created_at, { withTime: true })}
            </span>
          </li>

          <li>
            <p>Pickup time: </p>{" "}
            {data.order.delivery_method === DeliveryMethod.pre_order
              ? formatDateTimev2(data.order.pick_up_time, { withTime: true })
              : formatDateTime(data.order.created_at, { withTime: true })}
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
          <li className="whitespace-pre-line">Note: {data.order.notes}</li>
          <li>
            <p>Total:</p> <span>{formatCurrency(data.order.subtotal)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

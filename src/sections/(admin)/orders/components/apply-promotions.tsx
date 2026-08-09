import React, { useEffect, useMemo, useState } from "react";
import Label from "@/components/form/label/label";
import { Radio } from "@/components/ui/input";
import InputText from "@/components/ui/input/input-text";
import { useGetAllPromotion } from "@/hooks/queries/use-promotion";
import { cn } from "@/lib/utils";
import { Promotion, PromotionDiscountType } from "@/types/promotions";
import { formatCurrency, formatDateTime } from "@/utils/format-data";
import { ChevronDown, TicketCheck } from "lucide-react";
import { OrderDetail } from "@/types/order";
import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";

interface ApplyPromotionsProps {
  orderDetail: OrderDetail;
}

export default function ApplyPromotions({ orderDetail }: ApplyPromotionsProps) {
  const [open, setOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<string[]>([]);
  const { data: promotions } = useGetAllPromotion({
    orderBy: { columnName: "trigger", asc: false },
  });
  const [availablePromotions, setAvailablePromotions] = useState<Promotion[]>(
    [],
  );
  const totalOrderDiscountValue = useMemo(() => {
    const totalDiscount = selectedPromotion.reduce((total, id) => {
      const item = promotions?.data.find((item) => item.id === id);

      if (!item) return total;

      let discountValue = 0;

      if (item.discount_type === PromotionDiscountType.percentage) {
        discountValue =
          (item.discount_value * orderDetail.order.subtotal) / 100;
      } else {
        discountValue = item.discount_value;
      }

      if (
        item.conditions.max_discount_value &&
        discountValue > item.conditions.max_discount_value
      ) {
        discountValue = item.conditions.max_discount_value;
      }

      return total + discountValue;
    }, 0);

    const maxTotalDiscount = 0.3 * orderDetail.order.subtotal;

    return Math.min(totalDiscount, maxTotalDiscount);
  }, [orderDetail.order.subtotal, selectedPromotion, promotions?.data]);

  useEffect(() => {
    if (promotions && promotions.data.length > 0) {
      const availablePromotions = promotions.data.filter((promotion) => {
        const isOrderValueEnough =
          orderDetail.order.subtotal >=
          (promotion.conditions.min_order_value || 0);

        const isValidTime =
          promotion.start_at && promotion.end_at
            ? new Date(promotion.start_at) <=
                new Date(orderDetail.order.created_at) &&
              new Date(promotion.end_at) >=
                new Date(orderDetail.order.created_at)
            : true;

        const isValidDay = promotion.conditions.time_apply?.days_of_week
          ? promotion.conditions.time_apply?.days_of_week.includes(
              new Date(orderDetail.order.created_at).getDay(),
            )
          : true;

        const isValidCategory = promotion.conditions.applicable_categories
          ? orderDetail.items.every((item) =>
              promotion.conditions.applicable_categories?.includes(
                item.product.product_type,
              ),
            )
          : true;

        const isOverDiscount = promotion.conditions.max_discount_value
          ? promotion.conditions.max_discount_value >
            totalOrderDiscountValue +
              (promotion.discount_type === PromotionDiscountType.percentage
                ? (promotion.discount_value * orderDetail.order.subtotal) / 100
                : promotion.discount_value)
          : false;

        const isQualifyOrder =
          isOrderValueEnough &&
          isValidTime &&
          isValidCategory &&
          isValidDay &&
          !isOverDiscount;

        return isQualifyOrder;
      });

      setAvailablePromotions(availablePromotions);
    }
  }, [promotions, orderDetail]);

  return (
    <div className="space-y-4">
      <ul className="space-y-2 w-full [&_li]:flex [&_li]:justify-between [&_li]:items-center [&>li:last-child>span]:font-bold">
        <li>
          <p>Sub Total:</p>
          <span>{formatCurrency(orderDetail.order.subtotal)}</span>
        </li>

        {totalOrderDiscountValue > 0 && (
          <li>
            <p>Total Discount:</p>
            <span>- {formatCurrency(totalOrderDiscountValue)}</span>
          </li>
        )}

        <li>
          <p>Total:</p>
          <span className="text-red-500">
            {formatCurrency(
              orderDetail.order.subtotal - totalOrderDiscountValue,
            )}
          </span>
        </li>
      </ul>

      <div
        className={cn("space-y-2", {
          "opacity-50 cursor-not-allowed":
            _product_setting.processOrder[orderDetail.order.status].value >= 5,
        })}
      >
        <Label>Apply Promotions</Label>

        <InputText
          disabled={
            _product_setting.processOrder[orderDetail.order.status].value >= 5
          }
          type={"text"}
          placeholder="Enter coupon code"
        />

        <button
          disabled={
            _product_setting.processOrder[orderDetail.order.status].value >= 5
          }
          onClick={() => setOpen(!open)}
          className={cn(
            "border bg-amber-50 p-2 w-full flex items-center gap-2 rounded-lg disabled:opacity-30",
            {
              "border-b-0 rounded-bl-none rounded-br-none": open,
            },
          )}
        >
          <TicketCheck strokeWidth={1.5} className="text-emerald-500" /> List of
          promotions {" ("} {availablePromotions?.length} {")"}
          <ChevronDown
            className={cn("ml-auto transition-transform", {
              "rotate-180": open,
            })}
          />
        </button>
        {open && (
          <div className="border border-t-0  rounded-bl-lg rounded-br-lg  p-2 w-full grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] items-center gap-2">
            {promotions?.data.map((item) => (
              <button
                key={item.id}
                disabled={
                  !availablePromotions.some(
                    (availablePromotion) => availablePromotion.id === item.id,
                  )
                }
                className={cn(
                  "p-1 h-full min-h-fit border flex items-center gap-3 rounded-lg",
                  {
                    "opacity-50 cursor-not-allowed": !availablePromotions.some(
                      (availablePromotion) => availablePromotion.id === item.id,
                    ),
                  },
                )}
                onClick={() => {
                  if (selectedPromotion.includes(item.id)) {
                    setSelectedPromotion(
                      selectedPromotion.filter((id) => id !== item.id),
                    );
                  } else {
                    setSelectedPromotion([...selectedPromotion, item.id]);
                  }
                }}
              >
                <div className="rounded-md h-full aspect-square flex items-center text-center justify-center bg-neutral-100">
                  <p className="font-semibold text-sm text-wrap">
                    {item.name.slice(0, 5)}
                  </p>
                </div>
                <div className="text-sm text-start grow py-1">
                  <p className="text-brand-400 font-semibold">
                    Giảm{" "}
                    {item.discount_type === PromotionDiscountType.percentage
                      ? `${item.discount_value}%`
                      : `${formatCurrency(item.discount_value)}`}
                  </p>
                  <p className="text-xs">
                    {item.conditions.min_order_value &&
                      `Đơn hàng tối thiểu ${formatCurrency(item.conditions.min_order_value)}`}
                  </p>
                  <p className="text-xs">
                    {item.conditions.max_discount_value &&
                      `Giảm tối đa ${formatCurrency(item.conditions.max_discount_value)}`}
                  </p>
                  <p className="text-[0.625rem]">
                    {item.start_at &&
                      item.end_at &&
                      "Hiệu lực: " +
                        `${formatDateTime(item.start_at, {
                          formatString: "dd-mm-yyyy",
                        })} - ${formatDateTime(item.end_at, {
                          formatString: "dd-mm-yyyy",
                        })}`}
                  </p>
                </div>

                <Radio
                  id={item.id}
                  name={"promotions"}
                  value={item.id}
                  className="ml-auto mr-5"
                  checked={selectedPromotion.includes(item.id)}
                  label={""}
                  onChange={(value) => {
                    if (selectedPromotion.includes(value)) {
                      setSelectedPromotion(
                        selectedPromotion.filter((id) => id !== value),
                      );
                    } else {
                      setSelectedPromotion([...selectedPromotion, value]);
                    }
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

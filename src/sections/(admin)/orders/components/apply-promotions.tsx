import React, { useEffect, useMemo, useState } from "react";
import Label from "@/components/form/label/label";
import { Radio } from "@/components/ui/input";
import InputText from "@/components/ui/input/input-text";
import {
  useApplyPromotion,
  useGetAllPromotion,
  useGetOrderDiscount,
  useGetPromotionAllow,
} from "@/hooks/queries/use-promotion";
import { cn } from "@/lib/utils";
import { Promotion, PromotionDiscountType } from "@/types/promotions";
import { formatCurrency, formatDateTime } from "@/utils/format-data";
import { ChevronDown, TicketCheck } from "lucide-react";
import { OrderDetail } from "@/types/order";
import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { usePromotionCalculator } from "@/hooks/use-promotion";
import { PromotionCalculatorAdapter } from "@/adapters/promotion.adapter";
import { v4 } from "uuid";

interface ApplyPromotionsProps {
  orderDetail: OrderDetail;
}

export default function ApplyPromotions({ orderDetail }: ApplyPromotionsProps) {
  const [open, setOpen] = useState(false);
  const applyPromotion = useApplyPromotion();
  const { data: orderDiscounts } = useGetOrderDiscount(orderDetail.order.id);
  const { data: promotionAvalible } = useGetPromotionAllow({
    _subtotal: orderDetail.order.subtotal,
    _product_items: orderDetail.items.map((item) => {
      return {
        product_type: item.product.product_type,
      };
    }),
  });

  const [selectedPromotion, setSelectedPromotion] = useState<string[]>(
    orderDiscounts?.data.map((item) => item.promotion_id) || [],
  );

  const { promotionResults, totalDiscount } = usePromotionCalculator({
    orderSubtotal: orderDetail.order.subtotal,
    eligiblePromotions: PromotionCalculatorAdapter(
      promotionAvalible?.data || [],
    ),
    selectedPromotion,
    products: orderDetail.items.map((item) => {
      return item.product;
    }),
  });

  const handleApplyPromotion = async () => {
    const data = promotionAvalible?.data
      .filter((item) => selectedPromotion.includes(item.promotion.id))
      .map((item) => ({
        id:
          orderDiscounts?.data.find((p) => item.promotion.id === p.id)?.id ||
          v4(),
        order_id: orderDetail.order.id,
        promotion: {
          ...item.promotion,
          discount_value:
            promotionResults.find((p) => p.promotionId === item.promotion.id)
              ?.discount || 0,
          coupon_codes: orderDiscounts?.data.find(
            (p) => item.promotion.id === p.id,
          )?.promtion_code,
        },
      }));

    if (!data) return;
    try {
      const result = await applyPromotion.mutateAsync(data);

      if (result.success)
        showToast.success({ title: "Apply promotion successfully" });
    } catch (error) {
      showToast.error({ title: "Apply promotion failed" });
    }
  };

  return (
    <div className="space-y-4">
      <ul className="space-y-2 w-full [&_li]:flex [&_li]:justify-between [&_li]:items-center [&>li:last-child>span]:font-bold">
        <li>
          <p>Sub Total:</p>
          <span>{formatCurrency(orderDetail.order.subtotal)}</span>
        </li>

        {totalDiscount > 0 && (
          <li className="block! w-full">
            <div className="flex justify-between w-full">
              <p>Total Discount:</p>
              <span className="text-brand-500">
                - {formatCurrency(totalDiscount)}
              </span>
            </div>
            <ul className="w-full pl-4 list-inside">
              {promotionResults?.map((item) => (
                <li
                  key={item.promotionId}
                  className="w-full flex items-center justify-between"
                >
                  <p className="text-xs">{item.promotionName}</p>
                  <p className="text-xs">{formatCurrency(item.discount)}</p>
                </li>
              ))}
            </ul>
          </li>
        )}

        <li>
          <p>Total:</p>

          <span className="text-emerald-500">
            {formatCurrency(orderDetail.order.subtotal - totalDiscount)}
          </span>
        </li>
      </ul>

      <div
        className={cn("", {
          "opacity-50 cursor-not-allowed":
            _product_setting.processOrder[orderDetail.order.status].value >= 4,
        })}
      >
        <Label className="mb-2">Apply Promotions</Label>

        <button
          disabled={
            _product_setting.processOrder[orderDetail.order.status].value >= 4
          }
          onClick={() => setOpen(!open)}
          className={cn(
            "border bg-amber-50 p-2 mt-2 w-full flex items-center gap-2 rounded-lg disabled:opacity-30",
            {
              "border-b-0 rounded-bl-none rounded-br-none": open,
            },
          )}
        >
          <TicketCheck strokeWidth={1.5} className="text-emerald-500" /> List of
          promotions {" ("} {promotionAvalible?.data.length} {")"}
          <ChevronDown
            className={cn("ml-auto transition-transform", {
              "rotate-180": open,
            })}
          />
        </button>
        {open && (
          <>
            <div className="border border-t-0 rounded-bl-l rounded-br-lg  p-2 w-full grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] items-center gap-2 max-h-[40%] overflow-y-scroll">
              {promotionAvalible?.data.map((item) => {
                return (
                  <button
                    key={item.promotion.id}
                    disabled={!item.isAllow}
                    className={cn("p-1 h-full min-h-fit border rounded-lg", {
                      "opacity-50 cursor-not-allowed": !item.isAllow,
                    })}
                    onClick={() => {
                      if (selectedPromotion.includes(item.promotion.id)) {
                        setSelectedPromotion((prev) =>
                          prev.filter((id) => id !== item.promotion.id),
                        );
                      } else {
                        setSelectedPromotion((prev) => [
                          ...prev,
                          item.promotion.id,
                        ]);
                      }
                    }}
                  >
                    <div className="flex gap-3 ">
                      <div className="rounded-md h-full p-2 aspect-square flex items-center text-center justify-center bg-neutral-100">
                        <p className="font-semibold text-sm text-wrap">
                          {item.promotion.name.slice(0, 5)}
                        </p>
                      </div>
                      <div className="text-sm text-start grow py-1">
                        <p className="text-brand-400 font-semibold">
                          Giảm{" "}
                          {item.promotion.discount_type ===
                          PromotionDiscountType.percentage
                            ? `${item.promotion.discount_value}%`
                            : `${formatCurrency(item.promotion.discount_value)}`}
                        </p>
                        <p className="text-xs">
                          {item.promotion.conditions.min_order_value &&
                            `Đơn hàng tối thiểu ${formatCurrency(item.promotion.conditions.min_order_value)}`}
                        </p>
                        <p className="text-xs">
                          {item.promotion.conditions.max_discount_value &&
                            `Giảm tối đa ${formatCurrency(item.promotion.conditions.max_discount_value)}`}
                        </p>
                        <p className="text-[0.625rem]">
                          {item.promotion.start_at &&
                            item.promotion.end_at &&
                            "Hiệu lực: " +
                              `${formatDateTime(item.promotion.start_at, {
                                formatString: "dd-mm-yyyy",
                              })} - ${formatDateTime(item.promotion.end_at, {
                                formatString: "dd-mm-yyyy",
                              })}`}
                        </p>
                      </div>

                      <Radio
                        id={item.promotion.id}
                        name={"promotions"}
                        value={item.promotion.id}
                        className="ml-auto mr-5"
                        checked={selectedPromotion.includes(item.promotion.id)}
                        label={""}
                        onChange={(value) => {
                          if (selectedPromotion.includes(value)) {
                            setSelectedPromotion((prev) =>
                              prev.filter((id) => id !== item.promotion.id),
                            );
                          } else {
                            setSelectedPromotion((prev) => [...prev, value]);
                          }
                        }}
                      />
                    </div>

                    {item.promotion.coupon_codes && (
                      <div className="flex items-center gap-1">
                        {item.promotion.coupon_codes.map((code) => (
                          <span
                            className="px-1 py-0.5 rounded-sm border text-[0.625rem]"
                            key={code}
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <Button
              className="block ml-auto mt-4"
              onClick={() => {
                handleApplyPromotion();
              }}
            >
              Apply Promotion
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

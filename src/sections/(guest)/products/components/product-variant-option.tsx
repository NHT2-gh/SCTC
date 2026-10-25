import { IcSizeMedium, IcSizeLarge } from "@/assets/svgs";
import { FilterValue } from "@/components/filter/filter-box-render/type";
import Label from "@/components/form/label/label";
import { delagothic } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { SelectedOption } from "@/types/cart";
import { OptionTypeMapText, OptionType } from "@/types/menu";
import { formatCurrency } from "@/utils/format-data";
import React from "react";

interface Props {
  variants: SelectedOption[];
  update: (key: string, value: FilterValue) => void;
  remove: (key: string) => void;
  value: Record<string, FilterValue>;
}

export default function ProductVariantOptions({
  variants,
  update,
  remove,
  value,
}: Props) {
  return (
    <div className="space-y-2">
      <Label className={cn("text-black", delagothic.className)}>
        {OptionTypeMapText["variant"]}
      </Label>
      <div className="flex flex-wrap gap-2.5">
        {variants?.map((variant) => (
          <button
            key={variant.id}
            onClick={() => {
              value[variant.option_type] === String(variant.option_id) &&
              !variant.is_default
                ? remove(variant.option_type)
                : update(variant.option_type, String(variant.option_id));
            }}
            className={cn(
              "text-sm px-2 py-1 flex flex-col justify-end items-center grayscale-80 opacity-30",
              {
                "grayscale-[unset] opacity-100":
                  value[variant.option_type] === String(variant.option_id) ||
                  (!value[variant.option_type] && variant.is_default),
              },
            )}
          >
            {variant.is_default ? <IcSizeMedium /> : <IcSizeLarge />}

            {variant.price > 0
              ? `+ ${formatCurrency(variant.price)}`
              : formatCurrency(0)}
          </button>
        ))}
      </div>
    </div>
  );
}

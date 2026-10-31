import React from "react";
import { cn } from "@/lib/utils";
import { delagothic } from "@/lib/fonts";
import { InfoIcon } from "lucide-react";
import { SelectedOption } from "@/types/cart";
import { OptionTypeMapText } from "@/types/menu";
import Label from "@/components/form/label/label";
import { formatCurrency } from "@/utils/format-data";
import { IcSizeMedium, IcSizeLarge } from "@/assets/svgs";
import { FilterValue } from "@/components/filter/filter-box-render/type";

interface Props {
  variants: SelectedOption[];
  update: (key: string, value: FilterValue) => void;
  remove: (key: string) => void;
  value: Record<string, FilterValue>;
}

export default async function ProductVariantOptions({
  variants,
  update,
  remove,
  value,
}: Props) {
  return (
    <div className="space-y-2">
      <Label
        className={cn(
          "text-black gap-2 flex items-center justify-between",
          delagothic.className,
        )}
      >
        {OptionTypeMapText["variant"]}

        <div className="flex items-center gap-1 font-itim bg-brand-300/30 rounded-full py-1 px-2">
          <InfoIcon size={16} className="text-[10px]" />
          Chỉ được upsize khi mua mang đi
        </div>
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
              "text-sm px-2 py-1 flex flex-col justify-end items-center grayscale-80 opacity-30 disabled:opacity-30",
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

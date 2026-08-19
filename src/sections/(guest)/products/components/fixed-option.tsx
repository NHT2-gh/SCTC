import React from "react";
import { cn } from "@/lib/utils";
import { delagothic } from "@/lib/fonts";
import { SelectedOption } from "@/types/cart";
import { ProductType } from "@/types/product";
import { OptionTypeMapText } from "@/types/menu";
import Label from "@/components/form/label/label";
import { FilterValue } from "@/components/filter/filter-box-render/type";
import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";

export interface FixedOptionProps {
  productType: ProductType;
  fixedOptions: SelectedOption[];
  value: Record<string, FilterValue>;
  update: (key: string, value: FilterValue) => void;
  remove: (key: string) => void;
}

export default function FixedOption({
  productType,
  fixedOptions,
  value,
  update,
  remove,
}: FixedOptionProps) {
  if (!productType) return;

  const fixedOpt = productType
    ? _product_setting.fixedOptions[productType]
    : [];

  if (!fixedOpt) return;

  return fixedOpt.map((type) => (
    <div key={type} className={cn("space-y-4")}>
      <div className="space-y-2">
        <Label className={cn("text-black", delagothic.className)}>
          {OptionTypeMapText[type]}
        </Label>
        <div className="flex flex-wrap gap-2.5">
          {fixedOptions
            .filter((option) => option.option_type === type)
            .map((option) => (
              <button
                key={option.option_id}
                onClick={() => {
                  value[option.option_type] === String(option.option_id) &&
                  !option.is_default
                    ? remove(option.option_type)
                    : update(option.option_type, String(option.option_id));
                }}
                className={cn(
                  "rounded-full text-sm px-2 py-1 border border-[#E2DDCD]",
                  {
                    "border-[#B60F14B2] bg-[#B60F1426]":
                      value[option.option_type] === String(option.option_id) ||
                      (!value[type] && option.is_default),
                  },
                )}
              >
                {option.component_name}
              </button>
            ))}
        </div>
      </div>
      <hr />
    </div>
  ));
}

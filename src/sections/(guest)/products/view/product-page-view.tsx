"use client";
import FloatingCartButton from "@/components/cart/floaing-cart-button";
import { NavigationBar } from "@/components/common/navigation-bar";
import { FilterBoxRender } from "@/components/filter/filter-box-render";
import { FilterItemConfig } from "@/components/filter/filter-box-render/type";
import Label from "@/components/form/label/label";
import { NumberInput, Textarea } from "@/components/ui/input";
import { APP_ROUTES } from "@/config/app-routes";
import { useGetFixedOptions } from "@/hooks/queries/use-menu";
import { useCart } from "@/hooks/use-cart";
import { useFilter } from "@/hooks/use-filter";
import { delagothic, itim } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { SelectedOption } from "@/types/cart";
import { OptionType } from "@/types/menu";
import { ProductDetail } from "@/types/product";
import { formatCurrency } from "@/utils/format-data";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

interface ProductPageViewProps {
  product: ProductDetail;
}

const rule = {
  quantity: {
    min: 1,
    max: 10,
  },
  fixedOptionType: ["sweet", "ice"],
};

export default function ProductPageView({ product }: ProductPageViewProps) {
  const { info, options } = product;
  const { add } = useCart();
  const { data: fixedOptions } = useGetFixedOptions();
  const [quantity, setQuantity] = useState<number>(1);
  const [currentPrice, setCurrentPrice] = useState<number>(
    product.info.products.selling_price,
  );
  const [productOptionSchame, setProductOptionSchame] = useState<
    FilterItemConfig[]
  >([]);
  const {
    updateFilter,
    clearFilters,
    filterValues,
    applyFilters,
    removeFilter,
  } = useFilter({
    filterConfigs: productOptionSchame || [],
    initSubmit: false,
    onSubmit(filters) {
      const selectedOptions = Object.entries(filters).flatMap(([_, value]) => {
        if (!value) return [];
        const findOption = (optionId: string) => {
          const opt = options.find((o) => o.id === optionId);
          if (opt) return opt;
          const fixedOpt = fixedOptions?.data.find(
            (o) => String(o.id) === String(optionId),
          );

          if (fixedOpt) {
            return {
              id: String(fixedOpt.id),
              component_id: fixedOpt.id,
              component_name: fixedOpt.option_name,
              price: fixedOpt.price || 0,
              option_type: fixedOpt.option_type,
              limit: 1,
            } as SelectedOption;
          }
          return null;
        };

        if (Array.isArray(value)) {
          return value
            .map((optionId) => findOption(String(optionId)))
            .filter((opt): opt is SelectedOption => opt !== null);
        } else if (typeof value === "string") {
          const opt = findOption(value);
          return opt ? [opt] : [];
        }
        return [];
      });

      add({
        menu_item: product.info,
        quantity: quantity,
        selected_options: selectedOptions,
      });
    },
  });

  useEffect(() => {
    if (options && options.length > 0) {
      const productOptionsSchema: FilterItemConfig[] = Object.entries(
        OptionType,
      ).map(([key, value]) => ({
        key: key,
        type: "checkbox",
        label: value,
        isMultiple: true,
        options: options
          .filter((option) => option.option_type == key)
          .map((option) => ({
            label: `${option.component_name} (+${formatCurrency(option.price)})`,
            value: option.id,
            count: option.limit,
          })),
      }));

      setProductOptionSchame(productOptionsSchema);
    }
  }, [options]);

  const optionPrice = useMemo(() => {
    const selectedOptions = Object.entries(filterValues).flatMap(
      ([_, value]) =>
        (value &&
          Array.isArray(value) &&
          value.map((optionId) => {
            const option = options.find((option) => option.id === optionId);
            if (option) return option;
            else return;
          })) ||
        [],
    );

    return selectedOptions.reduce(
      (total: number, option) => total + (option?.price || 0),
      0,
    );
  }, [filterValues, options]);
  return (
    <section className="bg-[#750e0e] [&_hr]:border-[#E2DDCD]">
      <NavigationBar backHref={APP_ROUTES.GUEST.ROOT} />
      <div className="product-image h-[15rem] flex justify-center items-center-safe">
        <Image
          width={136}
          height={136}
          src={
            info.products.image_url || "/images/product-images/matcha-latte.png"
          }
          alt={info.products.name}
          className="mx-auto rotate-20"
        />
      </div>

      <div className="space-y-3 p-5 rounded-tl-[1.875rem] rounded-tr-[1.875rem] bg-[#FFFAEA]">
        <div className="flex justify-between">
          <div className="">
            <h1
              className={cn(
                "font-medium leading-tight line-clamp-2 text-[1.25rem] text-[#8D1111]",
                delagothic.className,
              )}
            >
              {info.products.name}
            </h1>

            <span className={cn("text-black text-sm text-balance")}>
              {info.products.description ||
                "Hạt cà Arabica Dark (pha máy), sữa đặc"}
            </span>
          </div>
          <span className={cn("text-[#FEA806]", delagothic.className)}>
            {formatCurrency(info.products.selling_price)}
          </span>
        </div>

        {rule.fixedOptionType.map((type) => (
          <div key={type} className={cn("space-y-4")}>
            <div className="space-y-2">
              <Label className={cn("text-black", delagothic.className)}>
                {OptionType[type as keyof typeof OptionType]}
              </Label>
              <div className="flex gap-2.5">
                {fixedOptions?.data
                  .filter((item) => item.option_type === type)
                  .map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        filterValues[option.option_type] === String(option.id)
                          ? removeFilter(type)
                          : updateFilter(option.option_type, String(option.id));
                      }}
                      className={cn(
                        "rounded-full text-sm px-2 py-1 border border-[#E2DDCD]",
                        {
                          "border-[#B60F14B2] bg-[#B60F1426]":
                            filterValues[option.option_type] ===
                            String(option.id),
                        },
                      )}
                    >
                      {option.option_name}
                    </button>
                  ))}
              </div>
            </div>
            <hr />
          </div>
        ))}

        {productOptionSchame && productOptionSchame.length > 0 && (
          <FilterBoxRender
            filterConfigs={productOptionSchame}
            handleFilterChange={() => {
              updateFilter;
            }}
            handleClearAllFilters={clearFilters}
            filterValues={filterValues}
            className={cn(
              "bg-[unset] border-none mx-0 [&>div]:p-0",
              "[&_.filter-item-label]:font-delagothic",
            )}
          />
        )}

        <div className="space-y-2">
          <Label className={cn("text-black", delagothic.className)}>
            Ghi chú
          </Label>
          <Textarea
            className="border border-[#E2DDCD]"
            type={"textarea"}
            rows={3}
            placeholder="Thích gì ghi đó"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              console.log(e.target.value);
            }}
          />
        </div>
        <span>Tạm tính: {formatCurrency(optionPrice)} </span>

        <div className="flex items-center gap-5">
          <div className="flex-2 flex h-[1.875rem] items-center [&_button]:h-full [&_button]:bg-[#8D1111] [&_button]:size-[1.875rem] [&_button]:flex [&_button]:items-center [&_button]:justify-center [&_button]:rounded-sm">
            <button
              disabled={quantity === rule.quantity.min}
              onClick={() => setQuantity(quantity - 1)}
              className="!rounded-tl-[0.625rem] !rounded-bl-[0.625rem] disabled:opacity-30"
            >
              <MinusIcon size={12} color="white" />
            </button>
            <NumberInput
              type={"number"}
              value={quantity}
              min={rule.quantity.min}
              max={rule.quantity.max}
              className="w-10 h-[1.875rem] border-none !shadow-none p-0 [&>input]:text-center flex justify-center items-center "
            />
            <button
              disabled={quantity === rule.quantity.max}
              onClick={() => setQuantity(quantity + 1)}
              className="bg-[#8D1111] !rounded-tr-[0.625rem] !rounded-br-[0.625rem]"
            >
              <PlusIcon size={12} color="white" />
            </button>
          </div>
          <button
            className={cn(
              "flex-3 bg-[#8D1111] py-4 px-2 rounded-[2.5rem]",
              delagothic.className,
            )}
            onClick={() => applyFilters()}
          >
            <span className=" text-sm text-white ">Thêm vào giỏ hàng</span>
          </button>
        </div>
      </div>

      <FloatingCartButton />
    </section>
  );
}

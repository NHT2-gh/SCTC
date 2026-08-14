"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { OptionType } from "@/types/menu";
import { useCart } from "@/hooks/use-cart";
import { SelectedOption } from "@/types/cart";
import { useFilter } from "@/hooks/use-filter";
import { delagothic, itim } from "@/lib/fonts";
import { ProductDetail } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import Label from "@/components/form/label/label";
import { formatCurrency } from "@/utils/format-data";
import CustomNumberInput from "./custom-number-input";
import { FilterBoxRender } from "@/components/filter/filter-box-render";
import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";
import { FilterItemConfig } from "@/components/filter/filter-box-render/type";
import { FixedOption } from ".";

export default function ProductInfo({ product }: { product: ProductDetail }) {
  const { info, options, isAllowOrder } = product;
  const { add } = useCart();
  const [lineNote, setLineNote] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [productOptionSchame, setProductOptionSchame] = useState<
    FilterItemConfig[]
  >([]);
  const {
    updateFilter,
    clearFilters,
    filterValues,
    applyFilters,
    removeFilter,
    setFilterValue,
  } = useFilter({
    filterConfigs: productOptionSchame,
    initSubmit: false,
    onSubmit(filters) {
      const selectedOptions = Object.entries(filters).flatMap(([_, value]) => {
        if (!value) return [];
        const findOption = (optionId: string) => {
          const opt = options.custom.find(
            (o) => String(o.option_id) === String(optionId),
          );
          if (opt)
            return {
              ...opt,
              id: String(opt.id),
            };
          const fixedOpt = options.fixed.find(
            (o) => String(o.option_id) === String(optionId),
          );

          if (fixedOpt) {
            return {
              ...fixedOpt,
              id: String(fixedOpt.id),
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
        line_note: lineNote,
        selected_options: selectedOptions,
      });

      showToast.success({ title: "Bỏ túi thành công", duration: 50 });
    },
  });

  useEffect(() => {
    if (options.custom && options.custom.length > 0) {
      const productOptionsSchema: FilterItemConfig[] = Object.entries(
        OptionType,
      ).map(([key, value]) => ({
        key: key,
        type: "checkbox",
        label: value,
        isMultiple: true,
        options: options.custom
          .filter((option) => option.option_type == key)
          .map((option) => ({
            label: `${option.component_name}\t[+${formatCurrency(option.price)}]`,
            value: String(option.option_id),
            count: option.limit,
          })),
      }));

      setProductOptionSchame(productOptionsSchema);
    }
    if (options.fixed && options.fixed.length > 0) {
      const fixedOpt = info.products.product_type
        ? _product_setting.fixedOptions[info.products.product_type]
        : [];

      if (!fixedOpt) return;

      const normalOptions = options.fixed.reduce(
        (acc, option) => {
          fixedOpt.map((type) => {
            if (option.option_type === type && option.is_default) {
              acc[type] = String(option.option_id);
            }
          });
          return acc;
        },
        {} as Record<string, string>,
      );

      setFilterValue(normalOptions);
    }
  }, [options.custom, options.fixed]);

  const totalPrice = useMemo(() => {
    const basePrice = product.info.products.selling_price;

    const optionPrice = Object.entries(filterValues).flatMap(([_, value]) =>
      Array.isArray(value)
        ? value
            .map((optionId) =>
              options.custom.find(
                (option) => String(option.option_id) === optionId,
              ),
            )
            .filter(Boolean)
        : [],
    );

    return (
      basePrice * quantity +
      optionPrice.reduce((total, option) => total + (option?.price ?? 0), 0)
    );
  }, [filterValues, options, product.info.products.selling_price, quantity]);

  return (
    <>
      <div className="product-image mb-10 flex justify-center">
        <Image
          unoptimized
          width={160}
          height={160}
          quality={100}
          src={
            info.products.image_url
              ? info.products.image_url[0]
              : "/images/logo/logo-text-1.webp"
          }
          alt={info.products.name}
          className="mx-auto object-contain"
        />
      </div>
      <div className="rounded-tl-[1.875rem] grow flex flex-col rounded-tr-[1.875rem] bg-[#FFFAEA]">
        <div className="space-y-3 p-5 grow">
          <div className="">
            <div className="flex justify-between">
              <h1
                className={cn(
                  "font-medium leading-tight line-clamp-2 text-[1.25rem] text-[#8D1111]",
                  delagothic.className,
                )}
              >
                {info.products.name}
              </h1>
              <span className={cn("text-[#FEA806]", delagothic.className)}>
                {formatCurrency(info.products.selling_price)}
              </span>
            </div>

            {info.products.description && (
              <p className={cn("text-black text-sm")}>
                {info.products.description}
              </p>
            )}
          </div>

          <FixedOption
            value={filterValues}
            update={updateFilter}
            remove={removeFilter}
            productType={info.products.product_type}
            fixedOptions={options.fixed}
          />

          {productOptionSchame && productOptionSchame.length > 0 && (
            <FilterBoxRender
              filterConfigs={productOptionSchame}
              handleFilterChange={updateFilter}
              handleClearAllFilters={clearFilters}
              filterValues={filterValues}
              className={cn(
                "bg-[unset] border-none mx-0 [&>div]:p-0",
                "[&_.filter-item-label]:font-delagothic",
                "[&_.filter-box-content]:flex [&_.filter-box-content]:flex-col",
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
              value={lineNote}
              placeholder="Thích gì ghi đó"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setLineNote(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="w-full flex items-center gap-5 sticky bottom-[-1.5px] p-1.5 after:absolute after:inset-0 after:z-[-1] after:bg-[linear-gradient(90deg,rgba(255,250,234,0)_0%,rgba(255,250,234,0.3)_25.96%)] after:backdrop-blur-[20px] after:blur-[1px]">
          <CustomNumberInput
            value={quantity}
            setValue={(value) => setQuantity(value)}
          />
          <Button
            className={cn(
              "flex-3 bg-[#8D1111] py-4 px-2 rounded-full",
              delagothic.className,
            )}
            onClick={() => applyFilters()}
            disabled={!isAllowOrder}
          >
            {isAllowOrder ? (
              <span className=" text-sm text-white ">
                Bỏ túi
                <span className={itim.className}>
                  {" -"} {formatCurrency(totalPrice)}
                </span>
              </span>
            ) : !isAllowOrder && product.info.products.is_only_allow_dinein ? (
              <span className=" text-sm text-white ">
                Hiện tại sản phẩm này chỉ phục vụ tại chỗ
              </span>
            ) : (
              <span className=" text-sm text-white ">
                Hiện tại sản phẩm này không phục vụ
              </span>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

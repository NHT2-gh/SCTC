"use client";
import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";
import FloatingCartButton from "@/components/cart/floaing-cart-button";
import { NavigationBar } from "@/components/common/navigation-bar";
import { FilterBoxRender } from "@/components/filter/filter-box-render";
import { FilterItemConfig } from "@/components/filter/filter-box-render/type";
import Label from "@/components/form/label/label";
import { NumberInput, Textarea } from "@/components/ui/input";
import { APP_ROUTES } from "@/config/app-routes";
import { useCart } from "@/hooks/use-cart";
import { useFilter } from "@/hooks/use-filter";
import { delagothic, itim } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { SelectedOption } from "@/types/cart";
import { OptionType } from "@/types/menu";
import { ProductDetail } from "@/types/product";
import { formatCurrency } from "@/utils/format-data";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import CustomNumberInput from "./components/custom-number-input";
import { showToast } from "@/lib/toast";

interface ProductPageViewProps {
  product: ProductDetail;
}

export default function ProductPageView({ product }: ProductPageViewProps) {
  const { info, options } = product;
  const [lineNote, setLineNote] = useState<string>("");
  const { add } = useCart();
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

      showToast.success({ title: "Bỏ túi thành công" });
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
            label: `${option.component_name} (+${formatCurrency(option.price)})`,
            value: String(option.option_id),
            count: option.limit,
          })),
      }));

      const normalOptions = options.fixed.reduce(
        (acc, option) => {
          _product_setting.fixedOptionType.map((type) => {
            if (
              option.option_type === type &&
              option.component_name === "Bình thường"
            ) {
              acc[type] = String(option.option_id);
            }
          });
          return acc;
        },
        {} as Record<string, string>,
      );

      setFilterValue(normalOptions);

      setProductOptionSchame(productOptionsSchema);
    }
  }, [options.custom]);

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
    <section className="bg-[#8D1111] [&_hr]:border-[#E2DDCD] relative">
      <NavigationBar backHref={APP_ROUTES.GUEST.ROOT} />
      <div className="product-image mb-10 flex justify-center">
        <Image
          unoptimized
          width={160}
          height={160}
          quality={100}
          src={
            info.products.image_url
              ? info.products.image_url[0]
              : "/images/product-images/matcha-latte.png"
          }
          alt={info.products.name}
          className="mx-auto"
        />
      </div>

      <div className="rounded-tl-[1.875rem] rounded-tr-[1.875rem] bg-[#FFFAEA]">
        <div className="space-y-3 p-5">
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
              <span className={cn("text-black text-sm")}>
                {info.products.description}
              </span>
            )}
          </div>

          {_product_setting.fixedOptionType.map((type) => (
            <div key={type} className={cn("space-y-4")}>
              <div className="space-y-2">
                <Label className={cn("text-black", delagothic.className)}>
                  {OptionType[type as keyof typeof OptionType]}
                </Label>
                <div className="flex gap-2.5">
                  {options.fixed
                    .filter((item) => item.option_type === type)
                    .map((option) => (
                      <button
                        key={option.option_id}
                        onClick={() => {
                          filterValues[option.option_type] ===
                          String(option.option_id)
                            ? removeFilter(type)
                            : updateFilter(
                                option.option_type,
                                String(option.option_id),
                              );
                        }}
                        className={cn(
                          "rounded-full text-sm px-2 py-1 border border-[#E2DDCD]",
                          {
                            "border-[#B60F14B2] bg-[#B60F1426]":
                              filterValues[option.option_type] ===
                                String(option.option_id) ||
                              (!filterValues[type] &&
                                option.component_name === "Bình thường"),
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
          ))}

          {productOptionSchame && productOptionSchame.length > 0 && (
            <FilterBoxRender
              filterConfigs={productOptionSchame}
              handleFilterChange={updateFilter}
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
          <button
            className={cn(
              "flex-3 bg-[#8D1111] py-4 px-2 rounded-full",
              delagothic.className,
            )}
            onClick={() => applyFilters()}
          >
            <span className=" text-sm text-white ">
              Bỏ túi
              <span className={itim.className}>
                {" -"} {formatCurrency(totalPrice)}
              </span>
            </span>
          </button>
        </div>
      </div>

      <FloatingCartButton />
    </section>
  );
}

import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";
import { FilterBoxRender } from "@/components/filter/filter-box-render";
import {
  FilterItemConfig,
  FilterValue,
} from "@/components/filter/filter-box-render/type";
import Label from "@/components/form/label/label";
import { Textarea } from "@/components/ui/input";
import { useGetProductOptions } from "@/hooks/queries/use-product";
import { useFilter } from "@/hooks/use-filter";
import { delagothic, itim } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { CartItem, SelectedOption } from "@/types/cart";
import { OptionType } from "@/types/menu";
import { formatCurrency } from "@/utils/format-data";
import React, { useEffect, useMemo, useState } from "react";
import CustomNumberInput from "../../products/view/components/custom-number-input";
import { useCart } from "@/hooks/use-cart";

interface EditProductInfoProps {
  cartItem: CartItem;
  onClose: () => void;
  onSubmit: (cartItem: CartItem) => void;
}

export default function EditProductInfo({
  cartItem,
  onClose,
}: EditProductInfoProps) {
  const { data: productOptions } = useGetProductOptions(cartItem.menu_item.id);
  const { updateQuantity, updateNote, updateCartItemOptions } = useCart();
  const [quantity, setQuantity] = useState<number>(cartItem.quantity);
  const [lineNote, setLineNote] = useState<string | undefined>(
    cartItem.line_note ? cartItem.line_note : undefined,
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
    setFilterValue,
  } = useFilter({
    filterConfigs: productOptionSchame,
    initSubmit: false,
    onSubmit(filters) {
      const selectedOptions = Object.entries(filters).flatMap(([_, value]) => {
        if (!value) return [];
        const findOption = (optionId: string) => {
          const opt = productOptions?.data.custom.find(
            (o) => o.option_id === optionId,
          );
          if (opt) return opt;
          const fixedOpt = productOptions?.data.fixed.find(
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
      Promise.all([
        updateCartItemOptions({
          item_id: cartItem.id,
          selected_options: selectedOptions,
        }),
        updateQuantity({ item_id: cartItem.id, quantity }),
        lineNote && updateNote({ item_id: cartItem.id, note: lineNote }),
      ]);
      onClose();
    },
  });
  const product = cartItem.menu_item.products;

  useEffect(() => {
    if (productOptions?.data.custom && productOptions.data.custom.length > 0) {
      const productOptionsSchema: FilterItemConfig[] = Object.entries(
        OptionType,
      ).map(([key, value]) => ({
        key: key,
        type: "checkbox",
        label: value,
        isMultiple: true,
        options: productOptions.data.custom
          .filter((option) => option.option_type == key)
          .map((option) => ({
            label: `${option.component_name} (+${formatCurrency(option.price)})`,
            value: String(option.option_id),
            count: option.limit,
          })),
      }));

      setProductOptionSchame(productOptionsSchema);
    }
  }, [productOptions]);

  useEffect(() => {
    const { selected_options } = cartItem;

    const defaultFilterValues = selected_options.reduce<
      Record<string, FilterValue>
    >((acc, option) => {
      const customGroup = productOptions?.data.custom.find(
        (g) => g.option_type === option.option_type,
      );
      const fixedGroup = productOptions?.data.fixed.find(
        (g) => g.option_type === option.option_type,
      );

      if (customGroup) {
        acc[option.option_type] = [
          ...((acc[option.option_type] as string[]) ?? []),
          String(option.option_id),
        ];
      } else if (fixedGroup) {
        acc[option.option_type] = String(option.option_id);
      }

      return acc;
    }, {});

    setFilterValue(defaultFilterValues);
  }, [cartItem, productOptions?.data.custom]);

  const totalPrice = useMemo(() => {
    const basePrice = product.selling_price;

    const optionPrice = Object.entries(filterValues).flatMap(([_, value]) =>
      Array.isArray(value)
        ? value
            .map((optionId) =>
              productOptions?.data.custom.find(
                (option) => option.option_id === optionId,
              ),
            )
            .filter(Boolean)
        : [],
    );

    return (
      basePrice +
      optionPrice.reduce((total, option) => total + (option?.price ?? 0), 0)
    );
  }, [filterValues, productOptions?.data.custom, product.selling_price]);
  const fixedOpt = cartItem.menu_item.products.is_only_allow_dinein
    ? _product_setting.fixedOptionType.dine_in
    : _product_setting.fixedOptionType.take_away;
  return (
    <>
      <div onClick={onClose} className="fixed h-[100vh] w-screen bg-black/10" />

      <div className="z-[30] h-[60vh] flex flex-col border overflow-y-scroll scrollbar-hidden absolute bottom-0 left-0 right-0 rounded-tl-[1.875rem] rounded-tr-[1.875rem] bg-[#FFFAEA]">
        <div className="grow space-y-3 p-5">
          <div className="flex justify-between">
            <div className="">
              <h1
                className={cn(
                  "font-medium leading-tight line-clamp-2 text-[1.25rem] text-[#8D1111]",
                  delagothic.className,
                )}
              >
                {product.name}
              </h1>

              {product.description && (
                <span className={cn("text-black text-sm ")}>
                  {product.description}
                </span>
              )}
            </div>
            <span className={cn("text-[#FEA806]", delagothic.className)}>
              {formatCurrency(product.selling_price)}
            </span>
          </div>

          {fixedOpt.map((type) => (
            <div key={type} className={cn("space-y-4")}>
              <div className="space-y-2">
                <Label className={cn("text-black", delagothic.className)}>
                  {OptionType[type as keyof typeof OptionType]}
                </Label>
                <div className="flex gap-2.5">
                  {productOptions?.data.fixed
                    ?.filter((item) => item.option_type === type)
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
                          "rounded-full px-2 py-1 border border-[#E2DDCD]",
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

        <div className="w-full flex items-center gap-5 sticky bottom-[-1.5px] p-1.5 after:absolute after:inset-0 after:z-[-1] after:bg-[linear-gradient(90deg,rgba(255,250,234,0)_0%,rgba(255,250,234,0.3)_25.96%)] after:backdrop-blur-[20px] after:blur-[2px]">
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
              Cập nhật
              <span className={itim.className}>
                {" -"} {formatCurrency(totalPrice)}
              </span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

"use client";
import FloatingCartButton from "@/components/cart/floaing-cart-button";
import { FilterBoxRender } from "@/components/filter/filter-box-render";
import { FilterItemConfig } from "@/components/filter/filter-box-render/type";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/config/app-routes";
import { useCart } from "@/hooks/use-cart";
import { useFilter } from "@/hooks/use-filter";
import { delagothic, itim } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { SelectedOption } from "@/types/cart";
import { OptionType } from "@/types/menu";
import { ProductDetail } from "@/types/product";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ProductPageViewProps {
  product: ProductDetail;
}

export default function ProductPageView({ product }: ProductPageViewProps) {
  const { info, options } = product;
  const { add } = useCart();
  const [productOptionSchame, setProductOptionSchame] = useState<
    FilterItemConfig[]
  >([]);
  const { updateFilter, clearFilters, filterValues, applyFilters } = useFilter({
    filterConfigs: productOptionSchame || [],
    initSubmit: false,
    onSubmit(filters) {
      const selectedOptions = Object.entries(filters).flatMap(
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
      add({
        menu_item: product.info,
        quantity: 1,
        selected_options: selectedOptions as SelectedOption[],
      });
    },
  });

  useEffect(() => {
    if (options) {
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
            label: option.component_name,
            value: option.id,
            count: option.limit,
          })),
      }));

      setProductOptionSchame(productOptionsSchema);
    }
  }, [options]);

  return (
    <section className="p-4">
      <div className="w-full">
        <button>
          <ArrowLeft />
        </button>
      </div>
      <div className="product-info p-4 ">
        <Image
          width={200}
          height={200}
          src={
            info.products.image_url || "/images/product-images/matcha-latte.png"
          }
          alt={info.products.name}
          className="mx-auto"
        />

        <div className="space-y-3">
          <h1
            className={cn(
              "font-medium leading-tight line-clamp-2 text-[1.25rem] text-[#8D1111]",
              delagothic.className,
            )}
          >
            {info.products.name}
          </h1>

          <span className={cn("text-black text-balance")}>
            {info.products.description ||
              "Hạt cà Arabica Dark (pha máy), sữa đặc"}
          </span>
        </div>
      </div>

      {productOptionSchame && (
        <FilterBoxRender
          filterConfigs={productOptionSchame}
          handleFilterChange={updateFilter}
          handleClearAllFilters={clearFilters}
          filterValues={filterValues}
          className="bg-[unset] border-none p-0"
        />
      )}

      <div className="flex gap-5">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => applyFilters()}
        >
          Thêm vào giỏ hàng
        </Button>

        <Button className="flex-1" onClick={applyFilters}>
          Đặt hàng
        </Button>
      </div>

      <FloatingCartButton />
    </section>
  );
}

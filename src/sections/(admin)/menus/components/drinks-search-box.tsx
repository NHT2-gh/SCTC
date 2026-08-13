"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/input";
import { SearchBar } from "@/components/search-bar";
import { formatCurrency } from "@/utils/format-data";
import { useGetAllProduct } from "@/hooks/queries/use-product";
import { Product } from "@/types/product";

interface DrinksSearchBoxProps {
  onChange: (drinkIds: string[]) => void;
  itemsIds?: string[];
}
export default function DrinksSearchBox({
  onChange,
  itemsIds,
}: DrinksSearchBoxProps) {
  const [searchDrink, setSearchDrink] = useState<string | null>(null);
  const { data: drinks, isLoading } = useGetAllProduct({
    searchText: searchDrink!,
  });
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>(
    itemsIds || [],
  );

  useEffect(() => {
    if (itemsIds && itemsIds?.length > 0) setSelectedDrinks(itemsIds);
  }, [itemsIds]);

  return (
    <div className="flex items-center gap-3 ">
      <div className="relative w-full max-w-[400px]">
        <SearchBar
          className="h-10 w-full border-[1.5px] bg-amber-50"
          handleKeyDown={(value) => setSearchDrink(value)}
          handleOnChange={(value) => {
            if (!value.trim()) setSearchDrink(null);
            else if (value === "/all") {
              setSearchDrink("/all");
            }
          }}
          debounceTime={200}
        />
        <div
          className={cn(
            "border w-full max-h-[30vh] overflow-y-auto bg-amber-50 rounded-lg absolute z-50 mt-2",
            { hidden: !searchDrink },
          )}
        >
          {isLoading && (
            <p className="text-sm text-neutral-600 hover:text-neutral-900 p-2">
              ...Đang tải
            </p>
          )}
          {searchDrink &&
            !isLoading &&
            drinks?.data &&
            drinks?.data?.length > 0 &&
            drinks?.data?.map((drink) => (
              <div
                key={drink.id}
                className="border-b last:border-none space-y-1 p-2 border-neutral-100 flex items-center gap-4"
              >
                <Checkbox
                  id={drink.id}
                  checked={selectedDrinks.includes(drink.id)}
                  onChange={() => {
                    setSelectedDrinks((prev) =>
                      prev.includes(drink.id)
                        ? prev.filter((id) => id !== drink.id)
                        : [...prev, drink.id],
                    );
                  }}
                />
                <label
                  htmlFor={drink.id}
                  className="w-full text-sm text-neutral-600 hover:text-neutral-900"
                >
                  {drink.name}
                </label>

                <span className="text-xs">
                  {formatCurrency(drink.selling_price)}
                </span>
              </div>
            ))}
          {searchDrink &&
            !isLoading &&
            drinks?.data &&
            drinks?.data?.length === 0 && (
              <p className="text-sm text-neutral-600 hover:text-neutral-900 p-2">
                Không tìm thấy đồ uống nào
              </p>
            )}
        </div>
      </div>
      {searchDrink && (
        <Button
          variant="outline"
          size="sm"
          disabled={selectedDrinks.length === 0}
          onClick={() => {
            onChange(selectedDrinks);
            setSelectedDrinks([]);
            setSearchDrink(null);
          }}
        >
          Xác nhận
        </Button>
      )}
    </div>
  );
}

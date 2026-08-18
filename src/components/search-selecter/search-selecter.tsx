"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/input";
import { SearchBar } from "@/components/search-bar";
import { formatCurrency } from "@/utils/format-data";
import { useAllOption } from "@/hooks/queries/use-menu";

interface SearchBoxProps {
  onChange: (id: string[]) => void;
  defaultSelectedOption?: string[];
}
export default function SearchSelecter({
  onChange,
  defaultSelectedOption,
}: SearchBoxProps) {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const { data: optionsData, isLoading } = useAllOption({
    searchText: searchText,
    filters: {
      type: "custom",
    },
  });
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    defaultSelectedOption || [],
  );

  useEffect(() => {
    if (defaultSelectedOption && defaultSelectedOption?.length > 0)
      setSelectedOptions(defaultSelectedOption);
  }, [defaultSelectedOption]);

  const data = optionsData?.data;

  return (
    <div className="flex items-center gap-3 my-4">
      <div className="relative w-full max-w-[400px]">
        <SearchBar
          className="h-10 w-full border-[1.5px] bg-amber-50"
          handleKeyDown={(value) => setSearchText(value)}
          handleOnChange={(value) => {
            if (!value.trim()) setSearchText(undefined);
            else if (value === "/all") {
              setSearchText("/all");
            }
          }}
          debounceTime={200}
        />

        {searchText && (
          <div
            className={cn(
              "border w-full max-h-[30vh] overflow-y-auto bg-amber-50 rounded-lg absolute z-50 mt-2",
            )}
          >
            {isLoading && (
              <p className="text-sm text-neutral-600 hover:text-neutral-900 p-2">
                ...Đang tải
              </p>
            )}
            {!isLoading &&
              data &&
              data?.length > 0 &&
              data?.map((item) => (
                <div
                  key={item.id}
                  className="border-b last:border-none space-y-1 p-2 border-neutral-100 flex items-center gap-4"
                >
                  <Checkbox
                    id={item.id}
                    checked={selectedOptions.includes(String(item.id))}
                    onChange={() => {
                      setSelectedOptions((prev) =>
                        prev.includes(String(item.id))
                          ? prev.filter((id) => id !== String(item.id))
                          : [...prev, String(item.id)],
                      );
                    }}
                  />
                  <label
                    htmlFor={item.id}
                    className="w-full text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    {item.option_name
                      ? item.option_name
                      : item.components?.name
                        ? item.components.name
                        : item.ingredients?.name}
                  </label>

                  <span className="text-xs">{formatCurrency(item.price)}</span>
                </div>
              ))}
            {searchText && !isLoading && data && data?.length === 0 && (
              <p className="text-sm text-neutral-600 hover:text-neutral-900 p-2">
                Không tìm thấy dữ liệu nào phù hợp
              </p>
            )}
          </div>
        )}
      </div>
      {searchText && (
        <Button
          variant="outline"
          size="sm"
          disabled={selectedOptions.length === 0}
          onClick={() => {
            onChange(selectedOptions);
            setSelectedOptions([]);
            setSearchText(undefined);
          }}
        >
          Xác nhận
        </Button>
      )}
    </div>
  );
}

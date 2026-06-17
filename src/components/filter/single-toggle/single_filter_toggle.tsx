import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface SingleFilterButtonGroupProp {
  items: {
    value: string;
    label: string;
  }[];
  onChange: (value: string | null) => void;
  value?: string;
  className?: string;
  isSelectAll?: boolean;
}

export default function SingleFilterButtonGroup({
  items,
  value,
  isSelectAll = false,
  onChange,
  className,
}: SingleFilterButtonGroupProp) {
  const [currentValue, setCurrentValue] = useState<string | null>(
    value ? value : items[0].value,
  );
  return (
    <div
      className={cn(
        "h-11 min-w-fit items-center flex gap-0.5 p-0.5 rounded-xl bg-[rgb(249_244_218)] [&>button]:flex-1 lg:inline-flex dark:bg-gray-900",
        className,
      )}
    >
      {isSelectAll && (
        <button
          onClick={() => {
            onChange(null);
            setCurrentValue(null);
          }}
          className={cn(
            "text-sm h-full shrink-0 rounded-lg px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white",
            {
              "shadow-theme-xs text-brand-500 dark:text-white  dark:bg-gray-800":
                currentValue === null,
              "text-gray-500 dark:text-gray-400": currentValue !== null,
            },
          )}
        >
          Tất cả
        </button>
      )}

      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => {
            onChange(item.value);
            setCurrentValue(item.value);
          }}
          className={cn(
            "text-sm h-full shrink-0 w-fit min-w-[80px] rounded-lg px-3 py-2 font-medium text-[rgb(160,156,150)] dark:text-gray-400",
            {
              "shadow-theme-xs text-brand-500 dark:text-white dark:bg-gray-800 bg-[rgba(235,210,194,0.40)]":
                currentValue === item.value,
            },
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

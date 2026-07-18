import { FilterValue } from "@/components/filter/filter-box-render/type";
import { useUrlState } from "@/hooks/use-url-state";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types/order";
import React from "react";

interface FilterStatusProps {
  filterValues: Record<string, FilterValue>;
  updateFilter: (key: string, value: string) => void;
  removeFilter: (key: string) => void;
  countOrder?: number;
}

export default function FilterStatus({
  filterValues,
  updateFilter,
  removeFilter,
  countOrder = 0,
}: FilterStatusProps) {
  const [_, setStatus] = useUrlState("status");
  return (
    <div className="z-10 py-3 bg-white flex gap-3 items-center overflow-x-scroll scrollbar-hidden">
      <button
        onClick={() => {
          removeFilter("status");
          setStatus(undefined);
        }}
        className={cn("bg-neutral-100 rounded-xl py-2 px-4 capitalize", {
          "bg-brand-300 text-white": !filterValues["status"],
        })}
      >
        All
      </button>
      {Object.entries(OrderStatus).map(([key, value]) => (
        <button
          onClick={() => {
            updateFilter("status", value);
            setStatus(value);
          }}
          key={key}
          className={cn(
            "bg-neutral-100 inline-flex items-center gap-2 rounded-xl py-2 px-4 capitalize",
            filterValues["status"] === value && "bg-brand-300 text-white",
          )}
        >
          {filterValues["status"] === value && (
            <span className="rounded-full w-7 h-7 flex items-center justify-center bg-white  text-brand-500 text-sm">
              {countOrder}
            </span>
          )}
          {value}
        </button>
      ))}
    </div>
  );
}

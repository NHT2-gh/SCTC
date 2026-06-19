"use client";

import {
  FilterItemConfig,
  FilterValue,
} from "@/components/filter/filter-box-render/type";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUrlParams } from "./use-url-state";

interface UseFilterOptions {
  filterConfigs: FilterItemConfig[];
  onSubmit?: (filters: Record<string, FilterValue>) => void;
  initSubmit?: boolean;
}

export function useFilter({
  filterConfigs,
  onSubmit,
  initSubmit = true,
}: UseFilterOptions) {
  /* ----------------------------------
   * 1. Default filters
   * ---------------------------------- */
  const defaultFilters = useMemo(() => {
    return filterConfigs.reduce(
      (acc, config) => {
        acc[config.key] =
          config.type === "checkbox" || config.type === "button-toggle"
            ? config.isMultiple
              ? []
              : null
            : config.type === "input-range"
              ? config.range
              : null;
        return acc;
      },
      {} as Record<string, FilterValue>,
    );
  }, [filterConfigs]);

  /* ----------------------------------
   * 2. URL sync
   * ---------------------------------- */
  const [urlParams, updateUrlParams] = useUrlParams(defaultFilters);

  const [filterValues, setFilterValues] = useState<Record<string, FilterValue>>(
    () => (urlParams as Record<string, FilterValue>) ?? {},
  );

  /* ----------------------------------
   * 3. Submit initial filters from URL
   * ---------------------------------- */
  const submittedRef = useRef(false);

  useEffect(() => {
    if (
      !submittedRef.current &&
      Object.keys(urlParams).length > 0 &&
      initSubmit
    ) {
      onSubmit?.(urlParams as Record<string, FilterValue>);
      submittedRef.current = true;
    }
  }, [urlParams, onSubmit]);

  /* ----------------------------------
   * 4. Derived state
   * ---------------------------------- */
  const hasActiveFilters = Object.keys(filterValues).length > 0;

  /* ----------------------------------
   * 5. Actions
   * ---------------------------------- */
  const updateFilter = (key: string, value: FilterValue) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const removeFilter = (key: string, valueToRemove?: string) => {
    setFilterValues((prev) => {
      const next = { ...prev };
      const currentValue = next[key];

      if (!valueToRemove) {
        delete next[key];
        return next;
      }

      if (Array.isArray(currentValue)) {
        const newValue = currentValue.filter(
          (v) => String(v) !== valueToRemove,
        );
        if (newValue.length === 0) {
          delete next[key];
        } else {
          next[key] = newValue as FilterValue;
        }
      } else if (String(currentValue) === String(valueToRemove)) {
        delete next[key];
      }

      return next;
    });
  };

  const clearFilters = () => {
    setFilterValues({});
    const resetParams: Record<string, null> = {};
    filterConfigs.forEach((c) => {
      resetParams[c.label || c.key] = null;
    });
    updateUrlParams(resetParams);
  };

  const applyFilters = () => {
    const params: Record<string, unknown> = {};
    filterConfigs.forEach((c) => {
      const key = c.label || c.key;
      params[key] = filterValues[key] ?? null;
    });

    updateUrlParams(params);
    onSubmit?.(filterValues);
  };

  return {
    /* state */
    filterValues,
    hasActiveFilters,
    /* actions */
    updateFilter,
    removeFilter,
    clearFilters,
    applyFilters,
  };
}

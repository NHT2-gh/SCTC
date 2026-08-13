import React from "react";
import { DateRange, FilterItemProp } from "../type";
import DatePicker from "../../../date-picker/DatePicker";
import { formatDateTime } from "@/utils/format-data";
import { DateOption } from "flatpickr/dist/types/options";

export default function DateRangeFilter({
  config,
  onChange,
  value,
}: FilterItemProp<DateRange, DateOption>) {
  return (
    <DatePicker
      id={config.key}
      type="date"
      mode="range"
      placeholder="Chọn khoảng thời gian"
      defaultDate={value}
      handleOnChange={(value) => {
        if (Array.isArray(value) && value.length === 2) {
          const dates = value as DateOption[];
          onChange?.([
            formatDateTime(dates[0]?.toString() ?? ""),
            formatDateTime(dates[1]?.toString() ?? ""),
          ]);
        }
      }}
    />
  );
}

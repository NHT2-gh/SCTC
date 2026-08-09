"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Calendar } from "lucide-react";
import DateFieldConfig from "../form/type";
import { Instance } from "flatpickr/dist/types/instance";
import { DateRangeLimit } from "flatpickr/dist/types/options";

export default function DatePicker({
  id,
  mode,
  name,
  handleOnChange,
  defaultValue,
  placeholder,
  disabled,
  pickerType,
  defaultDate,
}: DateFieldConfig) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<Instance | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!inputRef.current) return;
    const options: flatpickr.Options.Options = {
      mode: mode ?? "single",
      static: true,
      monthSelectorType: "static",
      defaultDate: defaultValue || defaultDate,
      onChange: (_, dateStr, instance) => {
        if (instance.config.mode === "range") {
          const [start, end] = dateStr.split(" to ");

          handleOnChange?.([start || null, end || null]);
        } else {
          handleOnChange?.(dateStr);
        }
      },
    };

    switch (pickerType) {
      case "datetime":
        options.enableTime = true;
        options.dateFormat = "Y-m-d H:i";
        break;

      case "time":
        options.enableTime = true;
        options.noCalendar = true;
        options.dateFormat = "H:i";
        break;

      default:
        options.dateFormat = "Y-m-d";
    }

    pickerRef.current = flatpickr(inputRef.current, options);
    setIsMobile(pickerRef.current.isMobile);

    return () => {
      pickerRef.current?.destroy();
      pickerRef.current = null;
    };
  }, []);

  return (
    <div className="relative z-30">
      <input
        id={id}
        ref={inputRef}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800",
          { hidden: isMobile },
        )}
      />

      {!isMobile && (
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <Calendar className="size-6" />
        </span>
      )}
    </div>
  );
}

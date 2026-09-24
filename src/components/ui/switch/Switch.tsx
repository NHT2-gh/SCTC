"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { SwitchFieldConfig } from "@/components/form/type";

const switchColors = {
  primary: {
    checked: {
      background: "bg-brand-500",
      knob: "translate-x-full bg-white",
    },
    normal: {
      background: "bg-gray-100 dark:bg-white/10",
      knob: "translate-x-0 bg-white",
    },
  },
  secondary: {
    checked: {
      background: "bg-gray-800 dark:bg-white/10",
      knob: "translate-x-full bg-white",
    },
    normal: {
      background: "bg-gray-200 dark:bg-white/10",
      knob: "translate-x-0 bg-white",
    },
  },
};

export default function Switch({
  name,
  label,
  value,
  disabled,
  onChange,
  handleOnChange,
  color = "primary",
  defaultValue = false,
}: SwitchFieldConfig) {
  const [isChecked, setIsChecked] = useState<boolean>(
    defaultValue || value || false,
  );

  useEffect(() => {
    if (value) setIsChecked(value);
    else setIsChecked(false);
  }, [value]);

  const handleChange = (value: boolean) => {
    setIsChecked(value);
    handleOnChange?.(value);
  };

  // const handleToggle = () => {
  //   if (disabled) return;
  //   const newCheckedState = !isChecked;
  //   setIsChecked(newCheckedState);
  //   if (onChange) {
  //     onChange(newCheckedState);
  //   }
  // };

  // console.log(isChecked);

  return (
    <label
      htmlFor={name}
      className={cn(
        "flex cursor-pointer w-fit select-none items-center gap-3 text-sm font-medium",
        {
          "text-gray-400": disabled,
          "text-gray-700 dark:text-gray-400": !disabled,
        },
      )}
      onClick={() => handleChange(!isChecked)}
    >
      <div className="relative">
        <div
          className={cn(
            "block transition duration-150 ease-linear h-6 w-11 rounded-full",
            {
              "bg-gray-100 pointer-events-none dark:bg-gray-800": disabled,
            },
            isChecked
              ? switchColors[color].checked.background
              : switchColors[color].normal.background,
          )}
        ></div>
        <div
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm duration-150 ease-linear transform",
            isChecked
              ? switchColors[color].checked.knob
              : isChecked && switchColors[color].normal,
          )}
        ></div>
      </div>
      {label}
    </label>
  );
}

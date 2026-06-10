"use client";
import React, { memo, useMemo, useState } from "react";

import { cn, debounce } from "@/lib/utils";
import { TextFieldConfig } from "@/components/form/type";

const baseClasses = `relative h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs dark:bg-gray-900 dark:text-white/90 `;
const variantClasses = {
  disabled: ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40`,
  error: ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`,
  success: ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`,
  default: ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800`,
};

export default memo(function TextInput({
  type = "text",
  id,
  name,
  value,
  placeholder,
  defaultValue,
  className,
  minLength,
  maxLength,
  debounceTime,
  handleOnChange,
  variant = "default",
  disabled = false,
  hint,
  children,
  ref,
  handleKeyDown,
  ...props
}: TextFieldConfig) {
  const [inputValue, setInputValue] = useState<string>(
    defaultValue || value || "",
  );

  const debouncedSendRequest = useMemo(() => {
    return debounce((value: string) => {
      handleOnChange?.(value);
    }, debounceTime!);
  }, [handleOnChange, debounceTime]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    debounceTime ? debouncedSendRequest(value) : handleOnChange?.(value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleKeyDown?.(inputValue);
    }
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        {
          [variantClasses.disabled]: disabled,
        },
        className,
      )}
    >
      <input
        id={id}
        name={name}
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={inputValue}
        onChange={onChange}
        disabled={disabled}
        onKeyDown={onKeyDown}
        className="w-full h-full placeholder:text-gray-400 focus:outline-hidden dark:placeholder:text-white/30"
        {...props}
      />

      {children}

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            variant === "error"
              ? "text-error-500"
              : variant === "success"
                ? "text-success-500"
                : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
});

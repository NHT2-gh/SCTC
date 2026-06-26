import { TextareaFieldConfig } from "@/components/form/type";
import { cn } from "@/lib/utils";
import React from "react";

const baseClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden`;

const variantClasses = {
  default:
    "bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800",
  disabled:
    "bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed opacity40 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  error:
    "bg-transparent  border-gray-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800",
  success: ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`,
};
export default function Textarea({
  id,
  placeholder = "Enter your message", // Default placeholder
  rows = 3, // Default number of rows
  value = "", // Default value
  onChange, // Callback for changes
  disabled = false, // Disabled state
  className, // Additional custom styles
  maxLength,
  variant = "default", // Error state
}: TextareaFieldConfig) {
  return (
    <div>
      <textarea
        id={id}
        placeholder={placeholder}
        rows={rows}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        className={cn(
          baseClasses,
          variantClasses[variant],
          {
            [variantClasses.disabled]: disabled,
          },
          className,
        )}
      />
    </div>
  );
}

import React from "react";
import { SelectFieldConfig } from "../../form/type";
import { ChevronDownIcon } from "lucide-react";

export default function Select({
  id,
  type = "select",
  name,
  options,
  className,
  value,
  disabled = false,
  defaultValue,
  placeholder = "Select an option",
  readOnly = false,
  handleOnChange,
  ...props
}: SelectFieldConfig) {
  const [valueSelected, setValueSelected] = React.useState(
    defaultValue || value || "",
  );

  React.useEffect(() => {
    setValueSelected(defaultValue || value || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValueSelected(newValue);
    handleOnChange?.(newValue);
  };

  return (
    <div className="relative" hidden={props.hidden}>
      <select
        id={id}
        name={name}
        className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
          valueSelected !== ""
            ? "text-gray-800 dark:text-white/90"
            : "text-gray-400 dark:text-gray-400"
        } ${className}`}
        value={valueSelected}
        onChange={handleChange}
        disabled={disabled || readOnly}
      >
        {/* Placeholder option */}

        <option
          key="placeholder"
          value=""
          disabled
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {placeholder}
        </option>
        {/* Map over options */}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {option.label}
          </option>
        ))}
      </select>

      {!disabled && (
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <ChevronDownIcon />
        </span>
      )}
    </div>
  );
}

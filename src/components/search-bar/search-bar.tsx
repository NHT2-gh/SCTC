import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import InputText from "../ui/input/input-text";
import { TextFieldConfig } from "../form/type";

export default function SearchBar({
  ref,
  placeholder,
  handleOnChange,
  className,
  debounceTime = 0,
  handleKeyDown,
}: Omit<TextFieldConfig, "type">) {
  return (
    <InputText
      type="text"
      ref={ref}
      placeholder={placeholder || "Tìm kiếm"}
      className={cn("relative max-w-[400px] !pl-8", className)}
      handleOnChange={handleOnChange}
      name="search"
      id="search"
      debounceTime={debounceTime}
      handleKeyDown={handleKeyDown}
    >
      <SearchIcon className="size-5 text-gray-400 dark:text-gray-500 pointer-events-none absolute left-2 top-1/2 -translate-y-1/2" />
    </InputText>
  );
}

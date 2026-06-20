import React from "react";
import { NumberInput } from "@/components/ui/input";
import { MinusIcon, PlusIcon } from "lucide-react";
import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";

interface CustomNumberInputProps {
  value: number;
  setValue: (value: number) => void;
}

export default function CustomNumberInput({
  value,
  setValue,
}: CustomNumberInputProps) {
  return (
    <div className="flex h-[1.875rem] items-center [&_button]:h-full [&_button]:bg-[#8D1111] [&_button]:size-[1.875rem] [&_button]:flex [&_button]:items-center [&_button]:justify-center [&_button]:rounded-sm">
      <button
        disabled={value === _product_setting.quantity.min}
        onClick={() => setValue(value - 1)}
        className="!rounded-tl-[0.625rem] !rounded-bl-[0.625rem] disabled:opacity-30"
      >
        <MinusIcon size={12} color="white" />
      </button>
      <NumberInput
        type={"number"}
        value={value}
        min={_product_setting.quantity.min}
        max={_product_setting.quantity.max}
        className="w-10 h-[1.875rem] border-none !shadow-none p-0 [&>input]:text-center flex justify-center items-center "
      />
      <button
        disabled={value === _product_setting.quantity.max}
        onClick={() => setValue(value + 1)}
        className="bg-[#8D1111] !rounded-tr-[0.625rem] !rounded-br-[0.625rem]"
      >
        <PlusIcon size={12} color="white" />
      </button>
    </div>
  );
}

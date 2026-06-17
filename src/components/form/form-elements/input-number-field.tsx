import React from "react";
import { Controller } from "react-hook-form";
import { NumberInput } from "@/components/ui/input";
import { FieldItemProps, NumberFieldConfig } from "@/components/form/type";

export default function InputNumberField({
  control,
  fieldConfig,
  error,
}: FieldItemProps<NumberFieldConfig>) {
  return (
    <Controller
      name={fieldConfig.name!}
      control={control}
      render={({ field: { onChange, onBlur, value, name } }) => (
        <NumberInput
          {...fieldConfig}
          ref={fieldConfig.ref}
          type="number"
          name={name}
          onBlur={onBlur}
          value={value}
          handleOnChange={(value: number) => {
            onChange(value);
          }}
        />
      )}
    />
  );
}

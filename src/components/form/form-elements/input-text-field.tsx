import React from "react";
import { Controller } from "react-hook-form";
import { TextInput } from "@/components/ui/input";
import { FieldItemProps, TextFieldConfig } from "../type";

export default function InputTextField({
  control,
  fieldConfig,
  error,
}: FieldItemProps<TextFieldConfig>) {
  return (
    <Controller
      name={fieldConfig.name!}
      control={control}
      render={({ field: { onChange, onBlur, value, name, ref } }) => (
        <TextInput
          {...fieldConfig}
          ref={ref}
          type="text"
          name={name}
          onBlur={onBlur}
          value={value}
          handleOnChange={(value: string) => {
            onChange(value);
          }}
        />
      )}
    />
  );
}

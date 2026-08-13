import DatePicker from "@/components/date-picker/DatePicker";
import React from "react";
import DateFieldConfig, { FieldItemProps } from "../type";
import { Controller } from "react-hook-form";

export default function DateField({
  control,
  fieldConfig,
}: FieldItemProps<DateFieldConfig>) {
  return (
    <Controller
      name={fieldConfig.name!}
      control={control}
      render={({ field: { onChange, onBlur, value, name } }) =>
        fieldConfig.pickerType === "time" && fieldConfig.mode === "multiple" ? (
          <div>
            <DatePicker
              type={fieldConfig.type}
              pickerType={fieldConfig.pickerType}
              mode={fieldConfig.mode}
              value={value}
              onBlur={onBlur}
              handleOnChange={(currentDateString) =>
                onChange(currentDateString)
              }
              name={name}
              placeholder={fieldConfig.placeholder}
              id={fieldConfig.id}
            />
            <DatePicker
              type={fieldConfig.type}
              pickerType={fieldConfig.pickerType}
              mode={fieldConfig.mode}
              value={value}
              onBlur={onBlur}
              handleOnChange={(currentDateString) =>
                onChange(currentDateString)
              }
              name={name}
              placeholder={fieldConfig.placeholder}
              id={fieldConfig.id}
            />
          </div>
        ) : (
          <DatePicker
            type={fieldConfig.type}
            pickerType={fieldConfig.pickerType}
            mode={fieldConfig.mode}
            value={value}
            onBlur={onBlur}
            handleOnChange={(currentDateString) => onChange(currentDateString)}
            name={name}
            placeholder={fieldConfig.placeholder}
            id={fieldConfig.id}
          />
        )
      }
    />
  );
}

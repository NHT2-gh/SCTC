import React from "react";
import Label from "./label/label";
import { Controller } from "react-hook-form";
import DatePicker from "../date-picker/DatePicker";
import { MultiSelect, Select } from "../ui/select";
import {
  Checkbox,
  FileInput,
  Input,
  NumberInput,
  PasswordInput,
  PhoneInput,
  Radio,
  Textarea,
  TextInput,
  UrlPrefixInput,
} from "../ui/input";
import { Switch } from "../ui/switch";
import { FieldRendererProps, FieldType } from "./type";
import { cn } from "@/lib/utils";

const fieldComponents: Record<FieldType, React.ComponentType<any>> = {
  text: TextInput,
  email: Input,
  password: PasswordInput,
  url: UrlPrefixInput,
  tel: PhoneInput,
  number: NumberInput,
  textarea: Textarea,
  select: Select,
  multiselect: MultiSelect,
  radio: Radio,
  date: DatePicker,
  switch: Switch,
  checkbox: Checkbox,
  file: FileInput,
  custom: ({ field }) => {
    if (field.type === "custom" && field.component) {
      const CustomComponent = field.component;
      return <CustomComponent {...field.props} />;
    }
    return <div>Custom field component not found</div>;
  },
};

const customField = ["select", "multiselect", "date", "text", "number"];

export default function FormField({
  field,
  form,
  disabled,
  className,
  children,
}: FieldRendererProps) {
  const FieldComponent = fieldComponents[field.type];

  const error = field.name
    ? form?.formState.errors[field.name]?.message
    : undefined;

  if (!FieldComponent) {
    console.warn(`No component found for field type: ${field.type}`);
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600">
          Unknown field type: <code>{field.type}</code>
        </p>
      </div>
    );
  }
  return (
    <div className={className}>
      {field.type !== "switch" && (
        <Label
          className={cn("mb-1", { "h-0 mb-0": !field.label })}
          htmlFor={field.name}
        >
          {field.label}
          {field.required && (
            <span className="text-error-500 ml-1 align-middle">*</span>
          )}
        </Label>
      )}

      {field.name && form ? (
        !customField.includes(field.type) ? (
          <Controller
            control={form.control}
            name={field.name}
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <FieldComponent
                {...field}
                disabled={disabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (field.type === "number") {
                    const num = e.target.valueAsNumber;
                    onChange?.({
                      ...e,
                      target: {
                        ...e.target,
                        value: isNaN(num) ? "" : num,
                      },
                    });
                  } else {
                    onChange?.(e);
                  }
                }}
                onBlur={onBlur}
                value={value}
                name={name}
                ref={ref}
              >
                {children}
              </FieldComponent>
            )}
          />
        ) : (
          <Controller
            control={form.control}
            name={field.name}
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <FieldComponent
                {...field}
                id={field.name}
                disabled={disabled}
                handleOnChange={(
                  value: string | Date,
                  currentDateString?: string,
                ) => {
                  onChange(value);
                  if (currentDateString) {
                    onChange(currentDateString);
                  }
                }}
                defaultDate={field.type === "date" ? value : undefined}
                onBlur={onBlur}
                value={value}
                name={name}
                ref={ref}
              >
                {children}
              </FieldComponent>
            )}
          />
        )
      ) : (
        <FieldComponent {...field} disabled={disabled} value={field.value} />
      )}

      {error && (
        <p
          className={`mt-1.5 text-xs ${
            error ? "text-error-500" : "text-gray-500"
          }`}
        >
          {error as string}
        </p>
      )}
    </div>
  );
}

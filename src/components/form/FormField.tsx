import React from "react";
import { cn } from "@/lib/utils";
import Label from "./label/label";
import { Switch } from "../ui/switch";
import { Controller } from "react-hook-form";
import DatePicker from "../date-picker/DatePicker";
import { MultiSelect, Select } from "../ui/select";
import {
  Checkbox,
  FileInput,
  NumberInput,
  PasswordInput,
  Radio,
  Textarea,
  TextInput,
  UrlPrefixInput,
} from "../ui/input";
import { FieldRendererProps, FieldType } from "./type";

const fieldComponents: Record<FieldType, React.ComponentType<any>> = {
  text: TextInput,
  email: TextInput,
  password: PasswordInput,
  url: UrlPrefixInput,
  tel: TextInput,
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

const customField = [
  "select",
  "multiselect",
  "date",
  "text",
  "number",
  "switch",
];

export default function FormField({
  field,
  form,
  disabled,
  className,
  children,
}: FieldRendererProps) {
  const FieldComponent = fieldComponents[field.type];

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

  if (field.hidden) {
    return null;
  }
  return (
    <div className={cn("field-item h-fit w-full", className)}>
      {field.type !== "switch" && (
        <Label
          className={cn("mb-1", { "h-0 mb-0": !field.label })}
          htmlFor={field.name}
        >
          {field.label}
          {field.label && field.required && (
            <span className="text-error-500 ml-1 align-middle">*</span>
          )}
          {field.label && !field.required && (
            <span className="text-gray-500 ml-1">{"(Nếu có)"}</span>
          )}
        </Label>
      )}

      {field.name && form ? (
        !customField.includes(field.type) ? (
          <Controller
            control={form.control}
            name={field.name}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState,
            }) => (
              <>
                <FieldComponent
                  {...field}
                  className={field.className}
                  disabled={disabled}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={String(value)}
                  name={name}
                  ref={ref}
                >
                  {children}
                </FieldComponent>

                {fieldState.error?.message && (
                  <p
                    className={`mt-1.5 text-xs ${
                      fieldState.error?.message
                        ? "text-error-500"
                        : "text-gray-500"
                    }`}
                  >
                    {fieldState.error?.message as string}
                  </p>
                )}
              </>
            )}
          />
        ) : (
          <Controller
            control={form.control}
            name={field.name}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState,
            }) => (
              <>
                <FieldComponent
                  {...field}
                  id={field.name}
                  disabled={disabled}
                  handleOnChange={(
                    value: string | number,
                    currentDateString?: string,
                  ) => {
                    if (field.type === "date" && currentDateString) {
                      onChange(currentDateString);
                    } else {
                      onChange(value);
                    }
                  }}
                  onBlur={onBlur}
                  value={value}
                  name={name}
                  ref={ref}
                >
                  {children}
                </FieldComponent>
                {fieldState.error?.message && (
                  <p
                    className={`mt-1.5 text-xs ${
                      fieldState.error?.message
                        ? "text-error-500"
                        : "text-gray-500"
                    }`}
                  >
                    {fieldState.error?.message as string}
                  </p>
                )}
              </>
            )}
          />
        )
      ) : (
        <FieldComponent {...field} disabled={disabled} value={field.value} />
      )}
    </div>
  );
}

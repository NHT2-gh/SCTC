"use client";
import React, { useEffect } from "react";
import { XIcon } from "lucide-react";
import FormField from "./FormField";
import { Button } from "../ui/button";
import TabsLayout from "./layouts/TabsLayout";
import GridLayout from "./layouts/GridLayout";
import StepperLayout from "./layouts/StepperLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormRendererProps, FormSchema } from "./type";
import AccordionLayout from "./layouts/AccordionLayout";
import { useForm, UseFormReturn } from "react-hook-form";
import Form from "./Form";
import z from "zod";

export default function FormRenderer({
  schema,
  onSubmit,
  onError,
  onCancel,
  defaultValues,
  disabled = false,
  className,
  submitButtonText = "Submit",
  showSubmitButton = true,
}: FormRendererProps) {
  const form = useFormRenderer<z.infer<typeof schema.validation>>(
    schema,
    defaultValues,
    "onChange",
  );

  // Reset form with new default values when they change
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const handleSubmit = form.handleSubmit(
    (data) => {
      onSubmit(data, form);
    },
    (errors) => {
      onError?.(errors, form);
    },
  );

  const renderLayout = () => {
    if (!schema.layout) {
      // Default inline layout
      return (
        <div className="space-y-6">
          {schema.fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              form={form}
              disabled={disabled}
            />
          ))}
        </div>
      );
    }

    const { type } = schema.layout;

    switch (type) {
      case "grid":
        return (
          <GridLayout
            layout={schema.layout}
            fields={schema.fields}
            form={form}
            disabled={disabled}
          />
        );
      case "tabs":
        return (
          <TabsLayout
            layout={schema.layout}
            fields={schema.fields}
            form={form}
            disabled={disabled}
          />
        );
      case "stepper":
        return (
          <StepperLayout
            layout={schema.layout}
            fields={schema.fields}
            form={form}
            disabled={disabled}
          />
        );
      case "accordion":
        return (
          <AccordionLayout
            layout={schema.layout}
            fields={schema.fields}
            form={form}
            disabled={disabled}
          />
        );
      default:
        return (
          <div className="space-y-6">
            {schema.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                form={form}
                disabled={disabled}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <Form onSubmit={handleSubmit} className={className}>
      {schema.title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {schema.title}
          </h2>
          {schema.description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {schema.description}
            </p>
          )}
        </div>
      )}

      {renderLayout()}

      {showSubmitButton && schema.layout?.type !== "stepper" && (
        <div className="mt-8 flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={form.formState.isSubmitting}
            startIcon={<XIcon className="size-4" />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={disabled || form.formState.isSubmitting}
            loading={form.formState.isSubmitting}
          >
            {submitButtonText}
          </Button>
        </div>
      )}
    </Form>
  );
}

// Export hook for external form control
export function useFormRenderer<T>(
  schema: FormSchema,
  defaultValues?: T,
  mode: "onChange" | "onBlur" | "onSubmit" = "onChange",
): UseFormReturn {
  return useForm({
    resolver: schema.validation ? zodResolver(schema.validation) : undefined,
    defaultValues: defaultValues || schema.defaultValues,
    mode,
  });
}

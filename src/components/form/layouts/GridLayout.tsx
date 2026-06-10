"use client";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import FormField from "../FormField";
import { FieldConfig, GridLayoutConfig } from "../type";
import { cn } from "@/lib/utils";

interface GridLayoutProps {
  layout: GridLayoutConfig;
  fields: FieldConfig[];
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export default function GridLayout({
  layout,
  fields,
  form,
  disabled,
}: GridLayoutProps) {
  return (
    <div
      className={cn(
        `grid gap-5 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(500px,1fr))]`,
      )}
    >
      {fields.map((field) => (
        <FormField
          key={field.name}
          className={field.className}
          field={field}
          form={form}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

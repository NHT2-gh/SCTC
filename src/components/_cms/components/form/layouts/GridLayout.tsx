"use client";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import FormField from "../FormField";
import { FieldConfig, GridLayoutConfig } from "../type";

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
  const { columns = 1, gap = 4, responsive } = layout;

  // Generate grid classes based on configuration
  const getGridClasses = () => {
    let classes = `grid gap-${gap}`;

    // Base columns
    classes += ` grid-cols-${columns}`;

    // Responsive columns
    if (responsive) {
      if (responsive.sm) classes += ` sm:grid-cols-${responsive.sm}`;
      if (responsive.md) classes += ` md:grid-cols-${responsive.md}`;
      if (responsive.lg) classes += ` lg:grid-cols-${responsive.lg}`;
      if (responsive.xl) classes += ` xl:grid-cols-${responsive.xl}`;
    }

    return classes;
  };

  return (
    <div className={getGridClasses()}>
      {fields.map((field) => (
        <div key={field.name} className="w-full">
          <FormField field={field} form={form} disabled={disabled} />
        </div>
      ))}
    </div>
  );
}

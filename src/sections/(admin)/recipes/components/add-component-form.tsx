"use client";
import FormRenderer from "@/components/form/FormRenderer";
import { useAddComponent } from "@/hooks/queries/use-component";
import { showToast } from "@/lib/toast";
import { componentFormSchema } from "@/schemas/form-schemas/component-form-schema";
import { ComponentValidationSchema } from "@/schemas/validation/component.validation";
import React, { useState } from "react";

const defaultValues: Record<
  keyof ComponentValidationSchema,
  string | number | undefined
> = {
  name: "",
  yield_quantity: "",
  yield_unit: "g",
  description: undefined,
  component_type: "",
  items: undefined,
};

export default function ComponentAddForm() {
  const addComponent = useAddComponent();
  const onSubmit = async (data: ComponentValidationSchema) => {
    const result = await addComponent.mutateAsync(data);

    if (result.success)
      showToast.success({ title: "Thêm thành phần thành công" });
  };
  return (
    <FormRenderer
      schema={componentFormSchema}
      onSubmit={onSubmit}
      submitButtonText="Tạo công thức"
      defaultValues={defaultValues}
    />
  );
}

"use client";
import React from "react";
import { showToast } from "@/lib/toast";
import FormRenderer from "@/components/form/FormRenderer";
import { useAddComponent } from "@/hooks/queries/use-component";
import { componentFormSchema } from "@/schemas/form-schemas/component-form-schema";
import { ComponentValidationSchema } from "@/schemas/validation/component.validation";

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
    />
  );
}

"use client";
import React from "react";
import { FormRenderer } from "@/components/form";
import { addPromotionFormSchema } from "@/schemas/form-schemas/promotion-form-schema";

export default function AddPromotionPageView() {
  return (
    <FormRenderer
      schema={addPromotionFormSchema}
      onSubmit={(data) => console.log(data)}
    />
  );
}

"use client";
import React from "react";
import FormRenderer from "@/components/form/FormRenderer";
import { ingredientFormSchema } from "@/schemas/form-schemas/ingredient-form-schema";
import { IngredientValidationSchema } from "@/schemas/validation/ingredient.validation";

const defaultValues: Record<keyof IngredientValidationSchema, string | number> =
  {
    id: "",
    name: "",
    category_code: "OTHER",
    purchase_price: 0,
    purchase_quantity: 0,
    code: "",
    unit: "gram",
    yield_percentage: 100,
    notes: "",
  };

export default function IngredientAddForm() {
  const onSubmit = (data: IngredientValidationSchema) => {};
  return (
    <FormRenderer
      schema={ingredientFormSchema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
    />
  );
}

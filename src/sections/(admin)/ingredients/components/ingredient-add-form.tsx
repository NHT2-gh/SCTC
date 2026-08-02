"use client";
import React from "react";
import FormRenderer from "@/components/form/FormRenderer";
import { ingredientFormSchema } from "@/schemas/form-schemas/ingredient-form-schema";
import { IngredientValidationSchema } from "@/schemas/validation/ingredient.validation";
import { useAddIngredient } from "@/hooks/queries/use-ingredient";
import { showToast } from "@/lib/toast";
import { mapErrorToMessage } from "@/lib/error/app-error";

const defaultValues = {
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
  const addIngredient = useAddIngredient();
  const onSubmit = async (data: IngredientValidationSchema) => {
    try {
      const res = await addIngredient.mutateAsync(data);

      if (res.success)
        showToast.success({
          title: "Thêm nguyên liệu thành công",
          description: `Đã thêm nguyên liệu ${data.name}`,
        });
    } catch (error) {
      showToast.error({
        title: "Thất bại",
        description: mapErrorToMessage(error),
      });
    }
  };
  return (
    <FormRenderer
      schema={ingredientFormSchema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
    />
  );
}

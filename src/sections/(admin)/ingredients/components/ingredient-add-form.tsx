"use client";
import React from "react";
import { showToast } from "@/lib/toast";
import FormRenderer from "@/components/form/FormRenderer";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { useAddIngredient } from "@/hooks/queries/use-ingredient";
import { ingredientFormSchema } from "@/schemas/form-schemas/ingredient-form-schema";
import { IngredientValidationSchema } from "@/schemas/validation/ingredient.validation";

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
  return <FormRenderer schema={ingredientFormSchema} onSubmit={onSubmit} />;
}

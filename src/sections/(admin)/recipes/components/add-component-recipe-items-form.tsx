import Form from "@/components/form/Form";
import React, { useState } from "react";
import { FormField } from "@/components/form";
import {
  ComponentRecipeItemsValidationSchema,
  recipeItemValidationSchema,
  RecipeItemValidationSchema,
} from "@/schemas/validation/component.validation";
import { useFieldArray, useForm } from "react-hook-form";
import { useIngredients } from "@/hooks/queries/use-ingredient";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddComponentRecipeItemsFormProps {
  componentId: string;
}
export default function AddComponentRecipeItemsForm({
  componentId,
}: AddComponentRecipeItemsFormProps) {
  const { data: ingredients } = useIngredients();
  const componentRecipeForm =
    useFormContext<ComponentRecipeItemsValidationSchema>();

  const { append } = useFieldArray({
    control: componentRecipeForm.control,
    name: "component_items",
  });

  const addComponentItemForm = useForm<RecipeItemValidationSchema>({
    resolver: zodResolver(recipeItemValidationSchema),
    defaultValues: {
      component_id: componentId,
      ingredient_id: "",
      quantity: 0,
    },
  });

  const { handleSubmit, reset } = addComponentItemForm;

  const onSubmit = (data: RecipeItemValidationSchema) => {
    append(data);
    reset();
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className="!grid-cols-3">
        <FormField
          form={addComponentItemForm}
          field={{
            name: "ingredient_id",
            type: "select",
            label: "Nguyên liệu",
            placeholder: "Chọn nguyên liệu",
            options:
              ingredients?.data.map((item) => ({
                label: `${item.name} ${item.notes ? `(${item.notes})` : ""}`,
                value: item.id,
              })) || [],
          }}
        />
        <FormField
          form={addComponentItemForm}
          field={{ name: "quantity", type: "number", label: "Khối lượng" }}
        />

        <Button
          type="submit"
          className="ml-auto block"
          onClick={handleSubmit(onSubmit)}
        >
          Thêm
        </Button>
      </Form>
    </>
  );
}

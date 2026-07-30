import Form from "@/components/form/Form";
import React from "react";
import { FormField } from "@/components/form";
import {
  ComponentRecipeItemsValidationSchema,
  componentRecipeItemValidationSchema,
  RecipeItemValidationSchema,
} from "@/schemas/validation/component.validation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useIngredients } from "@/hooks/queries/use-ingredient";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AddComponentRecipeItemsForm({
  componentId,
}: {
  componentId: string;
}) {
  const { data: ingredients } = useIngredients();
  const componentRecipeForm =
    useFormContext<ComponentRecipeItemsValidationSchema>();

  const { append } = useFieldArray({
    control: componentRecipeForm.control,
    name: "recipe_items",
  });

  const yieldQuantity = useWatch({
    control: componentRecipeForm.control,
    name: "yield_quantity",
  });

  const { setValue } = componentRecipeForm;

  const addComponentItemForm = useForm<RecipeItemValidationSchema>({
    resolver: zodResolver(componentRecipeItemValidationSchema),
    defaultValues: {
      ingredient_id: "",
      quantity: 0,
      component_id: componentId,
    },
  });

  const { handleSubmit, reset } = addComponentItemForm;

  const onSubmit = (data: RecipeItemValidationSchema) => {
    append(data);
    setValue("yield_quantity", yieldQuantity + data.quantity);
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

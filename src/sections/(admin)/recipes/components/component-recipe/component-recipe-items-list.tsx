import React from "react";
import { FormField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { ComponentRecipeItemsValidationSchema } from "@/schemas/validation/component.validation";
import { useIngredients } from "@/hooks/queries/use-ingredient";
import { Trash } from "lucide-react";

export default function ComponentRecipeItemsList() {
  const componentRecipeForm =
    useFormContext<ComponentRecipeItemsValidationSchema>();
  const { data: ingredients } = useIngredients();
  const { remove } = useFieldArray({
    control: componentRecipeForm.control,
    name: "recipe_items",
  });

  const componentItems = componentRecipeForm.watch("recipe_items");

  const yieldQuantity = useWatch({
    control: componentRecipeForm.control,
    name: "yield_quantity",
  });
  const {
    formState: { errors, isLoading },
    setValue,
  } = componentRecipeForm;
  return (
    <div className="space-y-2">
      {isLoading && <div>Đang tải...</div>}
      {errors?.recipe_items?.message ? (
        <p className="text-red-500">{errors?.recipe_items?.message}</p>
      ) : (
        componentItems.map((field, index) => (
          <div
            key={field.id ? field.id : index}
            className="flex gap-4 items-center"
          >
            <FormField
              form={componentRecipeForm}
              field={{
                name: `recipe_items.${index}.ingredient_id`,
                type: "select",
                options:
                  ingredients?.data.map((item) => ({
                    label: `${item.name} ${item.notes ? `(${item.notes})` : ""}`,

                    value: item.id,
                  })) || [],
              }}
            />
            <FormField
              form={componentRecipeForm}
              field={{
                name: `recipe_items.${index}.quantity`,
                type: "number",
              }}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="justify-self-end text-rose-600 hover:text-rose-600 hover:bg-rose-50 "
              onClick={() => {
                setValue(
                  "yield_quantity",
                  yieldQuantity - componentItems[index].quantity,
                );
                remove(index);
              }}
            >
              <Trash className="size-5" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
}

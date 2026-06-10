import React from "react";
import { FormField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ComponentRecipeItemsValidationSchema } from "@/schemas/validation/component.validation";
import { useIngredients } from "@/hooks/queries/use-ingredient";
import { Trash } from "lucide-react";

export default function ComponentRecipeItemsList() {
  const componentRecipeForm =
    useFormContext<ComponentRecipeItemsValidationSchema>();
  const { data: ingredients } = useIngredients();
  const { remove, append } = useFieldArray({
    control: componentRecipeForm.control,
    name: "component_items",
  });
  const componentItems = componentRecipeForm.watch("component_items");
  const {
    formState: { errors, isLoading },
  } = componentRecipeForm;
  return (
    <div className="space-y-2">
      {isLoading && <div>Đang tải...</div>}
      {errors?.component_items?.message ? (
        <p className="text-red-500">{errors?.component_items?.message}</p>
      ) : (
        componentItems.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-center">
            <FormField
              form={componentRecipeForm}
              field={{
                name: `component_items.${index}.ingredient_id`,
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
                name: `component_items.${index}.quantity`,
                type: "number",
              }}
            />
            <FormField
              form={componentRecipeForm}
              field={{
                name: `component_items.${index}.unit`,
                type: "select",
                options: [
                  { label: "Gram", value: "gram" },
                  { label: "Ml", value: "ml" },
                ],
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="justify-self-end text-rose-600 hover:text-rose-600 hover:bg-rose-50 "
              onClick={() => remove(index)}
            >
              <Trash className="size-5" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
}

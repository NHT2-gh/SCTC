import React, { useEffect, useState } from "react";
import { FormField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useIngredients } from "@/hooks/queries/use-ingredient";
import { Edit2, Trash } from "lucide-react";
import { ProductRecipeItemsValidationSchema } from "@/schemas/validation/recipe.validation";
import {
  useComponents,
  useGetComponentRecipeItems,
} from "@/hooks/queries/use-component";
import { Select } from "@/components/ui/select";
import { NumberInput } from "@/components/ui/input";
import { Component } from "@/types/component";

export default function ProductRecipeItemsList() {
  const productRecipeForm =
    useFormContext<ProductRecipeItemsValidationSchema>();
  const { data: ingredients } = useIngredients();
  const { data: components } = useComponents();
  const { remove } = useFieldArray({
    control: productRecipeForm.control,
    name: "recipe_items",
  });

  const productRecipeItems = productRecipeForm.watch("recipe_items");

  const {
    watch,
    getValues,
    formState: { errors, isLoading },
  } = productRecipeForm;

  const [viewComponent, setViewComponent] = useState<Component | null>(null);

  const { data: componentRecipeItems } = useGetComponentRecipeItems(
    viewComponent?.id || null,
  );

  return (
    <div className="space-y-2">
      {isLoading && <div>Đang tải...</div>}
      {errors?.recipe_items?.message ? (
        <p className="text-red-500">{errors?.recipe_items?.message}</p>
      ) : productRecipeItems.length > 0 ? (
        productRecipeItems.map((field, index) => (
          <div key={field.id} className="">
            <div className="flex gap-4 items-center">
              <FormField
                form={productRecipeForm}
                field={{
                  name: `recipe_items.${index}.ingredient_id`,
                  type: "select",
                  placeholder: "Chọn nguyên liệu",
                  options:
                    ingredients?.data.map((item) => ({
                      label: `${item.name} ${item.notes ? `(${item.notes})` : ""}`,
                      value: item.id,
                    })) || [],
                }}
              />

              <FormField
                form={productRecipeForm}
                field={{
                  name: `recipe_items.${index}.component_id`,
                  type: "select",
                  placeholder: "Chọn thành phần",
                  options:
                    components?.data.map((item) => ({
                      label: `${item.name} ${item.description ? `(${item.description})` : ""}`,
                      value: item.id,
                    })) || [],
                }}
              />

              <FormField
                form={productRecipeForm}
                field={{
                  name: `recipe_items.${index}.quantity`,
                  type: "number",
                }}
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  const component = components?.data.find(
                    (item) =>
                      item.id ===
                      getValues(`recipe_items.${index}.component_id`),
                  );
                  setViewComponent(component || null);
                }}
              >
                <Edit2 className="size-4" />
              </Button>
              <Button
                size="icon"
                type="button"
                className="justify-self-end"
                onClick={() => remove(index)}
              >
                <Trash className="size-4" />
              </Button>
            </div>

            {viewComponent?.id === field.component_id && viewComponent && (
              <ul className="space-y-2 mt-3 list-inside list-decimal ml-3">
                {componentRecipeItems?.data?.map((item, idx) => {
                  return (
                    <li key={item.id} className="flex items-center gap-3">
                      <span>{idx + 1}.</span>
                      <Select
                        type={"select"}
                        value={item.ingredient_id}
                        options={
                          ingredients?.data.map((item) => ({
                            label: `${item.name} ${item.notes ? `(${item.notes})` : ""}`,
                            value: item.id,
                          })) || []
                        }
                      />

                      {viewComponent && (
                        <NumberInput
                          className="w-fit"
                          type={"number"}
                          value={Math.floor(
                            (item.quantity / viewComponent.yield_quantity) *
                              getValues(`recipe_items.${index}.quantity`),
                          )}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))
      ) : (
        <div className="text-center">Chưa có thành phần</div>
      )}
    </div>
  );
}

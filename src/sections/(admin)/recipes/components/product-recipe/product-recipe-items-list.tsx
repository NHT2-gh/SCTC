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
import { NumberInput, TextInput } from "@/components/ui/input";
import { Component } from "@/types/component";
import { formatCurrency } from "@/utils/format-data";

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
    getValues,
    formState: { errors, isLoading },
  } = productRecipeForm;

  const [viewComponent, setViewComponent] = useState<Component | null>(null);

  const { data: componentRecipeItems } = useGetComponentRecipeItems(
    viewComponent?.id,
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
              {field.ingredient_id && (
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
              )}

              {field.component_id && (
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
              )}

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
                disabled={!field.component_id}
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
              <ul className="space-y-5 mt-4 list-inside  bg-gray-100 p-4 rounded-lg">
                {componentRecipeItems?.data?.map((item, idx) => {
                  return (
                    <li key={item.id} className="flex items-center gap-3">
                      <Select
                        type={"select"}
                        readOnly
                        value={item.ingredient_id}
                        options={
                          ingredients?.data.map((item) => ({
                            label: `${item.name} ${item.notes ? `(${item.notes})` : ""}`,
                            value: item.id,
                          })) || []
                        }
                      />

                      {viewComponent && (
                        <>
                          <NumberInput
                            className="w-fit"
                            type={"number"}
                            readOnly
                            value={Math.floor(
                              (item.quantity / viewComponent.yield_quantity) *
                                getValues(`recipe_items.${index}.quantity`),
                            )}
                          />
                          {item.ingredients?.cost_per_unit && (
                            <TextInput
                              className="w-fit"
                              type={"text"}
                              readOnly
                              value={formatCurrency(
                                Math.floor(
                                  (item.quantity /
                                    viewComponent.yield_quantity) *
                                    getValues(
                                      `recipe_items.${index}.quantity`,
                                    ) *
                                    item.ingredients?.cost_per_unit,
                                ),
                              )}
                            />
                          )}
                        </>
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

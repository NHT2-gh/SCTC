import React from "react";
import { FormField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useIngredients } from "@/hooks/queries/use-ingredient";
import { Trash } from "lucide-react";
import { ProductRecipeItemsValidationSchema } from "@/schemas/validation/recipe.validation";
import { useComponents } from "@/hooks/queries/use-component";

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
    formState: { errors, isLoading },
  } = productRecipeForm;

  return (
    <div className="space-y-2">
      {isLoading && <div>Đang tải...</div>}
      {errors?.recipe_items?.message ? (
        <p className="text-red-500">{errors?.recipe_items?.message}</p>
      ) : productRecipeItems.length > 0 ? (
        productRecipeItems.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-center">
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

            <button
              type="button"
              className="justify-self-end"
              onClick={() => remove(index)}
            >
              <Trash className="size-5 text-brand-500 " />
            </button>
          </div>
        ))
      ) : (
        <div className="text-center">Chưa có thành phần</div>
      )}
    </div>
  );
}

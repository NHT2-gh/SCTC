import React from "react";

import { v4 } from "uuid";
import Form from "@/components/form/Form";
import { ItemType } from "@/types/product";
import { FormField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useIngredients } from "@/hooks/queries/use-ingredient";
import {
  ProductRecipeItemsValidationSchema,
  ProductRecipeItemValidationSchema,
  productRecipeItemValidationSchema,
} from "@/schemas/validation/recipe.validation";
import { useComponents } from "@/hooks/queries/use-component";

interface AddProductRecipeItemsFormProps {
  productRecipeVersionId: string;
}
export default function AddProductRecipeItemsForm({
  productRecipeVersionId,
}: AddProductRecipeItemsFormProps) {
  const { data: ingredients } = useIngredients();
  const { data: components } = useComponents();

  const productRecipeForm =
    useFormContext<ProductRecipeItemsValidationSchema>();

  const { append } = useFieldArray({
    control: productRecipeForm.control,
    name: "recipe_items",
  });

  const addProductRecipeItemForm = useForm<ProductRecipeItemValidationSchema>({
    resolver: zodResolver(productRecipeItemValidationSchema),
    defaultValues: {
      quantity: 1,
      ingredient_id: "",
      component_id: "",
    },
  });

  const { handleSubmit, reset, setValue } = addProductRecipeItemForm;

  const onSubmit = (data: ProductRecipeItemValidationSchema) => {
    append({
      id: v4(),
      component_id: String(data.component_id).trim() || undefined,
      ingredient_id: String(data.ingredient_id).trim() || undefined,
      quantity: data.quantity,
      recipe_version_id: productRecipeVersionId,
      item_type: data.component_id ? ItemType.COMPONENT : ItemType.INGREDIENT,
    });

    reset({
      quantity: 1,
      ingredient_id: "",
      component_id: "",
    });
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, (err) => {
        console.log("VALIDATION ERROR", err);
      })}
      className="md:!grid-cols-4"
    >
      <FormField
        form={addProductRecipeItemForm}
        field={{
          name: "ingredient_id",
          type: "select",
          label: "Ingredient",
          placeholder: "Select ingredient",
          options: [
            {
              label: "None",
              value: "",
            },
          ].concat(
            ingredients?.data.map((item) => ({
              label: `${item.name} ${item.notes ? `(${item.notes})` : ""}`,
              value: item.id,
            })) || [],
          ),
        }}
      />

      {components && components.data && components?.data.length > 0 && (
        <FormField
          form={addProductRecipeItemForm}
          field={{
            name: "component_id",
            type: "select",
            label: "Component",
            placeholder: "Select component",
            options: [
              {
                label: "None",
                value: "",
              },
            ].concat(
              components?.data.map((item) => ({
                label: `${item.name} ${item.description ? `(${item.description})` : ""}`,
                value: item.id,
              })) || [],
            ),
          }}
        />
      )}

      <FormField
        form={addProductRecipeItemForm}
        field={{ name: "quantity", type: "number", label: "Quantity" }}
      />

      <Button type="submit" className="ml-auto block">
        Add
      </Button>
    </Form>
  );
}

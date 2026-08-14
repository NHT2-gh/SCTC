import React from "react";
import Form from "@/components/form/Form";
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
import { ItemType } from "@/types/product";
import { v4 } from "uuid";

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
    defaultValues: {},
  });

  const { handleSubmit, reset } = addProductRecipeItemForm;

  const onSubmit = (data: ProductRecipeItemValidationSchema) => {
    append({
      id: v4(),
      component_id: data.component_id,
      ingredient_id: data.ingredient_id,
      quantity: data.quantity,
      recipe_version_id: productRecipeVersionId,
      item_type: data.component_id ? ItemType.COMPONENT : ItemType.INGREDIENT,
    });
    reset();
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
          label: "Nguyên liệu",
          placeholder: "Chọn nguyên liệu",
          options:
            ingredients?.data.map((item) => ({
              label: `${item.name} ${item.notes ? `(${item.notes})` : ""}`,
              value: item.id,
            })) || [],
        }}
      />

      {components && components.data && components?.data.length > 0 && (
        <FormField
          form={addProductRecipeItemForm}
          field={{
            name: "component_id",
            type: "select",
            label: "Thành phần",
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
        form={addProductRecipeItemForm}
        field={{ name: "quantity", type: "number", label: "Khối lượng" }}
      />

      <Button
        type="submit"
        className="ml-auto block"
        onClick={handleSubmit(onSubmit, (err) => {
          console.log("VALIDATION ERROR", err);
        })}
      >
        Thêm
      </Button>
    </Form>
  );
}

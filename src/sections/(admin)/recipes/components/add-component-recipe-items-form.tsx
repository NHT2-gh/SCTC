import Form from "@/components/form/Form";
import React from "react";
import { FormField } from "@/components/form";
import {
  ComponentRecipeItemsValidationSchema,
  componentRecipeItemsValidationSchema,
} from "@/schemas/validation/component.validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIngredients } from "@/hooks/queries/use-ingredient";

export default function AddComponentRecipeItemsForm() {
  const { data: ingredients } = useIngredients();
  const form = useForm<ComponentRecipeItemsValidationSchema>({
    resolver: zodResolver(componentRecipeItemsValidationSchema),
    defaultValues: {
      ingredient_id: "",
      quantity: 0,
      unit: "gram",
    },
  });
  return (
    <Form onSubmit={() => {}} className="">
      <FormField
        form={form}
        field={{
          name: "ingredient_id",
          type: "select",
          options:
            ingredients?.data.map((item) => ({
              label: item.name,
              value: item.id,
            })) || [],
        }}
      />
      <FormField form={form} field={{ name: "quantity", type: "number" }}>
        <FormField
          form={form}
          className="absolute top-0 right-0 max-w-[100px]"
          field={{
            name: "unit",
            type: "select",
            options: [
              { label: "Gram", value: "gram" },
              { label: "Ml", value: "ml" },
            ],
          }}
        />
      </FormField>
    </Form>
  );
}

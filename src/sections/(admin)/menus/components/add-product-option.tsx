"use client";
import React from "react";

import Form from "@/components/form/Form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddProductOptionValidation,
  addProductOptionValidation,
} from "@/schemas/validation/product-option.validation";
import { FormField } from "@/components/form";
import { OptionType } from "@/types/menu";
import { useComponents } from "@/hooks/queries/use-component";
import { useIngredients } from "@/hooks/queries/use-ingredient";
import { useAddProductOption } from "@/hooks/queries/use-product";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";

export default function AddProductOption() {
  const { data: components } = useComponents();
  const { data: ingredients } = useIngredients();
  const addOption = useAddProductOption();
  const addProductOptionForm = useForm<AddProductOptionValidation>({
    resolver: zodResolver(addProductOptionValidation),
    mode: "onChange",
    defaultValues: {
      option_name: "",
      price: 0,
      description: "",

      option_type: "",
    },
  });

  const { handleSubmit } = addProductOptionForm;
  const onSubmit = async (data: AddProductOptionValidation) => {
    try {
      const result = await addOption.mutateAsync(data);

      if (result.success) {
        showToast.success({ title: "Thêm option thành công" });
      }
    } catch (error) {
      showToast.error({ title: "Thêm option thất bại" });
    }
  };

  return (
    <div className="bg-neutral-100 p-4 rounded-xl mt-4">
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="!grid-cols-[repeat(auto-fill,minmax(300px,1fr))]"
      >
        <FormField
          form={addProductOptionForm}
          field={{
            type: "text",
            name: "option_name",
            label: "Name",
            placeholder: "Name",
          }}
        />
        <FormField
          form={addProductOptionForm}
          field={{
            type: "number",
            name: "price",
            label: "Price",
            placeholder: "Price",
            formatCurrency: true,
          }}
        />

        <FormField
          form={addProductOptionForm}
          field={{
            type: "select",
            name: "option_type",
            label: "Option Type",
            placeholder: "Option Type",
            options: Object.entries(OptionType).map(([key, value]) => {
              return {
                label: value,
                value: key,
              };
            }),
          }}
        />
        {components?.data && (
          <FormField
            form={addProductOptionForm}
            field={{
              type: "select",
              name: "component_id",
              label: "Component",
              placeholder: "Component",
              options: components?.data.map((item) => ({
                value: item.id,
                label: item.name,
              })),
            }}
          />
        )}

        {ingredients?.data && (
          <FormField
            form={addProductOptionForm}
            field={{
              type: "select",
              name: "ingredient_id",
              label: "Ingredient ID",
              placeholder: "Ingredient ID",
              options: ingredients?.data.map((item) => ({
                value: item.id,
                label: item.name,
              })),
            }}
          />
        )}

        <FormField
          form={addProductOptionForm}
          className="col-span-2"
          field={{
            type: "textarea",
            name: "description",
            label: "Description",
            placeholder: "Description",
          }}
        />
      </Form>
      <Button
        onClick={handleSubmit(onSubmit, (err) => {
          console.log("VALIDATION ERROR", err);
        })}
      >
        Add
      </Button>
    </div>
  );
}

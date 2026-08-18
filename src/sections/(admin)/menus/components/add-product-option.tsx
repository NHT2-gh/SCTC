"use client";
import React, { useEffect } from "react";

import Form from "@/components/form/Form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpsertProductOptionValidation,
  upsertProductOptionValidation,
} from "@/schemas/validation/product-option.validation";
import { FormField } from "@/components/form";
import { OptionType, OptionTypeMapText } from "@/types/menu";
import { useComponents } from "@/hooks/queries/use-component";
import { useIngredients } from "@/hooks/queries/use-ingredient";
import { useUpsertProductOption } from "@/hooks/queries/use-product";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";

interface AddProductOptionProps {
  defaultValue?: UpsertProductOptionValidation;
}

export default function AddProductOption({
  defaultValue,
}: AddProductOptionProps) {
  const { data: components } = useComponents();
  const { data: ingredients } = useIngredients();
  const upsertProductOption = useUpsertProductOption();
  const addProductOptionForm = useForm<UpsertProductOptionValidation>({
    resolver: zodResolver(upsertProductOptionValidation),
    mode: "onChange",
    defaultValues: defaultValue ?? {
      option_name: "",
      price: 0,
      description: "",
      option_type: "",
    },
  });

  const { handleSubmit, reset } = addProductOptionForm;

  useEffect(() => {
    if (defaultValue) {
      reset(defaultValue);
    }
  }, [defaultValue]);

  const onSubmit = async (data: UpsertProductOptionValidation) => {
    try {
      const result = await upsertProductOption.mutateAsync(data);

      if (result.success) {
        showToast.success({ title: "Thêm option thành công" });
        reset();
      }
    } catch (error) {
      showToast.error({ title: "Thêm option thất bại" });
    }
  };

  return (
    <div className="bg-neutral-100 p-4 rounded-xl mt-4">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          form={addProductOptionForm}
          className="col-span-2"
          field={{
            type: "text",
            name: "option_name",
            label: "Name",
            placeholder: "Name",
            required: true,
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
            required: true,
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
                label: OptionTypeMapText[value],
                value: key,
              };
            }),
            required: true,
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
              label: "Ingredient",
              placeholder: "Ingredient",
              options: ingredients?.data.map((item) => ({
                value: item.id,
                label: `${item.name} ${item.notes ? `(${item.notes})` : ""}`,
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

        <FormField
          form={addProductOptionForm}
          field={{
            type: "switch",
            name: "is_default",
            label: "Đặt làm lựa chọn mặc định",
            description: "Option này có là option mặc định không",
          }}
        />
      </Form>

      <Button
        className="mt-5"
        onClick={handleSubmit(onSubmit, (err) => {
          console.log("VALIDATION ERROR", err);
        })}
      >
        Save
      </Button>
    </div>
  );
}

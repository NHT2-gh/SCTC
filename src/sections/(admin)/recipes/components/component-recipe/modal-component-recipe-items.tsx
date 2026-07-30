import Modal, { type ModalProps } from "@/components/ui/modal/modal";
import { Component, ComponentRecipeItem } from "@/types/component";
import React, { useState } from "react";
import { AddComponentRecipeItemsForm } from "..";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ComponentRecipeItemsValidationSchema,
  componentRecipeItemsValidationSchema,
  RecipeItemValidationSchema,
} from "@/schemas/validation/component.validation";
import ComponentRecipeItemsList from "./component-recipe-items-list";
import { Button } from "@/components/ui/button";
import { diffArray } from "@/utils/diff-array";
import {
  useDeleteComponentRecipeItems,
  useUpsertComponentRecipeItems,
} from "@/hooks/queries/use-component";
import Form from "@/components/form/Form";
import { Alert } from "@/components/alert";
import { FormField } from "@/components/form";
import { componentService } from "@/services/component.service";
import { showToast } from "@/lib/toast";
import { useCalculateProductCost } from "@/hooks/queries/use-product";

interface ModalComponentRecipeItemsProps {
  component: Component;
  items: ComponentRecipeItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalComponentRecipeItems({
  component,
  items,
  isOpen,
  onClose,
}: ModalComponentRecipeItemsProps) {
  const upsertRecipeItems = useUpsertComponentRecipeItems();
  const deleteRecipeItems = useDeleteComponentRecipeItems();
  const [result, setResult] = useState<{
    updated?: {
      items: number;
      success: boolean;
    };
    deleted?: {
      items: number;
      success: boolean;
    };
  }>();
  const componentRecipeItems = useForm<ComponentRecipeItemsValidationSchema>({
    resolver: zodResolver(componentRecipeItemsValidationSchema),
    defaultValues: {
      recipe_items: items,
      yield_quantity: component.yield_quantity,
    },
    mode: "onChange",
  });

  const {
    formState: { isDirty, dirtyFields },
    handleSubmit,
  } = componentRecipeItems;

  const onSubmit = async (data: ComponentRecipeItemsValidationSchema) => {
    if (dirtyFields.recipe_items) {
      const diffComponentItems = diffArray<RecipeItemValidationSchema>({
        initial: items,
        current: data.recipe_items,
        dirtyFields: dirtyFields.recipe_items,
      });

      if (diffComponentItems.upsert.length > 0) {
        const res = await upsertRecipeItems.mutateAsync({
          recipe_items: diffComponentItems.upsert,
        });
        setResult({
          updated: {
            success: res.success,
            items: diffComponentItems.upsert.length,
          },
        });
      }
      if (diffComponentItems.deleted.length > 0) {
        const res = await deleteRecipeItems.mutateAsync(
          diffComponentItems.deleted,
        );
        setResult({
          updated: {
            success: res.success,
            items: diffComponentItems.deleted.length,
          },
        });
      }
    }
    if (dirtyFields.yield_quantity) {
      try {
        const result = await componentService.updateComponent(component.id, {
          yield_quantity: data.yield_quantity,
        });
        if (result.success) showToast.success({ title: "Cập nhật thành công" });
      } catch {
        showToast.error({ title: "Cập nhật thất bại" });
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="md:max-w-[60rem] md:min-h-fit"
    >
      <h3 className="text-xl font-bold text-brand-700 mb-4">
        {component.name}
      </h3>
      <FormProvider {...componentRecipeItems}>
        <Form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log("VALIDATION ERROR", err);
          })}
        >
          {items.length === 0 && !dirtyFields.recipe_items && (
            <p className="italic text-gray-500 dark:text-gray-400">
              Chưa có nguyên liệu nào được thêm
            </p>
          )}
          <ComponentRecipeItemsList />

          <FormField
            field={{
              type: "number",
              label: "Khối lượng thành phẩm (g)",
              name: "yield_quantity",
            }}
            className="w-full max-w-[300px]"
            form={componentRecipeItems}
          />
          {result && (
            <>
              <p>
                Xoá {result.deleted?.items}{" "}
                {result.deleted?.success ? "Thành công" : "Thất bại"}
              </p>
              <p>
                Cập nhật {result.updated?.items}{" "}
                {result.updated?.success ? "Thành công" : "Thất bại"}
              </p>
            </>
          )}

          <Button
            type="submit"
            disabled={!isDirty}
            className="mt-4 ml-auto block"
          >
            Lưu thay đổi
          </Button>
        </Form>

        <div className="rounded-xl space-y-4 mt-6 border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <h4 className="font-bold text-brand-700">Thêm nguyên liệu</h4>
          <AddComponentRecipeItemsForm componentId={component.id} />
        </div>
      </FormProvider>
    </Modal>
  );
}

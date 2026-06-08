import Modal, { type ModalProps } from "@/components/ui/modal/modal";
import { ComponentRecipeItem } from "@/types/component";
import React, { useState } from "react";
import { AddComponentRecipeItemsForm } from ".";
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

interface ModalComponentRecipeItemsProps {
  componentId: string;
  items: ComponentRecipeItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalComponentRecipeItems({
  componentId,
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
      component_items: items,
    },
    mode: "onChange",
  });

  const {
    formState: { isDirty, dirtyFields },
    handleSubmit,
  } = componentRecipeItems;

  const onSubmit = async (data: ComponentRecipeItemsValidationSchema) => {
    if (dirtyFields.component_items) {
      const diffComponentItems = diffArray<RecipeItemValidationSchema>({
        initial: items,
        current: data.component_items,
        dirtyFields: dirtyFields.component_items,
      });

      if (diffComponentItems.upsert.length > 0) {
        const res = await upsertRecipeItems.mutateAsync(
          diffComponentItems.upsert,
        );
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
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="md:max-w-[60rem]">
      <h3 className="text-xl font-bold text-brand-700 mb-4">
        Công thức thành phần
      </h3>
      <FormProvider {...componentRecipeItems}>
        <Form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log("VALIDATION ERROR", err);
          })}
        >
          {items.length === 0 && !dirtyFields.component_items && (
            <p className="italic text-gray-500 dark:text-gray-400">
              Chưa có nguyên liệu nào được thêm
            </p>
          )}
          <ComponentRecipeItemsList />

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

        <div className="rounded-xl space-y-4 mt-5 border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <h4 className="font-bold text-brand-700">Thêm nguyên liệu</h4>
          <AddComponentRecipeItemsForm componentId={componentId} />
        </div>
      </FormProvider>
    </Modal>
  );
}

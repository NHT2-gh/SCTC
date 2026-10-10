import Modal, { type ModalProps } from "@/components/ui/modal/modal";
import { Component, ComponentRecipeItem } from "@/types/component";
import React, { useEffect, useState } from "react";
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
import { FormField } from "@/components/form";
import { componentService } from "@/services/component.service";
import { showToast } from "@/lib/toast";
import InputText from "@/components/ui/input/input-text";
import { ItemStateMap } from "@/types/common";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { CheckCircle2, X } from "lucide-react";

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
  const [itemStateMap, setItemStateMap] = useState<ItemStateMap>(new Map());
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

  useEffect(() => {
    if (items.length > 0) {
      componentRecipeItems.reset({
        name: component.name,
        recipe_items: items,
        yield_quantity: component.yield_quantity,
      });
    }
  }, [items]);

  const onSubmit = async (data: ComponentRecipeItemsValidationSchema) => {
    if (dirtyFields.recipe_items) {
      const diffComponentItems = diffArray<RecipeItemValidationSchema>({
        initial: items,
        current: data.recipe_items,
        dirtyFields: dirtyFields.recipe_items,
      });

      if (diffComponentItems.upsert.length > 0) {
        setItemStateMap((prev) => {
          prev.set("upsert_data", {
            isEditting: false,
          });
          return prev;
        });

        try {
          const res = await upsertRecipeItems.mutateAsync({
            recipe_items: diffComponentItems.upsert,
          });

          setItemStateMap((prev) => {
            prev.set("upsert_data", {
              isEditting: false,
              isSuccess: res.success,
              message: `Đã cập nhật thành công ${diffComponentItems.upsert.length} thành phần`,
            });
            return prev;
          });
        } catch (error) {
          setItemStateMap((prev) => {
            prev.set("upsert_data", {
              isEditting: false,
              isSuccess: false,
              message: mapErrorToMessage(error),
            });
            return prev;
          });
        }
      }
      if (diffComponentItems.deleted.length > 0) {
        setItemStateMap((prev) => {
          prev.set("delete_data", {
            isEditting: true,
            isSuccess: false,
          });
          return prev;
        });

        try {
          const res = await deleteRecipeItems.mutateAsync(
            diffComponentItems.deleted,
          );
          setItemStateMap((prev) => {
            prev.set("delete_data", {
              isEditting: true,
              isSuccess: res.success,
              message: `Đã xoá thành công ${diffComponentItems.deleted.length} thành phần`,
            });
            return prev;
          });
        } catch (error) {
          setItemStateMap((prev) => {
            prev.set("delete_data", {
              isEditting: true,
              isSuccess: false,
              message: mapErrorToMessage(error),
            });
            return prev;
          });
        }
      }
    }
    if (dirtyFields.yield_quantity || dirtyFields.name) {
      const nameState = dirtyFields.yield_quantity
        ? "yield_quantity"
        : dirtyFields.name
          ? "name"
          : "component_info";

      setItemStateMap((prev) => {
        prev.set(nameState, {
          isEditting: true,
        });
        return prev;
      });
      try {
        const res = await componentService.updateComponent(component.id, {
          yield_quantity: data.yield_quantity,
          name: data.name,
        });
        if (res.success) {
          setItemStateMap((prev) => {
            prev.set(nameState, {
              isEditting: false,
              isSuccess: true,
              message: `Đã cập nhật ${nameState === "yield_quantity" ? "khối lượng thành phẩm" : nameState === "name" ? "tên thành phẩm" : "thông tin thành phẩm"}`,
            });
            return prev;
          });
        }
      } catch (error) {
        setItemStateMap((prev) => {
          prev.set(nameState, {
            isEditting: false,
            isDeleting: false,
            isSuccess: false,
            message: mapErrorToMessage(error),
          });
          return prev;
        });
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="md:max-w-[60rem] md:min-h-fit"
    >
      <FormProvider {...componentRecipeItems}>
        <Form
          className="grid !grid-cols-1 gap-4"
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log("VALIDATION ERROR", err);
          })}
        >
          <FormField
            form={componentRecipeItems}
            field={{
              type: "text",
              name: "name",
              disabled: true,
            }}
            className="w-full font-bold text-brand-500 [&_.input-container]:border-0  [&_.input-container]:shadow-none [&_.input-container>input]:text-2xl"
          />
          {items && items.length === 0 && !dirtyFields.recipe_items && (
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
            className="w-full"
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

          {Array.from(itemStateMap.entries()).map(([key, value]) => {
            return (
              <p
                key={key}
                className="flex items-center text-danger italic text-sm"
              >
                {value.isSuccess ? (
                  <CheckCircle2 fill="#16a34a" stroke="white" />
                ) : value.isSuccess === false ? (
                  <X fill="#dc2626" />
                ) : null}

                {value.message}
              </p>
            );
          })}

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

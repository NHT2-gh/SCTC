import Modal from "@/components/ui/modal/modal";
import { Component, ComponentRecipeItem } from "@/types/component";
import React, { useEffect } from "react";
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
import { mapErrorToMessage } from "@/lib/error/app-error";
import { useUrlState } from "@/hooks/use-url-state";
import { useItemState } from "@/hooks/use-item-state";
import { RequestState } from "@/types/common";
import BoxResult from "@/components/common/data-state/box_result";

interface ModalComponentRecipeItemsProps {
  component: Component;
  items: ComponentRecipeItem[];
  isOpen: boolean;
  onClose: () => void;
}

enum StateKey {
  updateComponent = "update-component",
  updateInfoRecipt = "update-info-recipt",
}

export default function ModalComponentRecipeItems({
  component,
  items,
  isOpen,
  onClose,
}: ModalComponentRecipeItemsProps) {
  const { setState, getValue, setValue, getState, hasState } =
    useItemState<RequestState>();
  const upsertRecipeItems = useUpsertComponentRecipeItems();
  const deleteRecipeItems = useDeleteComponentRecipeItems();
  const [_, setViewComponentRecipe] = useUrlState<string>("component_id ");

  const componentRecipeItems = useForm<ComponentRecipeItemsValidationSchema>({
    resolver: zodResolver(componentRecipeItemsValidationSchema),
    defaultValues: {
      recipe_items: items,
      yield_quantity: component.yield_quantity,
      name: component.name,
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

      if (
        diffComponentItems.upsert.length > 0 ||
        diffComponentItems.deleted.length > 0
      ) {
        setState(StateKey.updateComponent, {
          isEditting: true,
          message: "Đang cập nhật công thức",
        });

        if (diffComponentItems.upsert.length > 0) {
          try {
            const res = await upsertRecipeItems.mutateAsync({
              recipe_items: diffComponentItems.upsert,
            });
            if (res.success) {
              setState(StateKey.updateComponent, {
                isSuccess: true,
                message: `Đã cập nhật ${diffComponentItems.upsert.length} thành phần trong công thức`,
              });
            } else {
              setState(StateKey.updateComponent, {
                isSuccess: false,
                isError: true,

                message: `Không thể  ${diffComponentItems.upsert.length} thành phần trong công thức`,
              });
            }
          } catch (error) {
            {
              setState(StateKey.updateComponent, {
                isSuccess: false,
                isError: true,

                message: `Có lỗi xảy ra trong quá trình cập nhật. Thử lại sau`,
              });
            }
          } finally {
            setValue(StateKey.updateComponent, "isProgressing", false);
          }
        }
        if (diffComponentItems.deleted.length > 0) {
          setState(StateKey.updateComponent, {
            isEditting: true,
            message: "Đang tiến hành xoá thành phần trong công thức",
          });

          try {
            const res = await deleteRecipeItems.mutateAsync(
              diffComponentItems.deleted,
            );
            if (res.success) {
              setState(StateKey.updateComponent, {
                isSuccess: true,
                message: `Xoá thành công ${diffComponentItems.deleted.length} thành phần trong công thức`,
              });
            } else {
              setState(StateKey.updateComponent, {
                isSuccess: false,
                isError: true,

                message: `Không thể xoá ${diffComponentItems.deleted.length} thành phần trong công thức`,
              });
            }
          } catch (error) {
            {
              setState(StateKey.updateComponent, {
                isSuccess: false,
                isError: true,

                message: `Có lỗi xảy ra trong quá trình xoá. Thử lại sau`,
              });
            }
          } finally {
            setValue(StateKey.updateComponent, "isProgressing", false);
          }
        }
      } else
        setState(StateKey.updateComponent, {
          isEditting: false,
          isSuccess: false,
        });
    }
    if (dirtyFields.yield_quantity || dirtyFields.name) {
      const nameState = dirtyFields.yield_quantity
        ? "yield_quantity"
        : dirtyFields.name
          ? "name"
          : "component_info";

      setState(StateKey.updateInfoRecipt, {
        isProgressing: true,
      });

      try {
        const res = await componentService.updateComponent(component.id, {
          yield_quantity: data.yield_quantity,
          name: data.name,
        });
        if (res.success) {
          setState(StateKey.updateInfoRecipt, {
            isSuccess: true,
            message: `Đã cập nhật ${nameState === "yield_quantity" ? "khối lượng thành phẩm" : nameState === "name" ? "tên thành phẩm" : "thông tin thành phẩm"}`,
          });
        } else {
          setState(StateKey.updateInfoRecipt, {
            isSuccess: false,
            isError: true,
            message: `Cập nhật thất bại ${nameState === "yield_quantity" ? "khối lượng thành phẩm" : nameState === "name" ? "tên thành phẩm" : "thông tin thành phẩm"}`,
          });
        }
      } catch (error) {
        setState(StateKey.updateInfoRecipt, {
          isSuccess: false,
          isError: true,
          message: mapErrorToMessage(error),
        });
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setViewComponentRecipe(undefined);
        onClose();
      }}
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
            className="w-full font-bold text-brand-500 [&_.input-container]:border-0 [&_.input-container]:shadow-none [&_.input-container>input]:text-2xl"
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

          {hasState(StateKey.updateComponent) && (
            <BoxResult state={getState(StateKey.updateComponent)!} />
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

import React, { useEffect, useState } from "react";
import Modal, { ModalProps } from "@/components/ui/modal/modal";
import { useForm } from "react-hook-form";
import {
  productRecipeItemsValidationSchema,
  ProductRecipeItemsValidationSchema,
  ProductRecipeItemValidationSchema,
} from "@/schemas/validation/recipe.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { diffArray } from "@/utils/diff-array";
import Form from "@/components/form/Form";
import { ProductRecipeVersion } from "@/types/product";
import {
  useDeleteProductRecipeItem,
  useGetProductRecipeDetail,
  useUpsertProductRecipeItem,
  useUpsertProductRecipeVersion,
} from "@/hooks/queries/use-product";
import { AddProductRecipeItemsForm, ProductRecipeItemsList } from "..";
import { formatCurrency } from "@/utils/format-data";
import { FormField } from "@/components/form";
import { CheckCircle2, X } from "lucide-react";
import { mapErrorToMessage } from "@/lib/error/app-error";

type ItemStateMap = Map<
  string,
  {
    isEditting?: boolean;
    isDeleting?: boolean;
    isSuccess?: boolean;
    message?: string;
  }
>;

export default function ModalProductRecipeEdit({
  isOpen,
  onClose,
  currentRecipe,
}: Omit<ModalProps, "children"> & {
  currentRecipe: ProductRecipeVersion;
}) {
  const [currentId, setCurrentId] = useState(currentRecipe.id);
  const { data: recipeItems, refetch } = useGetProductRecipeDetail(currentId);
  const upsertProductRecipeVersion = useUpsertProductRecipeVersion();
  const upsertRecipeItems = useUpsertProductRecipeItem();
  const deleteRecipeItems = useDeleteProductRecipeItem();
  const [itemStateMap, setItemStateMap] = useState<ItemStateMap>(new Map());

  const productRecipeItems = useForm<ProductRecipeItemsValidationSchema>({
    resolver: zodResolver(productRecipeItemsValidationSchema),
    defaultValues: {
      recipe_items: recipeItems?.data || [],
      note: currentRecipe.note || "",
    },
    mode: "onChange",
  });

  const {
    formState: { isDirty, dirtyFields, errors },
    setValue,
    handleSubmit,
  } = productRecipeItems;

  useEffect(() => {
    setCurrentId(currentRecipe.id);
  }, [currentRecipe]);

  useEffect(() => {
    setValue("recipe_items", recipeItems?.data || []);
  }, [recipeItems]);

  const onSubmit = async (data: ProductRecipeItemsValidationSchema) => {
    if (dirtyFields.recipe_items && recipeItems?.data) {
      const diffComponentItems = diffArray<ProductRecipeItemValidationSchema>({
        initial: recipeItems?.data,
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
            id: currentRecipe.id,
            data: diffComponentItems.upsert,
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
      }
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

      await refetch();
    }

    if (dirtyFields.note) {
      setItemStateMap((prev) => {
        prev.set("note", {
          isEditting: true,
        });
        return prev;
      });
      try {
        const res = await upsertProductRecipeVersion.mutateAsync({
          id: currentRecipe.id,
          note: data.note,
          product_id: currentRecipe.products.id,
        });

        if (res.success) {
          setItemStateMap((prev) => {
            prev.set("note", {
              isEditting: false,
              isSuccess: true,
              message: `Đã cập nhật ghi chú thành "${data.note}"`,
            });
            return prev;
          });
        }
      } catch (error) {
        setItemStateMap((prev) => {
          prev.set("note", {
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
    <Modal isOpen={isOpen} onClose={onClose} className="md:max-w-[60rem]">
      <h3 className="text-xl font-bold text-brand-700 mb-4">
        Công thức {currentRecipe.products.name} v{currentRecipe.version_number}
      </h3>
      <FormProvider {...productRecipeItems}>
        <Form className="block space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <ProductRecipeItemsList />

          <div className="space-y-2">
            <FormField
              form={productRecipeItems}
              field={{
                name: "note",
                label: "Note",
                type: "textarea",
                placeholder: "Enter note...",
              }}
            />
          </div>

          <p className="mt-4 mb-4 font-semibold">
            Total Cost: {formatCurrency(currentRecipe.cost)}
          </p>

          {Array.from(itemStateMap.entries()).map(([key, value]) => {
            return (
              <p
                key={key}
                className="inline-flex items-center text-danger italic text-sm"
              >
                {value.isSuccess ? (
                  <CheckCircle2 fill="#16a34a" stroke="white" />
                ) : (
                  <X fill="#dc2626" />
                )}

                {value.message}
              </p>
            );
          })}

          <Button
            type="submit"
            disabled={!isDirty}
            className="mt-4 ml-auto block"
          >
            Save Changes
          </Button>
        </Form>

        <div className="rounded mt-10 space-y-4 border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <h4 className="font-bold text-brand-700">Add Recipe Items</h4>
          <AddProductRecipeItemsForm
            productRecipeVersionId={currentRecipe.id}
          />
        </div>
      </FormProvider>
    </Modal>
  );
}

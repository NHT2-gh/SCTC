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
} from "@/hooks/queries/use-product";
import { AddProductRecipeItemsForm, ProductRecipeItemsList } from "..";
import { formatCurrency } from "@/utils/format-data";
import { FormField } from "@/components/form";

export default function ModalProductRecipeEdit({
  isOpen,
  onClose,
  currentRecipe,
}: Omit<ModalProps, "children"> & {
  currentRecipe: ProductRecipeVersion;
}) {
  const [currentId, setCurrentId] = useState(currentRecipe.id);
  const { data: recipeItems, refetch } = useGetProductRecipeDetail(currentId);
  const upsertRecipeItems = useUpsertProductRecipeItem();
  const deleteRecipeItems = useDeleteProductRecipeItem();
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
    console.log(data.recipe_items);
    if (dirtyFields.recipe_items && recipeItems?.data) {
      const diffComponentItems = diffArray<ProductRecipeItemValidationSchema>({
        initial: recipeItems?.data,
        current: data.recipe_items,
        dirtyFields: dirtyFields.recipe_items,
      });
      if (diffComponentItems.upsert.length > 0) {
        const res = await upsertRecipeItems.mutateAsync({
          id: currentRecipe.id,
          data: diffComponentItems.upsert,
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

      await refetch();
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

          <div className="space-y-2">
            <FormField
              form={productRecipeItems}
              field={{
                name: "note",
                label: "Ghi chú",
                type: "textarea",
                placeholder: "Nhập ghi chú...",
              }}
            />
          </div>

          <p className="mt-4 mb-4 font-semibold">
            Giá vốn: {formatCurrency(currentRecipe.cost)}
          </p>

          <Button
            type="submit"
            disabled={!isDirty}
            className="mt-4 ml-auto block"
          >
            Lưu thay đổi
          </Button>
        </Form>

        <div className="rounded mt-10 space-y-4 border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <h4 className="font-bold text-brand-700">Thêm thành phần</h4>
          <AddProductRecipeItemsForm
            productRecipeVersionId={currentRecipe.id}
          />
        </div>
      </FormProvider>
    </Modal>
  );
}

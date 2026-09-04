"use client";
import { ComponentCard } from "@/components/common/component-card";
import ImagesDropzone, {
  ImageItem,
} from "@/components/dropzone/images-dropzone";
import { FormField } from "@/components/form";
import Form from "@/components/form/Form";
import SearchSelecter from "@/components/search-selecter/search-selecter";
import { TableHeader } from "@/components/table";
import { Button } from "@/components/ui/button";
import InputNumber from "@/components/ui/input/input-number";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  useAllOption,
  useDeleteMenuItemOption,
  useUpdateProductInfo,
  useUpsertProductOption,
} from "@/hooks/queries/use-menu";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { showToast } from "@/lib/toast";
import {
  menuItemEditValidation,
  MenuItemEditValidation,
  ProductOptionValidation,
} from "@/schemas/validation/menu.validation";
import { uploadImage } from "@/supabase/storage/storageClinets";
import { ProductDetail, ProductType } from "@/types/product";
import { diffArray } from "@/utils/diff-array";
import { formatCurrency } from "@/utils/format-data";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";
import { AddProductOptionForm } from ".";
import { DataEmpty } from "@/components/common/table/state";
import { Edit2Icon, RefreshCcw, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useGetProductOptions } from "@/hooks/queries/use-product";

export default function MenuItemEditForm({ data }: { data: ProductDetail }) {
  const { refetch } = useGetProductOptions(data.info.id);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>(
    data.info.products.image_url?.map((item) => {
      return {
        id: v4(),
        file: new File([], item),
        status: "success",
        uploadedUrl: item,
        previewUrl: item,
      };
    }),
  );
  const { data: optionsData } = useAllOption({
    filters: {
      type: "custom",
    },
  });
  const [edittingOption, setEdittingOption] =
    useState<ProductOptionValidation | null>(null);
  const updateInfo = useUpdateProductInfo(data.info.menu_id);
  const upsertProductOptions = useUpsertProductOption();
  const deleteProductOptions = useDeleteMenuItemOption();

  const editForm = useForm<MenuItemEditValidation>({
    resolver: zodResolver(menuItemEditValidation),
    mode: "onChange",
    defaultValues: {
      info: {
        id: data.info.products.id || "",
        name: data.info.products.name || "",
        description: data.info.products.description || "",
        selling_price: data.info.products.selling_price || 0,
        image_url: data.info.products.image_url || [],
        is_active: data.info.products.is_active || false,
        cost: data.info.products.cost || 0,
        product_type: data.info.products.product_type || ProductType.coffee,
      },
      options: [...data.options.custom]
        .filter((option) => {
          if (!option.id) return false;
          return true;
        })
        .map((option) => {
          return {
            id: option.id || "",
            menuItemId: option.menu_item_id,
            option_id: String(option.option_id),
            option_name: option.component_name,
            component_id: option.component_id,
            ingredient_id: option.ingredient_id,
            ingredient_name: option.ingredient_name,
            price: option.price,
            option_type: option.option_type,
            description: option.description || "",
            limit: option.limit || null,
            is_default: option.is_default || false,
          };
        }),
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { dirtyFields, isLoading },
  } = editForm;

  useEffect(() => {
    if (images && images.length > 0) {
      setValue(
        "info.image_url",
        images
          .filter((img) => img.status === "success")
          .map((img) => img.uploadedUrl!),
      );
    } else {
      return;
    }
  }, [images]);

  const { replace } = useFieldArray({
    control: editForm.control,
    name: "options",
  });

  //Handle images upload
  const handleUploadImages = async (images: ImageItem[]) => {
    setIsUploading(true);
    const idleImages = images.filter((img) => img.status === "idle");
    await Promise.all(
      idleImages.map(async (img) => {
        setImages((prev) =>
          prev.map((item) =>
            item.id === img.id ? { ...item, status: "uploading" } : item,
          ),
        );

        const { imageUrl, error } = await uploadImage({
          file: img.file,
          bucket: "products",
        });

        setImages((prev) =>
          prev.map((item) =>
            item.id === img.id
              ? {
                  ...item,
                  status: error ? "error" : "success",
                  uploadedUrl: imageUrl,
                }
              : item,
          ),
        );
      }),
    );

    setIsUploading(false);
  };
  //Handle options
  const currentOptions = editForm.getValues("options");

  const handleChangeItems = (ids: string[]) => {
    if (!currentOptions) return [];

    const nextOptions = ids.flatMap((id) => {
      const existed = currentOptions.find((o) => o.option_id === id);

      if (existed) return [existed];

      const optionInfo = optionsData?.data.find((o) => String(o.id) === id);

      if (!optionInfo) return [];

      return [
        {
          id: v4(),
          menuItemId: data.info.id,
          option_name: optionInfo.option_name,
          option_id: String(optionInfo.id),
          ingredient_id: optionInfo.ingredients?.id,
          component_id: optionInfo.components?.id,
          price: optionInfo.price,
          limit: optionInfo.limit || null,
          option_type: optionInfo.option_type,
          is_default: optionInfo.is_default || false,
          description: optionInfo.description || "",
        },
      ];
    });

    replace(nextOptions);
  };

  //Submit form
  const onSubmit = async (formData: MenuItemEditValidation) => {
    try {
      const reult = await updateInfo.mutateAsync(formData.info);

      if (reult.success) {
        showToast.success({ title: "Update info success" });
      }
    } catch (error) {
      showToast.error({
        title: "Update failed",
        description: mapErrorToMessage(error),
      });
    }

    if (dirtyFields.options && data.options && currentOptions) {
      const { upsert, deleted } = diffArray<ProductOptionValidation>({
        current: currentOptions,
        initial: data.options.custom,
        dirtyFields: dirtyFields.options!,
      });

      if (upsert) {
        try {
          const upsertProductResult =
            await upsertProductOptions.mutateAsync(upsert);
          if (upsertProductResult.success)
            showToast.success({ title: "Thành công" });
        } catch {}
      }

      if (deleted) {
        try {
          const deleteProductOptionResult =
            await deleteProductOptions.mutateAsync({
              menuItemId: data.info.id,
              optionId: deleted,
            });
          if (deleteProductOptionResult.success)
            showToast.success({ title: "Xoá thành công" });
        } catch {}
      }
    }
  };

  return (
    <section className="space-y-4">
      <Form
        className="!grid-cols-2"
        onSubmit={handleSubmit(onSubmit, (err) => {
          console.log("VALIDATION ERROR", err);
        })}
      >
        <FormField
          form={editForm}
          field={{
            name: "info.name",
            type: "text",
            label: "Tên sản phẩm",
            required: true,
          }}
        />

        <FormField
          form={editForm}
          field={{
            name: "info.product_type",
            type: "select",
            label: "Loại sản phẩm",
            required: true,
            options: Object.entries(ProductType).map(([key, value]) => ({
              value: value,
              label: key,
            })),
          }}
        />

        <FormField
          form={editForm}
          field={{
            name: "info.cost",
            type: "number",
            label: "Giá vốn",
            readOnly: true,
            formatCurrency: true,
          }}
        />

        <FormField
          form={editForm}
          field={{
            name: "info.selling_price",
            type: "number",
            formatCurrency: true,
            label: "Giá bán",
          }}
        />

        <FormField
          form={editForm}
          className="col-span-2"
          field={{ name: "info.description", type: "textarea", label: "Mô tả" }}
        />

        <FormField
          form={editForm}
          field={{
            name: "info.is_active",
            type: "switch",
            label: "Publish",
          }}
        />
      </Form>

      <ImagesDropzone
        images={images}
        onChange={setImages}
        onUpload={handleUploadImages}
        isUploading={isUploading}
      />

      {currentOptions && (
        <ComponentCard title={"Options"}>
          <div className="flex items-center justify-between">
            <SearchSelecter
              onChange={(ids) => handleChangeItems(ids)}
              defaultSelectedOption={currentOptions.map(
                (item) => String(item.option_id)!,
              )}
            />

            <Button
              onClick={() => {
                refetch();
              }}
              disabled={currentOptions.length === 0}
              variant="outline"
            >
              <RefreshCcw /> Refetch
            </Button>
          </div>
          <Table>
            <TableHeader
              columns={[
                {
                  title: "Name",
                  key: "name",
                },
                { title: "Description", key: "desc" },
                {
                  title: "Price",
                  key: "price",
                },
                {
                  title: "Limit",
                  key: "limit",
                },
                {
                  title: "Is Default",
                  key: "is_default",
                },
                {
                  title: "",
                  key: "actions",
                },
              ]}
            />

            <TableBody>
              {currentOptions.length === 0 ||
                (isLoading && (
                  <DataEmpty
                    message={
                      isLoading
                        ? "Đang tải dữ liệu"
                        : "Không có dữ liệu phù hợp"
                    }
                    colSpan={4}
                  />
                ))}
              {currentOptions.map((option, index) => (
                <TableRow key={option.id}>
                  <TableCell>{option.option_name}</TableCell>
                  <TableCell>{option.description}</TableCell>

                  <TableCell>{formatCurrency(option.price)}</TableCell>
                  <TableCell>
                    <InputNumber
                      className="min-w-[70px] text-center"
                      handleOnChange={(value: number) =>
                        setValue(`options.${index}.limit`, value)
                      }
                      type={"number"}
                      value={option?.limit ?? 9999}
                    />
                  </TableCell>

                  <TableCell>
                    <Switch
                      value={option.is_default}
                      onChange={(checked) =>
                        setValue(`options.${index}.is_default`, checked)
                      }
                    />
                  </TableCell>

                  <TableCell className="flex gap-2 items-center h-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEdittingOption(option)}
                    >
                      <Edit2Icon size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleChangeItems(
                          currentOptions
                            .filter(
                              (item) => item.option_id !== option.option_id,
                            )
                            .map((item) => String(item.option_id)),
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <AddProductOptionForm
            defaultValue={
              edittingOption
                ? {
                    id: Number(edittingOption.option_id),
                    option_name: edittingOption.option_name!,
                    option_type: edittingOption.option_type!,
                    price: edittingOption.price,
                    component_id: edittingOption.component_id,
                    ingredient_id: edittingOption.ingredient_id,
                    description: edittingOption.description ?? "",
                    is_default: edittingOption.is_default ?? false,
                  }
                : undefined
            }
          />
        </ComponentCard>
      )}

      <Button
        type="submit"
        onClick={handleSubmit(onSubmit, (err) => {
          console.log("VALIDATION ERROR", err);
        })}
      >
        Cập nhật
      </Button>
    </section>
  );
}

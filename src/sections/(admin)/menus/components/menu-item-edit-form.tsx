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
import { ProductDetail } from "@/types/product";
import { diffArray } from "@/utils/diff-array";
import { formatCurrency } from "@/utils/format-data";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";

export default function MenuItemEditForm({ data }: { data: ProductDetail }) {
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
  const updateInfo = useUpdateProductInfo(data.info.menu_id);
  const upsertProductOptions = useUpsertProductOption();
  const editForm = useForm<MenuItemEditValidation>({
    resolver: zodResolver(menuItemEditValidation),
    mode: "onChange",
    defaultValues: {
      info: {
        id: data.info.products.id,
        name: data.info.products.name,
        description: data.info.products.description,
        selling_price: data.info.products.selling_price,
        image_url: data.info.products.image_url,
      },
      options: [...data.options.custom].map((option) => {
        return {
          id: option.id,
          menuItemId: option.menu_item_id,
          option_id: String(option.option_id),
          option_name: option.component_name,
          component_id: option.component_id,
          price: option.price,
          option_type: option.option_type,
          description: option.description || "",
          limit: option.limit || 0,
        };
      }),
    },
  });
  const {
    handleSubmit,
    setValue,
    formState: { dirtyFields },
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

      const optionInfo = optionsData?.data.find((o) => o.id === id);

      if (!optionInfo) return [];

      return [
        {
          id: v4(),
          menuItemId: data.info.id,
          option_name: optionInfo.option_name,
          option_id: String(optionInfo.id),
          price: optionInfo.price,
        },
      ];
    });

    replace(nextOptions);
  };

  //Submit form
  const onSubmit = async (data: MenuItemEditValidation) => {
    try {
      const reult = await updateInfo.mutateAsync(data.info);

      if (!reult.success) {
        throw new Error("Update failed");
      }

      showToast.success({ title: "Update info success" });
    } catch (error) {
      showToast.error({
        title: "Update failed",
        description: mapErrorToMessage(error),
      });
    }

    if (dirtyFields.options && data.options && currentOptions) {
      const { upsert, deleted } = diffArray<ProductOptionValidation>({
        current: currentOptions,
        initial: data.options,
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
          field={{ name: "info.name", type: "text", label: "Tên sản phẩm" }}
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
      </Form>

      <ImagesDropzone
        images={images}
        onChange={setImages}
        onUpload={handleUploadImages}
        isUploading={isUploading}
      />

      {currentOptions && (
        <ComponentCard title={"Options"}>
          <SearchSelecter
            onChange={(ids) => handleChangeItems(ids)}
            defaultSelectedOption={currentOptions.map(
              (item) => String(item.option_id)!,
            )}
          />
          <Table>
            <TableHeader
              columns={[
                {
                  title: "Tên Option",
                  key: "name",
                },
                {
                  title: "Giá",
                  key: "price",
                },
                {
                  title: "Số lượng tối đa",
                  key: "limit",
                },
              ]}
            />

            <TableBody>
              {currentOptions.map((option, index) => (
                <TableRow key={option.id}>
                  <TableCell>{option.option_name}</TableCell>
                  <TableCell>{formatCurrency(option.price)}</TableCell>
                  <TableCell>
                    <InputNumber
                      handleOnChange={(value: number) =>
                        setValue(`options.${index}.limit`, value)
                      }
                      type="number"
                      value={option.limit}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

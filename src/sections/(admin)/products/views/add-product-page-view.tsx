"use client";
import { MainContainer } from "@/components/common/page-layout";
import ImagesDropzone, {
  ImageItem,
} from "@/components/dropzone/images-dropzone";
import { FormField } from "@/components/form";
import Form from "@/components/form/Form";
import { Button } from "@/components/ui/button";
import { useAddProduct } from "@/hooks/queries/use-product";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { showToast } from "@/lib/toast";
import {
  productInfoValidation,
  ProductInfoValidation,
} from "@/schemas/validation/menu.validation";
import { uploadImage } from "@/supabase/storage/storageClinets";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";

export default function AddProductPageView() {
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const addProduct = useAddProduct();
  const addForm = useForm<ProductInfoValidation>({
    resolver: zodResolver(productInfoValidation),
    mode: "onChange",
    defaultValues: {
      id: v4(),
      name: "",
      description: "",
      selling_price: 0,
      is_active: false,
    },
  });

  const { handleSubmit, setValue, reset, watch } = addForm;

  useEffect(() => {
    if (images && images.length > 0) {
      setValue(
        "image_url",
        images
          .filter((img) => img.status === "success")
          .map((img) => img.uploadedUrl!),
      );
    } else {
      return;
    }
  }, [images]);

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

  console.log(watch("is_active"));

  const onSubmit = async (data: ProductInfoValidation) => {
    try {
      const result = await addProduct.mutateAsync(data);
      if (result.success) {
        showToast.success({ title: "Thêm sản phẩm thành công" });
        reset();
        setValue("id", v4());
      }
    } catch (error) {
      showToast.error({
        title: "Thêm sản phẩm thất bại",
        description: mapErrorToMessage(error),
      });
    }
  };
  return (
    <MainContainer title="Thêm sản phẩm mới">
      <Form
        className="!grid-cols-2"
        onSubmit={handleSubmit(onSubmit, (err) => {
          console.log("VALIDATION ERROR", err);
        })}
      >
        <FormField
          form={addForm}
          field={{
            name: "name",
            type: "text",
            label: "Tên sản phẩm",
            placeholder: "Nhập tên sản phẩm",
            required: true,
          }}
        />

        <FormField
          form={addForm}
          field={{
            name: "selling_price",
            type: "number",
            formatCurrency: true,
            label: "Giá bán",
            required: true,
          }}
        />

        <FormField
          form={addForm}
          className="col-span-2"
          field={{
            name: "description",
            type: "textarea",
            label: "Mô tả",
            placeholder: "Nhập mô tả sản phẩm",
          }}
        />

        <FormField
          form={addForm}
          field={{
            name: "is_active",
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

      <Button
        type="submit"
        disabled={images.some((item) => item.status === "idle") || isUploading}
        onClick={handleSubmit(onSubmit, (err) => {
          console.log("VALIDATION ERROR", err);
        })}
      >
        Thên sản phẩm
      </Button>
    </MainContainer>
  );
}

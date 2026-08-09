"use client";
import React from "react";
import { FormRenderer } from "@/components/form";
import { addPromotionFormSchema } from "@/schemas/form-schemas/promotion-form-schema";
import { MainContainer } from "@/components/common/page-layout";
import { useAddPromotion } from "@/hooks/queries/use-promotion";
import { promotionValidation } from "@/schemas/validation/promotion.validation";
import { showToast } from "@/lib/toast";

interface AddPromotionPageViewProps {
  defaultValue?: promotionValidation;
}

export default function AddPromotionPageView({
  defaultValue,
}: AddPromotionPageViewProps) {
  const addPromotion = useAddPromotion();

  const handleSubmit = async (data: promotionValidation) => {
    try {
      const result = await addPromotion.mutateAsync(data);
      if (result.success) {
        showToast.success({ title: "Thêm khuyến mã thành công" });
      }
    } catch (err) {
      showToast.error({ title: "Lỗi khi thêm khuyến mã" });
    }
  };

  return (
    <MainContainer title="Add Promotion">
      <FormRenderer
        schema={addPromotionFormSchema}
        onSubmit={handleSubmit}
        defaultValues={defaultValue}
        submitButtonText="Thêm khuyến mãi"
      />
    </MainContainer>
  );
}

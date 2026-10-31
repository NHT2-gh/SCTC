"use client";
import React from "react";
import { showToast } from "@/lib/toast";
import { useForm } from "react-hook-form";
import Form from "@/components/form/Form";
import { FormField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loyaltyClaimValidationSchema,
  LoyaltyClaimValidationType,
} from "@/schemas/validation/customer-service.validation";
import { LoyaltySource, LoyaltySourceMapCode } from "@/types/common";
import { useLoyaltyClaim } from "@/hooks/queries/use-customer-service";

export default function SubmitLoyaltyClaimForm() {
  const { mutateAsync: submitLoyaltyClaim, isPending } = useLoyaltyClaim();
  const submitForm = useForm<LoyaltyClaimValidationType>({
    resolver: zodResolver(loyaltyClaimValidationSchema),
    defaultValues: {
      phone_number: "",
      order_number: "",
      source: LoyaltySource.grabfood,
    },
  });
  const { handleSubmit, reset } = submitForm;
  const onSubmit = async (data: LoyaltyClaimValidationType) => {
    try {
      const result = await submitLoyaltyClaim(data);

      if (result.data.success) {
        showToast.success({
          title: "Thành công",
          description: "Yêu cầu tích điểm thành công",
        });
      } else {
        showToast.error({
          title: "Thất bại",
          description: "Yêu cầu tích điểm không thành công",
        });
      }
      reset();
    } catch (error) {
      showToast.error({
        title: "Lỗi hệ thống",
        description: "Vui lòng thử lại",
      });
    }
  };
  return (
    <Form
      onSubmit={handleSubmit(onSubmit, (err) => {
        console.log("VALIDATION ERROR", err);
      })}
    >
      <FormField
        form={submitForm}
        field={{
          name: "phone_number",
          label: "Số điện thoại",
          required: true,
          type: "tel",
          placeholder: "Nhập số điện thoại dùng để đặt hàng",
        }}
      />

      <div className="w-full relative">
        <FormField
          form={submitForm}
          className="[&_input]:pl-[100px]"
          field={{
            name: "order_number",
            label: "Mã đặt hàng",
            required: true,
            type: "text",
            maxLength: 10,
            placeholder: "Nhập mã đặt hàng từ app đặt hàng",
            hint: "Sao chép mã đặt hàng từ đơn hàng của bạn",
          }}
        />
        <FormField
          form={submitForm}
          className="!absolute !left-0 top-[25px] w-[110px]"
          field={{
            name: "source",
            required: true,
            type: "select",
            options: Object.values(LoyaltySource).map((source) => ({
              value: source,
              label: `${LoyaltySourceMapCode[source]}`,
            })),
          }}
        />
      </div>

      <Button type="submit">Gửi yêu cầu tích điểm</Button>
    </Form>
  );
}

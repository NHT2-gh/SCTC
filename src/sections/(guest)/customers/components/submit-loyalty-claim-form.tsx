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
      className="lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] p-4"
      onSubmit={handleSubmit(onSubmit, (err) => {
        console.log("VALIDATION ERROR", err);
      })}
    >
      <FormField
        form={submitForm}
        field={{
          name: "name",
          label: "Tên khách iu 🫶🏻",
          required: false,
          type: "text",
          placeholder: "Cho mình xin cái tên. Hông cho cũng được 🙂",
        }}
      />
      <FormField
        form={submitForm}
        field={{
          name: "phone_number",
          label: "Số điện thoại",
          required: true,
          type: "tel",
          placeholder: "Nhập số điện thoại dùng để đặt hàng á nha !!!",
        }}
      />

      <div className="w-full relative">
        <FormField
          form={submitForm}
          className="[&_input]:pl-[130px]"
          field={{
            name: "order_number",
            label: "Mã đặt hàng",
            required: true,
            type: "text",
            maxLength: 10,
            placeholder: "Nhập mã đặt hàng",
            hint: "Sao chép mã đặt hàng từ đơn hàng của bạn trong app đặt hàng",
          }}
        />
        <FormField
          form={submitForm}
          className="!absolute !left-0 top-[25px] w-[130px]"
          field={{
            name: "source",
            required: true,
            type: "select",
            options: Object.values(LoyaltySource).map((source) => ({
              value: source,
              label: `${LoyaltySourceMapCode[source]}`,
              disabled: source !== LoyaltySource.grabfood,
            })),
          }}
        />
      </div>

      {/* <div className="bg-blue-100 rounded-lg">
        <p>
          Yêu cầu tích điểm của bạn sẽ được duyệt ít nhất là sau 1 ngày sau khi
          gửi yêu cầu nhé
        </p>
      </div> */}

      <Button type="submit">Gửi yêu cầu tích điểm</Button>
    </Form>
  );
}

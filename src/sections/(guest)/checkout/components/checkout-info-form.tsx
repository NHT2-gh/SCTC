"use client";
import React, { useEffect } from "react";
import { FormField } from "@/components/form";
import { checkoutFormSchema } from "@/schemas/form-schemas/checkout-form-schema";
import { CheckoutFormValidationType } from "@/schemas/validation/checkout.validation";
import { showToast } from "@/lib/toast";
import { SingleFilterButtonGroup } from "@/components/filter/single-toggle";
import { DeliveryMethod } from "@/types/checkout";
import { useFormRenderer } from "@/components/form/FormRenderer";
import Form from "@/components/form/Form";
import { Button } from "@/components/ui/button";
import { useWatch } from "react-hook-form";
import { useCheckout } from "@/hooks/use-checkout";
import { useCreateOrder } from "@/hooks/queries/use-order";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/config/app-routes";

export default function CheckoutInfoForm() {
  const { checkoutInfo, updateCheckout } = useCheckout();
  const { items, clearCart } = useCart();
  const router = useRouter();
  const createOrder = useCreateOrder();
  const checkoutForm = useFormRenderer<CheckoutFormValidationType>(
    checkoutFormSchema,
    {
      customer: checkoutInfo.customer,
      delivery_method: checkoutInfo.delivery_method || "pickup_now",
    },
  );
  const deliveryMethodValue = useWatch({
    name: "delivery_method",
    control: checkoutForm.control,
  });
  const {
    handleSubmit,
    setValue,
    formState: { isLoading },
  } = checkoutForm;
  const onSubmit = async (data: CheckoutFormValidationType) => {
    updateCheckout({
      customer: data.customer,
      delivery_method: data.delivery_method as keyof typeof DeliveryMethod,
      note: data.note!,
    });

    try {
      const result = await createOrder.mutateAsync({
        cartItems: items,
        checkoutInfo: data,
      });

      clearCart();
      router.push(APP_ROUTES.GUEST.ORDER.VIEW(result.data.tracking_order));
    } catch (error) {
      showToast.error({ title: "Đặt hàng thất bại" });
    }
  };

  useEffect(() => {
    setValue("customer", checkoutInfo.customer);
  }, [checkoutInfo]);

  return (
    <div className="flex flex-col gap-4">
      <h2>Thông tin nhận hàng</h2>
      <SingleFilterButtonGroup
        items={Object.entries(DeliveryMethod).map(([key, value]) => ({
          value: key,
          label: value,
        }))}
        onChange={(value) =>
          checkoutForm.setValue("delivery_method", value as DeliveryMethod)
        }
        className=" p-1"
      />
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="h-full !grid-cols-2 gap-2"
      >
        {checkoutFormSchema.fields.map((field) =>
          field.name == "pickup_at" &&
          deliveryMethodValue == "pickup_now" ? null : (
            <FormField key={field.name} field={field} form={checkoutForm} />
          ),
        )}
      </Form>
      <Button
        disabled={isLoading}
        onClick={handleSubmit(onSubmit)}
        type="submit"
      >
        {isLoading ? "Đừng có nhấn nữa đang ấy" : "Chính thức chốt đơn"}
      </Button>
    </div>
  );
}

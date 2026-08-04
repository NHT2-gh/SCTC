"use client";
import React, { useEffect, useState } from "react";
import { FormField } from "@/components/form";
import { checkoutFormSchema } from "@/schemas/form-schemas/checkout-form-schema";
import { CheckoutFormValidationType } from "@/schemas/validation/checkout.validation";
import { showToast } from "@/lib/toast";
import { SingleFilterButtonGroup } from "@/components/filter/single-toggle";
import { DeliveryMethod, DeliveryMethodMapText } from "@/types/checkout";
import { useFormRenderer } from "@/components/form/FormRenderer";
import Form from "@/components/form/Form";
import { useWatch } from "react-hook-form";
import { useCheckout } from "@/hooks/use-checkout";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/config/app-routes";
import { delagothic } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { useOrderHistory } from "@/hooks/use-order";
import { AddOrderResponen, Order, PaymentMethod } from "@/types/order";
import ModalAlert from "@/components/modal/alerts/modal-alert";
import { useModal } from "@/hooks/useModal";
import { Button } from "@/components/ui/button";

export default function CheckoutInfoForm() {
  const router = useRouter();
  const { addOrder } = useOrderHistory();
  const { items, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { checkoutInfo, updateCheckout } = useCheckout();
  const modalAlert = useModal();

  const checkoutForm = useFormRenderer<CheckoutFormValidationType>(
    checkoutFormSchema,
    {
      customer: checkoutInfo.customer,
      delivery_method:
        checkoutInfo.delivery_method || DeliveryMethod.pickup_now,
      payment_method: checkoutInfo.payment_method || PaymentMethod.QR,
    },
  );
  const deliveryMethodValue = useWatch({
    name: "delivery_method",
    control: checkoutForm.control,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isLoading: formIsLoading },
  } = checkoutForm;

  const onSubmit = async (data: CheckoutFormValidationType) => {
    setIsLoading(true);

    updateCheckout({
      customer: data.customer,
      delivery_method: data.delivery_method as DeliveryMethod,
      payment_method: data.payment_method as PaymentMethod,
    });

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: items,
          checkoutInfo: data,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const { order: result } = (await res.json()) as { order: Order };

      if (result.tracking_order) {
        addOrder({
          order_id: result.id,
          subtotal: result.subtotal,
          status: result.status,
          order_items_count: result.order_items_count,
          tracking_order: result.tracking_order,
          pick_up_time: result.pick_up_time,
          payment_method: result.payment_method,
        });
        clearCart();
        router.push(APP_ROUTES.GUEST.ORDER.VIEW(result.tracking_order));
        setIsLoading(false);
      } else {
        throw new Error("Đặt hàng thất bại");
      }
    } catch (error) {
      showToast.error({ title: "Đặt hàng thất bại" });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setValue("customer", checkoutInfo.customer);
  }, [checkoutInfo]);

  return (
    <div className="grow flex flex-col gap-4">
      <h2>Thông tin nhận hàng</h2>
      <SingleFilterButtonGroup
        items={Object.entries(DeliveryMethod).map(([key, value]) => ({
          value: key,
          label: DeliveryMethodMapText[value],
        }))}
        onChange={(value) =>
          checkoutForm.setValue("delivery_method", value as DeliveryMethod)
        }
        className=" p-1"
      />
      <div className="grow">
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
      </div>

      <Button
        disabled={isLoading || formIsLoading}
        onClick={() => {
          if (deliveryMethodValue == DeliveryMethod.pre_order) {
            modalAlert.openModal();
          } else {
            handleSubmit(onSubmit)();
          }
        }}
        type="submit"
        className={cn(
          "flex-3  text-white py-4 px-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed",
          delagothic.className,
        )}
      >
        {isLoading || formIsLoading
          ? "Đừng có nhấn nữa đang ấy"
          : "Chính thức chốt đơn"}
      </Button>

      {modalAlert.isOpen && (
        <ModalAlert
          isOpen={modalAlert.isOpen}
          onClose={() => modalAlert.closeModal()}
          type={"info"}
          title={"Lưu ý"}
          description={
            "Đối với những đơn hàng đặt trước, cục dàng vui lòng chờ quán gọi điện xác nhận đơn nha, nên cục dàng nhờ nghe máy nha.\nCục dàng nhớ thanh toán trước cho quán trước khi tới nhận hàng nha."
          }
          onConfirm={handleSubmit(onSubmit)}
          confirmText={"Để cục dàng nghe máy"}
        />
      )}
    </div>
  );
}

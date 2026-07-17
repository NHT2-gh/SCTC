"use client";
import { _contact_info } from "@/_mocks/_setting/_contact_info";
import ModalAlert from "@/components/modal/alerts/modal-alert";
import { APP_ROUTES } from "@/config/app-routes";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const resultCode = searchParams.get("resultCode");

  if (!resultCode) return;

  switch (Number(resultCode)) {
    case 0:
      return (
        <ModalAlert
          isOpen={true}
          onClose={() => router.push(APP_ROUTES.GUEST.ROOT)}
          type={"success"}
          title={"Cảm ơn cục dàng nha"}
          description={"Thanh toán thành công"}
          onConfirm={() => router.push(APP_ROUTES.GUEST.ROOT)}
          confirmText={"Quay lại trang chủ"}
        />
      );

    case 1006:
      return (
        <ModalAlert
          isOpen={true}
          onClose={() => router.push(APP_ROUTES.GUEST.ROOT)}
          type={"warning"}
          title={"Còn chần chờ gì nữa? Thanh toán thôi"}
          description={
            "Có vẻ bạn chưa đồng ý thanh toán.\nLiên hệ nhân viên để được hỗ trợ thanh toán lại."
          }
          onConfirm={() => router.push(`tel:${_contact_info.hotline}`)}
          confirmText={"Liên hệ nhân viên"}
        />
      );

    default:
      return (
        <ModalAlert
          isOpen={true}
          onClose={() => router.push(APP_ROUTES.GUEST.ROOT)}
          type={"danger"}
          title={"Thanh toán có vấn đề"}
          description={message || "Liên hệ nhân viên để được hỗ trợ"}
          onConfirm={() => router.push(`tel:${_contact_info.hotline}`)}
          confirmText={"Liên hệ nhân viên"}
        />
      );
  }
}

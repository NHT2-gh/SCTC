"use client";
import { useStoreStatus } from "@/context/StoreStatusContext";
import { Portal } from "../portal";
import ModalAlert from "./alerts/modal-alert";
import { formatDateTimev2 } from "@/utils/format-data";
import { useState } from "react";

export default function StoreStatusModal() {
  const { isBreak, isClosed, endTime } = useStoreStatus();
  const [isCloseModal, setIsCloseModal] = useState(false);

  if (!isBreak && !isClosed) {
    return null;
  }

  const title = isBreak ? "Cửa hàng đang tạm nghỉ" : "Cửa hàng đã đóng";

  const description = isBreak
    ? "Hiện tại shop đang trong thời gian tạm nghỉ. \nMấy cục dàng vẫn có thể đặt trước cho thời gian cửa hàng mở lại."
    : "Hiện tại shop đã đóng cửa. \nMấy cục dàng vẫn có thể đặt trước cho thời gian cửa hàng mở cửa tiếp theo.";

  const formattedEndTime = endTime
    ? formatDateTimev2(endTime.toISOString(), { withTime: true })
    : null;

  return (
    <Portal containerId={"portal-root"}>
      <ModalAlert
        isOpen={!isCloseModal}
        onClose={() => setIsCloseModal(true)}
        type={"info"}
        title={title}
        description={
          description +
          ` ${formattedEndTime ? `\nThời gian mở cửa lại: ${formattedEndTime}` : ""}`
        }
        onConfirm={() => setIsCloseModal(true)}
        confirmText={"Ok Shop 👍"}
      />
    </Portal>
  );
}

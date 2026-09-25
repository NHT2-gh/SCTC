"use client";
import { useStoreStatus } from "@/context/StoreStatusContext";
import { Portal } from "../portal";
import ModalAlert from "./alerts/modal-alert";

export default function StoreStatusModal() {
  const { isBreak, isClosed, endTime, canPreorder } = useStoreStatus();

  if (!isBreak && !isClosed) {
    return null;
  }

  const title = isBreak ? "Cửa hàng đang tạm nghỉ" : "Cửa hàng đã đóng";

  const description = isBreak
    ? "Hiện tại cửa hàng đang trong thời gian tạm nghỉ. \nBạn vẫn có thể đặt trước cho thời gian cửa hàng mở lại."
    : "Hiện tại cửa hàng đã đóng cửa. \nBạn vẫn có thể đặt trước cho thời gian cửa hàng mở cửa tiếp theo.";

  const formattedEndTime = endTime
    ? endTime.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <Portal containerId={"portal-root"}>
      <ModalAlert
        isOpen={true}
        onClose={() => {}}
        type={"info"}
        title={title}
        description={
          description +
          ` ${formattedEndTime ? `\n Thời gian mở cửa: ${formattedEndTime}` : ""}`
        }
        onConfirm={() => {}}
        confirmText={"Ok Shop 👍"}
      />
    </Portal>
  );
}

"use client";
import { useState } from "react";
import { Portal } from "../portal";
import ModalAlert from "./alerts/modal-alert";
import { formatDateTime } from "@/utils/format-data";
import { useStoreStatus } from "@/context/StoreStatusContext";
import { StoreStatusType } from "@/types/store";

const ContentMapText: Record<
  StoreStatusType.break | StoreStatusType.closed,
  { title: string; desc: string }
> = {
  [StoreStatusType.break]: {
    title: "Cửa hàng đang tạm nghỉ",
    desc: "Hiện tại tụi mình đang trong thời gian tạm nghỉ.",
  },
  [StoreStatusType.closed]: {
    title: "Cửa hàng đang đóng",
    desc: "Hiện tại tụi mình đang đóng cửa.",
  },
};

export default function StoreStatusModal() {
  const { endTime, isBreak, canPreorder, isClosed } = useStoreStatus();
  const [isCloseModal, setIsCloseModal] = useState(false);

  if (!isClosed || !isBreak) {
    return null;
  }
  const formattedEndTime = endTime
    ? formatDateTime(endTime.toISOString(), { withTime: true })
    : null;

  return (
    <Portal containerId={"portal-root"}>
      <ModalAlert
        isOpen={!isCloseModal}
        onClose={() => setIsCloseModal(true)}
        type={"info"}
        title={
          isBreak
            ? ContentMapText[StoreStatusType.break].title
            : ContentMapText[StoreStatusType.closed].title
        }
        description={
          ` ${
            isBreak
              ? ContentMapText[StoreStatusType.break].desc
              : ContentMapText[StoreStatusType.closed].desc
          }` +
          `${canPreorder ? "\nMấy bạn vẫn có thể đặt trước ... " : ""}  ${formattedEndTime ? `\nThời gian cửa hàng hoạt động lại: ${formattedEndTime}` : ""}` //NEDD UPDATE
        }
        onConfirm={() => setIsCloseModal(true)}
        confirmText={"Tôi đồng ý 👌🏻"}
      />
    </Portal>
  );
}

import Modal from "@/components/ui/modal/modal";
import { cn } from "@/lib/utils";
import { iconMap } from "@/utils/iconMap";
import React from "react";

export type AlertType = "success" | "info" | "warning" | "danger";

interface ModalAlertProps {
  isOpen: boolean;
  onClose: () => void;
  type: AlertType;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText: string;
  onCancel?: () => void;
  cancelText?: string;
}

const typeConfig: Record<AlertType, string> = {
  info: "bg-blue-500 hover:bg-blue-600",
  warning: "bg-warning-500 hover:bg-warning-600",
  danger: "bg-error-500 hover:bg-error-600",
  success: "bg-success-500 hover:bg-success-600",
};

export default function ModalAlert({
  isOpen,
  onClose,
  type,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ModalAlertProps) {
  const Icon = iconMap[`modal-alert-${type}`];
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] w-[90vw] rounded-xl !max-h-fit !min-h-fit p-5 lg:p-10 [&_.modal-content]:!max-h-fit [&_.modal-content]:!min-h-fit"
    >
      <div className="text-center">
        <Icon />
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
          {title}
        </h4>
        <p className="mb-6 whitespace-pre-wrap text-gray-500 dark:text-gray-400">
          {description}
        </p>

        <div className="flex items-center justify-center w-full gap-3 mt-7">
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg shadow-theme-xs sm:w-auto",
              typeConfig[type],
            )}
          >
            {confirmText}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                "flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg shadow-theme-xs sm:w-auto",
                typeConfig[type],
              )}
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

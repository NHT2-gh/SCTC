import { toast } from "react-hot-toast";
import { createElement } from "react";
import { CustomToast } from "@/components/ui/toast";

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const showToast = {
  success: ({ title, description, duration = 2000 }: ToastOptions) => {
    toast.custom(
      (t) =>
        createElement(CustomToast, {
          t,
          variant: "success",
          title,
          description,
        }),
      { duration, position: "bottom-center" },
    );
  },

  error: ({ title, description, duration = 5000 }: ToastOptions) => {
    toast.custom(
      (t) =>
        createElement(CustomToast, {
          t,
          variant: "error",
          title,
          description,
        }),
      { duration, position: "bottom-center" },
    );
  },

  warning: ({ title, description, duration = 4000 }: ToastOptions) => {
    toast.custom(
      (t) =>
        createElement(CustomToast, {
          t,
          variant: "warning",
          title,
          description,
        }),
      { duration, position: "bottom-center" },
    );
  },

  info: ({ title, description, duration = 4000 }: ToastOptions) => {
    toast.custom(
      (t) =>
        createElement(CustomToast, {
          t,
          variant: "info",
          title,
          description,
        }),
      { duration, position: "bottom-center" },
    );
  },
};

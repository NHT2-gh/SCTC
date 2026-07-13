"use client";

import { useEffect } from "react";
import { showToast } from "@/lib/toast";
import { subscribeOrders } from "@/supabase/realtime/order.sub";
import { Order } from "@/types/order";
import { APP_ROUTES } from "@/config/app-routes";

export function playNotificationSound() {
  const notificationAudio = new Audio("/audio/noti-sound.m4a");

  notificationAudio.currentTime = 0;

  notificationAudio.play().catch((err) => {
    console.error("Audio error:", err);
  });
}
export async function showOrderNotification(order: Order) {
  if (Notification.permission !== "granted") {
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  await registration.showNotification("🛎️ Đơn hàng mới", {
    body: `${order.tracking_order} - ${order.customer_name}`,
    icon: "/icons/logo-192.png",
    tag: order.id,
  });
}

export default function OrderRealtimeListener() {
  useEffect(() => {
    const unsubscribe = subscribeOrders({
      onInsert(order) {
        if (order.status !== "pending") return;

        showToast.success({
          title: "Đơn hàng mới",
          description: order.tracking_order,
        });

        playNotificationSound();
        showOrderNotification(order);
      },

      onUpdate(order) {
        showOrderNotification(order);
      },
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log(Notification.permission);

    if (Notification.permission !== "granted") {
      showToast.info({
        title: "Bật thông báo",
        description: "Nhấn nút để nhận thông báo đơn hàng.",
      });
    }
  }, []);

  return null;
}

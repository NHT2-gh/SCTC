"use client";

import { useEffect } from "react";
import { showToast } from "@/lib/toast";
import { subscribeOrders } from "@/supabase/realtime/order.sub";
import { Order } from "@/types/order";

export function playNotificationSound() {
  const notificationAudio = new Audio("/audio/noti-sound.m4a");

  notificationAudio.currentTime = 0;

  notificationAudio.play().catch((err) => {
    console.error("Audio error:", err);
  });
}
export async function showOrderNotification(order: Order) {
  if (typeof window === "undefined") return;

  if (!("Notification" in window)) {
    console.warn("Browser không hỗ trợ Notification API");
    return;
  }

  await Notification.requestPermission();

  console.log(Notification.permission);

  if (Notification.permission !== "granted") {
    console.warn("Chưa được cấp quyền notification");
    return;
  }

  const notification = new Notification("🛎️ Đơn hàng mới", {
    body: `${order.tracking_order} - ${order.customer_name}`,
    icon: "/icons/logo-192.png",
    tag: order.id, // tránh duplicate notification
    requireInteraction: true, // giữ notification cho tới khi user đóng (Chrome hỗ trợ)
  });

  notification.onclick = () => {
    window.focus();
    window.location.href = `/admin/orders`;
    notification.close();
  };
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

  return null;
}

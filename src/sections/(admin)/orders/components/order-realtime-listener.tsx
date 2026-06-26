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

export function showOrderNotification(order: Order) {
  if (!("Notification" in window)) return;

  if (Notification.permission !== "granted") return;

  new Notification("🛎️ Đơn hàng mới", {
    body: `${order.tracking_order} - ${order.customer_name}`,
    icon: "/icons/logo-192.png",
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
        // Nếu muốn hiện toast khi đổi trạng thái
        // showToast.info({
        //   title: "Cập nhật đơn hàng",
        //   description: `${order.tracking_order} → ${order.status}`,
        // });
      },
    });

    return unsubscribe;
  }, []);

  return null;
}

"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  containerId: string;
}

export default function Portal({ children, containerId }: PortalProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(containerId);

    if (!element) {
      element = document.createElement("div");
      element.id = containerId;
      document.body.appendChild(element);
    }

    setContainer(element);

    return () => {
      // Chỉ remove nếu Portal tự tạo node
      // Có thể bỏ phần này nếu root được tạo ở layout.
    };
  }, [containerId]);

  if (!container) {
    return null;
  }

  return createPortal(children, container);
}

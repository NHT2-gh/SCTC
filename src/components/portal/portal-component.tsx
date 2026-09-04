"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface PortalProps {
  children: React.ReactNode;
}

export default function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const portalRoot = document.getElementById("portal-root");

  if (!portalRoot) return null;

  return createPortal(children, portalRoot);
}

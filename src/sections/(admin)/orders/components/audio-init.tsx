"use client";

import { unlockAudio } from "@/lib/audio/unlock-audio";
import { useEffect } from "react";

export function AudioProvider() {
  useEffect(() => {
    const enableAudio = () => {
      unlockAudio();
    };

    document.addEventListener("pointerdown", enableAudio, { once: true });

    return () => {
      document.removeEventListener("pointerdown", enableAudio);
    };
  }, []);

  return null;
}

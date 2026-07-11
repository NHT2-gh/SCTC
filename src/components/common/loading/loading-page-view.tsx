"use client";
import Image from "next/image";
import React from "react";

export default function LoadingPageView() {
  return (
    <div className="fixed bg-black/60 inset-0 flex flex-col items-center justify-center z-[1000]">
      <Image
        src={"/images/logo/logo-sctc-v1.webp"}
        alt=""
        width={120}
        height={120}
        priority
        className="animate-bounce"
      />
      <p className="text-base text-white">Chờ 1 tí thoi...</p>
    </div>
  );
}

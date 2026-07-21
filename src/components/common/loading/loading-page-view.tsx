"use client";
import Image from "next/image";
import React from "react";

export default function LoadingPageView() {
  return (
    <div className="fixed inset-0 bg-black/40 flex flex-col items-center justify-center z-[1000]">
      <Image
        src={"/images/logo/logo-sctc-v1.webp"}
        alt=""
        width={100}
        height={100}
        priority
        className="animate-bounce"
      />
      <p className="text-base text-white">Chờ 1 tí thoi...</p>
    </div>
  );
}

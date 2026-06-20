"use client";

import React from "react";
import AppHeader from "@/layout/AppHeader";
import { itim } from "@/lib/fonts";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFFAEA] [&_header]:bg-[#FFFAEACC]">
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ease-in-out `}>
        {/* Header */}
        {/* <AppHeader /> */}
        {/* Page Content */}
        <main className={`max-w-[31.25rem] mx-auto ${itim.className}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

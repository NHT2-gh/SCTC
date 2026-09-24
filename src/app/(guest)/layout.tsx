"use client";
import React from "react";
import { itim } from "@/lib/fonts";
import { FloatingHelpButton } from "@/components/floading-help-button";
import { StoreStatusProvider } from "@/context/StoreStatusContext";
import StoreStatusModal from "@/components/modal/modal-store-status";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#FFFAEA] [&_header]:bg-[#FFFAEACC]">
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ease-in-out `}>
        {/* Header */}
        {/* <AppHeader /> */}
        {/* Page Content */}
        <main
          className={`max-w-[31.25rem] relative mx-auto h-fit min-h-[100dvh] overflow-y-scroll `}
        >
          <StoreStatusProvider>
            {children}
            <FloatingHelpButton />
            <StoreStatusModal />
          </StoreStatusProvider>
        </main>
      </div>
    </div>
  );
}

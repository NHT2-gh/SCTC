"use client";
import React from "react";
import { ModalView } from "./components";
import { useModal } from "@/hooks/useModal";
import { BadgeQuestionMarkIcon } from "lucide-react";

export default function FloadingHelpButton() {
  const modal = useModal();

  return (
    <div>
      <button
        onClick={() => modal.openModal()}
        className="fixed bottom-10 z-[50] left-4 text-black bg-lime-200 p-2 flex justify-center items-center rounded-full"
      >
        <BadgeQuestionMarkIcon strokeWidth={2} size={24} />
      </button>

      {modal.isOpen && (
        <ModalView isOpen={modal.isOpen} onClose={modal.closeModal} />
      )}
    </div>
  );
}
``;

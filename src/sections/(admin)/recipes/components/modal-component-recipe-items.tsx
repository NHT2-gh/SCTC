import Modal, { type ModalProps } from "@/components/ui/modal/modal";
import { ComponentRecipeItems } from "@/types/component";
import React from "react";
import { AddComponentRecipeItemsForm } from ".";

interface ModalComponentRecipeItemsProps {
  items: ComponentRecipeItems[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalComponentRecipeItems({
  items,
  isOpen,
  onClose,
}: ModalComponentRecipeItemsProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-5">Công thức thành phần </h3>
      {items.length === 0 ? <p>Chưa có nguyên liệu nào được thêm</p> : <></>}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2>Thêm nguyên liệu</h2>
        <AddComponentRecipeItemsForm />
      </div>
    </Modal>
  );
}

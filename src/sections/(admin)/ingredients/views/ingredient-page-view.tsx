"use client";
import React from "react";
import IngredientsTable from "../components/ingredients-table";
import { MainContainer } from "@/components/common/page-layout";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/ui/modal/modal";
import IngredientAddForm from "../components/ingredient-add-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function IngredientPageView() {
  const modalAddForm = useModal();

  return (
    <MainContainer title="Danh sách nguyên liệu">
      <Button className="" onClick={modalAddForm.openModal}>
        <PlusCircle className="md:hidden" />{" "}
        <span className="hidden md:block">Thêm nguyên liệu</span>
      </Button>
      <IngredientsTable />
      {modalAddForm.isOpen && (
        <Modal isOpen={modalAddForm.isOpen} onClose={modalAddForm.closeModal}>
          <IngredientAddForm />
        </Modal>
      )}
    </MainContainer>
  );
}

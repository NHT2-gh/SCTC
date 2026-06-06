import { MainContainer } from "@/components/common/page-layout";
import React from "react";
import IngredientsTable from "../components/ingredients-table";

export default function IngredientPageView() {
  return (
    <MainContainer title="Danh sách nguyên liệu">
      <IngredientsTable />
    </MainContainer>
  );
}

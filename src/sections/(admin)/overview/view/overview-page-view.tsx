"use client";
import React from "react";
import { MainContainer } from "@/components/common/page-layout";
import { StatusManagement, TableManagement } from "../components";

export default function OverviewPageView() {
  return (
    <MainContainer title={"Overview"}>
      <div className="grid md:grid-cols-2 gap-5">
        <TableManagement />
      </div>
      <StatusManagement />
    </MainContainer>
  );
}

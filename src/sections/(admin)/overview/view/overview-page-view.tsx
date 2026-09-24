import React from "react";
import { StatusManagement, TableManagement } from "../components";
import QRCode from "react-qr-code";
import { MainContainer } from "@/components/common/page-layout";

export default function OverviewPageView() {
  return (
    <MainContainer title={"Overview"}>
      <div className="grid gap-5">
        <TableManagement />
        <StatusManagement />
      </div>
    </MainContainer>
  );
}

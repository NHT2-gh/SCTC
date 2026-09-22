import React from "react";
import { TableManagement } from "../components";
import QRCode from "react-qr-code";
import { MainContainer } from "@/components/common/page-layout";

export default function OverviewPageView() {
  return (
    <MainContainer title={"Overview"}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <TableManagement />
      </div>
    </MainContainer>
  );
}

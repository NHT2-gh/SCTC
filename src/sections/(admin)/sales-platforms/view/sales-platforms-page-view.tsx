import React from "react";
import { MainContainer } from "@/components/common/page-layout";
import { LoyaltySource } from "@/types/common";
import { IconKey, iconMap } from "@/utils/icon-map";
import { LoyaltyImportBatchesTable, ModalImportFile } from "../components";

interface Platform {
  source: LoyaltySource;
  name: string;
  icon: IconKey;
}

const platforms: Platform[] = [
  {
    source: LoyaltySource.grabfood,
    name: "Grab Food",
    icon: "grabfood",
  },
  { source: LoyaltySource.xanhsm, name: "XanhSM Food", icon: "xanhsmfood" },
];

export default function SalesPlatformsPageView() {
  return (
    <MainContainer title={"Sales Platforms"}>
      <section className="flex items-center gap-10">
        {platforms.map((platform) => {
          const Icon = iconMap[platform.icon];
          return (
            <div
              key={platform.source}
              className="flex items-center gap-2 bg-neutral-50 p-4 rounded-xl"
            >
              <Icon className="size-10 rounded-full" />
              <h3 className="font-semibold"> {platform.name}</h3>
            </div>
          );
        })}
        <ModalImportFile />
      </section>
      <LoyaltyImportBatchesTable />
    </MainContainer>
  );
}

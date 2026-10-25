import React from "react";
import { NavigationBar } from "@/components/common/navigation-bar";
import { APP_ROUTES } from "@/config/app-routes";
import { SubmitLoyaltyClaimForm } from "../components";

export default function PointsAccumulationPageView() {
  return (
    <section className="p-4 h-fit min-h-[100dvh] flex flex-col gap-3">
      <NavigationBar
        backHref={APP_ROUTES.GUEST.ROOT}
        title="Tích điểm"
        className="[&_svg]:!text-[#8D1111] [&_h1]:text-[#8D1111]"
      />

      <SubmitLoyaltyClaimForm />
    </section>
  );
}

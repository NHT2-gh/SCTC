import { OrderDetail } from "@/types/order";
import React from "react";
import { Bill } from "../components";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/config/app-routes";

interface OrderDetailPageViewProps {
  orderDetail: OrderDetail;
}

export default function OrderDetailPageView({
  orderDetail,
}: OrderDetailPageViewProps) {
  if (!orderDetail.order) return null;
  return (
    <section className="bg-[url('/images/backgrounds/bill-bg-1.webp')] bg-no-repeat bg-center bg-cover max-w-screen h-screen overflow-y-scroll scrollbar-hidden flex flex-col justify-center items-center gap-2">
      <Link
        className="self-start ml-10 sticky top-4 left-4"
        href={APP_ROUTES.GUEST.ROOT}
      >
        <Button>
          <ArrowLeftIcon /> Quay về menu
        </Button>
      </Link>
      <Bill data={orderDetail} />
    </section>
  );
}

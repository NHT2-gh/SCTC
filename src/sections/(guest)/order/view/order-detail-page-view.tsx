import React from "react";
import Link from "next/link";
import { Bill } from "../components";
import { OrderDetail } from "@/types/order";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/config/app-routes";
import { _mock_bill_style } from "@/_mocks/_bill/_data_random_bill_style";

interface OrderDetailPageViewProps {
  orderDetail: OrderDetail;
}

export default function OrderDetailPageView({
  orderDetail,
}: OrderDetailPageViewProps) {
  if (!orderDetail.order) return null;
  const template =
    _mock_bill_style[Math.floor(Math.random() * _mock_bill_style.length)];
  return (
    <section
      style={{
        backgroundImage: `url('/images/backgrounds/${template.backgroundPattern}')`,
      }}
      className="bg-no-repeat bg-center bg-cover max-w-screen h-screen overflow-y-scroll scrollbar-hidden flex flex-col justify-center items-center gap-2"
    >
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

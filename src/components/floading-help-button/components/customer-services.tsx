import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/config/app-routes";
import { getIcon, IconKey } from "@/utils/icon-map";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Service {
  href: string;
  title: string;
  desc: string;
  icon: IconKey;
}

const services: Service[] = [
  {
    title: "Tích điểm",
    icon: "gift",
    href: APP_ROUTES.GUEST.CUSTOMER.POINTS_ACCUMULATE(),
    desc: "Nhận điểm khi sử dụng dịch vụ",
  },
  // {
  //   title: "Tra cứu đơn hàng",
  //   icon: "receipt",
  //   href: "/customers/order-lookup",
  //   desc: "Tìm kiếm đơn hàng của bạn",
  // },
];

export default function CustomerServices() {
  return (
    <section className="grid grid-cols-2 gap-2">
      {services.map((service) => {
        const Icon = getIcon(service.icon);
        console.log(service.href);
        return (
          <Link href={service.href} key={service.title}>
            <button className="flex flex-col p-3 h-full w-full text-left rounded-lg bg-brand-50">
              <span className="inline-flex gap-2 text-lg font-semibold mt-2">
                <Icon
                  fill="transparent"
                  color="var(--color-brand-500)"
                  size={22}
                />
                {service.title}
              </span>
              <p className="text-base text-gray-700">{service.desc}</p>
            </button>
          </Link>
        );
      })}
    </section>
  );
}

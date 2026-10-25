import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/config/app-routes";
import { cn } from "@/lib/utils";
import { getIcon, IconKey } from "@/utils/icon-map";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Service {
  href: string;
  title: string;
  desc: string;
  icon: IconKey;
  is_active: boolean;
}

const services: Service[] = [
  {
    title: "Tích điểm",
    icon: "gift",
    href: APP_ROUTES.GUEST.CUSTOMER.POINTS_ACCUMULATE(),
    desc: "Nhận điểm khi sử dụng dịch vụ",
    is_active: true,
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

        return (
          <Link
            href={service.href}
            key={service.title}
            aria-disabled={!service.is_active}
            className={cn("overflow-hidden rounded-lg relative", {
              "pointer-events-none cursor-not-allowed after:absolute after:content-['Coming_Soon'] after:bg-black/50 after:text-[#f3dfbbdb] after:inset-0 after:z-1 after:inline-flex after:items-center after:justify-center after:text-base after:font-semibold":
                !service.is_active,
            })}
          >
            <button
              className={cn(
                "flex flex-col p-3 h-full w-full text-left rounded-lg bg-brand-50",
              )}
            >
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

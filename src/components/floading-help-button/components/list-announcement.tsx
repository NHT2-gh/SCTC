import { useGetAnnouncement } from "@/hooks/queries/use-store-announcement";
import { AnnouncementType } from "@/types/announcement";
import { InfoIcon, TicketIcon, TimerIcon } from "lucide-react";
import React from "react";

const iconMap = {
  [AnnouncementType.info]: InfoIcon,
  [AnnouncementType.open_time]: TimerIcon,
  [AnnouncementType.promotion]: TicketIcon,
};

export default function ListAnnouncement() {
  const announcement = useGetAnnouncement();
  return (
    <div>
      {announcement?.data?.data?.map((item) => {
        const Icon = iconMap[item.type];
        return (
          <div key={item.title} className="p-2 ">
            {/* <Icon strokeWidth={2.5} size={22} /> */}
            <div className="">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="whitespace-pre-line w-full">{item.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

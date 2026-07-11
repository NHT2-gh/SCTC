import { IcCoffeCup, IcRuouIcon } from "@/assets/svgs";
import { delagothic } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Utensils } from "lucide-react";
import React, { useState } from "react";

const _category_list = [
  {
    lable: "Cà",
    color: "#732C12",
    pageNumber: 1,
    icon: <IcCoffeCup fillColor="#732C12" />,
  },
  {
    lable: "Matcha",
    color: "#4A701C",
    pageNumber: 2,
    icon: <IcCoffeCup fillColor="#4A701C" />,
  },
  {
    lable: "Houjicha",
    color: "#584139",
    pageNumber: 3,
    icon: <IcCoffeCup fillColor="#584139" />,
  },
  {
    lable: "Trà",
    color: "#C59E00",
    pageNumber: 4,
    icon: <IcCoffeCup fillColor="#C59E00" />,
  },

  {
    lable: "Cacao",
    color: "#8D1111",
    pageNumber: 6,
    icon: <IcCoffeCup fillColor="#732C12" />,
  },

  {
    lable: "Cồn",
    color: "#8D1111",
    pageNumber: 5,
    icon: <IcRuouIcon fillColor="#8D1111" />,
  },

  {
    lable: "Lai rai",
    color: "#8D1111",
    pageNumber: 7,
    icon: <Utensils strokeWidth={3} className="w-5 h-5 text-[#8D1111]" />,
  },

  {
    lable: "Bánh",
    color: "#8D1111",
    pageNumber: 8,
    icon: <Utensils strokeWidth={3} className="w-5 h-5 text-[#8D1111]" />,
  },
];

export default function CategoryTabs({
  value,
  onSelected,
}: {
  value: number;
  onSelected: (page: number) => void;
}) {
  const [itemActive, setItemActive] = useState<number>(value);
  return (
    <section
      className={cn(
        "relative w-full max-w-full overflow-x-scroll scrollbar-hidden flex items-center gap-5 mb-10 z-[20]",
        delagothic.className,
      )}
    >
      {_category_list.map((item) => (
        <button
          onClick={() => {
            onSelected(item.pageNumber);
            setItemActive(item.pageNumber);
          }}
          key={item.pageNumber}
          style={{
            color: item.pageNumber === itemActive ? item.color : undefined,

            opacity: item.pageNumber === itemActive ? 1 : undefined,
          }}
          className={cn(
            "shrink-0 flex items-end gap-1 text-[#8D1111] opacity-20",
          )}
        >
          <h2 className="text-[1.25rem]">{item.lable}</h2>
          {item.pageNumber === itemActive && item.icon}
        </button>
      ))}
    </section>
  );
}

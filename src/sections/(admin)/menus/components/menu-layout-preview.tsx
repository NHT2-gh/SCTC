"use client";
import React, { useState } from "react";
import { MenuLayoutItem } from "@/types/menu";

export default function MenuLayoutPreview({
  items,
  onSelect,
}: {
  items: MenuLayoutItem[];
  onSelect: (item: MenuLayoutItem) => void;
}) {
  const [itemActive, setItemActive] = useState<string>();
  return (
    <div className="flex-1 p-10 max-w-full flex justify-center items-center overflow-auto border border-brand-200">
      <div className="w-[1440px] p-4 h-fit min-h-[500px] border">
        <div className="relative">
          {items.map((item) => (
            <div
              key={item.id}
              className="border hover:border-black focus:bg-neutral-500"
              onClick={() => {
                setItemActive(item.id);
                onSelect(item);
              }}
              style={{
                background: itemActive === item.id ? "gray" : "none",
                position: "absolute",
                top: item.y,
                left: item.x,
                width: item.w,
                height: item.h,
              }}
            >
              {item.drinks.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

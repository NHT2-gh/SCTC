import { MenuLayoutItem } from "@/types/menu";
import React from "react";

export default function MenuLayputItemEdit({ item }: { item: MenuLayoutItem }) {
  return <div className="flex-1">{item.drinks.name}</div>;
}

import { Button } from "@/components/ui/button";
import { Menu } from "@/types/menu";
import React from "react";

interface MenuCardProps {
  menuData: Menu;
  onView: (menuId: string) => void;
}

export default function MenuCard({ menuData, onView }: MenuCardProps) {
  return (
    <article className="flex justify-between items-center rounded-lg p-4 bg-brand-50 dark:bg-black/50 dark:text-white">
      <div>
        <h4 className="font-bold"> {menuData.name}</h4>
        <span>Published : {menuData.is_published ? "True" : "Fasle"}</span>
      </div>
      <Button onClick={() => onView(menuData.id)}>View Menu</Button>
    </article>
  );
}

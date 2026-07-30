import { ComponentRecipeItem } from "@/types/component";
import React from "react";

interface ComponentRecipeProps {
  items: ComponentRecipeItem[];
}

export default function ComponentRecipe({ items }: ComponentRecipeProps) {
  return (
    <div className="">
      {items.map((item) => (
        <div key={item.id} className="">
          <span>{item.ingredient_id}</span>
        </div>
      ))}
    </div>
  );
}

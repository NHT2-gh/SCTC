import { Component, ComponentType } from "@/types/component";
import React from "react";

interface ItemSearchProps {
  data: Component;
  onSelect: (id: string) => void;
}

export default function ItemSearch({ data, onSelect }: ItemSearchProps) {
  return (
    <article
      onClick={() => onSelect(data.id)}
      className="w-full border-b flex justify-between p-3 last:border-none"
    >
      <h4 className="font-semibold text-sm">
        {data.name} {data.description && "(" + data.description + ")"}
      </h4>

      <p className="text-xs text-gray-700">
        Phân loại: {ComponentType[data.component_type]}
      </p>
    </article>
  );
}

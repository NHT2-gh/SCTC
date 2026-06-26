"use client";
import React, { useState } from "react";
import { MenuLayoutItem } from "@/types/menu";
import { MenuItemCard } from "@/components/menu";
import { useFormContext, useWatch } from "react-hook-form";
import { MenuLayoutItemEditValidation } from "@/schemas/validation/menu.validation";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/components/form";
import { NumberInput, TextInput } from "@/components/ui/input";

export default function MenuLayoutPreview({
  items,
  onSelect,
}: {
  items: MenuLayoutItem[];
  onSelect: (item: MenuLayoutItem) => void;
}) {
  const editForm = useFormContext<MenuLayoutItemEditValidation>();
  const dataEditing = useWatch({ control: editForm.control });
  const [mode, setMode] = useState<"preview" | "editing">("preview");

  console.log(dataEditing.page);
  return (
    <div className="flex-2 p-10 max-w-full rounded-xl items-center overflow-auto border-2 border-brand-200 space-y-10">
      <Switch
        name="preview-mode"
        value={mode === "editing"}
        label="Edit Mode"
        onChange={(value) => setMode(value ? "editing" : "preview")}
      />

      <div
        className={cn(
          " border-2 rounded-xl relative w-[375px] mx-auto overflow-hidden p-4 h-[812px]",
        )}
      >
        <div className="relative">
          {items
            .filter((item) => item.page === dataEditing.page)
            .map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl flex flex-col items-center hover:opacity-80"
                onClick={() => {
                  onSelect(item);
                  if (mode !== "editing") setMode("editing");
                }}
                style={{
                  opacity:
                    mode === "editing"
                      ? dataEditing.id === item.id
                        ? "1"
                        : "0.2"
                      : "1",
                  cursor: "pointer",
                  position: "absolute",
                  top: dataEditing.id === item.id ? dataEditing.y : item.y,
                  left: dataEditing.id === item.id ? dataEditing.x : item.x,
                  width: dataEditing.id === item.id ? dataEditing.w : item.w,
                  height: dataEditing.id === item.id ? dataEditing.h : item.h,
                }}
              >
                <MenuItemCard
                  item={item.menu_items.products}
                  className={cn("bg-transparent", {
                    "flex-row-reverse text-right":
                      dataEditing.id === item.id && dataEditing?.x
                        ? dataEditing.x > 1 || dataEditing.x - 375 > 1
                        : item.x > 1,
                  })}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

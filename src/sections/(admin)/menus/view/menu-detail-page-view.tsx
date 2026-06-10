"use client";
import React, { useCallback, useState } from "react";
import { MenuType } from "@/types/menu";
import { useAddMenuItems, useGetMenuDetail } from "@/hooks/queries/use-menu";
import { MainContainer } from "@/components/common/page-layout";
import { DrinkCard, DrinksSearchBox } from "../components";
import { SearchBar } from "@/components/search-bar";
import { diffBasicArray } from "@/utils/diff-array";
import { showToast } from "@/lib/toast";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { TableDropdown } from "@/components/common/table-dropdown";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { EllipsisVertical, Eye, LayoutIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuDetailProps {
  id: string;
}

export default function MenuDetailPageView({ id }: MenuDetailProps) {
  const { data: menuItems, isLoading } = useGetMenuDetail(id);
  const addMenuItems = useAddMenuItems();

  console.log(
    menuItems?.data.map((item) => {
      return item.drinks.id;
    }),
  );
  const handleAddItems = useCallback(async (ids: string[]) => {
    const originalArray =
      menuItems?.data && menuItems?.data?.length > 0
        ? menuItems?.data.map((item) => {
            return item.drinks.id;
          })
        : undefined;

    if (originalArray) {
      const { added, removed } = diffBasicArray<string>(originalArray, ids);

      try {
        const result = await addMenuItems.mutateAsync({
          menuId: id,
          ids: added,
        });

        if (result.success) {
          showToast.success({ title: "Thành công cập nhật menu" });
        }
      } catch (error) {
        showToast.error({
          title: "Thất bại",
          description: mapErrorToMessage(error),
        });
      }
    }
  }, []);
  return (
    <MainContainer title={"Thiết lập Menu"}>
      <div className="flex justify-between">
        {!isLoading && menuItems?.data && (
          <DrinksSearchBox
            itemsIds={menuItems?.data.map((item) => {
              return item.drinks.id;
            })}
            onAdd={(ids) => handleAddItems(ids)}
          />
        )}
        <Button>
          <LayoutIcon />
          Thiết lập Layout Menu
        </Button>
      </div>
      <section className="grid grid-cols-[repeat(auto-fill,150px)] gap-3">
        {menuItems?.data.length === 0 && (
          <span className="italic">Chưa có item nào được thêm</span>
        )}
        {menuItems?.data.map((item) => (
          <DrinkCard key={item.id} item={item} />
        ))}
      </section>
    </MainContainer>
  );
}

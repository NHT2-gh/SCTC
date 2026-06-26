"use client";
import React, { useCallback, useState } from "react";
import { useAddMenuItems, useGetMenuDetail } from "@/hooks/queries/use-menu";
import { MainContainer } from "@/components/common/page-layout";
import { ProductCard, DrinksSearchBox } from "../components";
import { diffBasicArray } from "@/utils/diff-array";
import { showToast } from "@/lib/toast";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { Button } from "@/components/ui/button";
import { LayoutIcon } from "lucide-react";
import { APP_ROUTES } from "@/config/app-routes";
import Link from "next/link";

interface MenuDetailProps {
  id: string;
}

export default function MenuDetailPageView({ id }: MenuDetailProps) {
  const { data: menuItems, isLoading } = useGetMenuDetail(id);
  const addMenuItems = useAddMenuItems();
  const handleAddItems = useCallback(async (ids: string[]) => {
    const originalArray =
      menuItems?.data && menuItems?.data?.length > 0
        ? menuItems?.data.map((item) => {
            return item.products.id;
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
    <MainContainer
      title={"Thiết lập Menu"}
      links={[
        {
          label: "Quản lý menu",
          href: APP_ROUTES.ADMIN.MENUS.BASE,
        },
      ]}
    >
      <div className="md:flex md:gap-10 md:justify-between space-y-5">
        {!isLoading && menuItems?.data && (
          <DrinksSearchBox
            itemsIds={menuItems?.data.map((item) => {
              return item.products.id;
            })}
            onAdd={(ids) => handleAddItems(ids)}
          />
        )}
        <Link href={APP_ROUTES.ADMIN.MENUS.LAYOUTS(id)}>
          <Button>
            <LayoutIcon />
            Thiết lập Layout Menu
          </Button>
        </Link>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,300px)] gap-3">
        {menuItems?.data.length === 0 && (
          <span className="italic">Chưa có item nào được thêm</span>
        )}
        {menuItems?.data.map((item) => (
          <Link
            key={item.id}
            href={APP_ROUTES.ADMIN.MENUS.ITEMS.DETAIL(id, item.id)}
          >
            <ProductCard item={item.products} />
          </Link>
        ))}
      </section>
    </MainContainer>
  );
}

"use client";
import React, { useState } from "react";
import { showToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/config/app-routes";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { useGetMenuLayouts, useInitLayoutMenu } from "@/hooks/queries/use-menu";
import { MainContainer } from "@/components/common/page-layout";
import {
  MenuLayoutItemEdit,
  MenuLayoutItems,
  MenuLayoutPreview,
} from "../components";
import { MenuLayoutItem } from "@/types/menu";

interface MenuLayoutPageViewProps {
  menuId: string;
}
export default function MenuLayoutPageView({
  menuId,
}: MenuLayoutPageViewProps) {
  const initLayout = useInitLayoutMenu();
  const { data: layoutMenuItems } = useGetMenuLayouts(menuId);
  const [itemSelected, setItemSelected] = useState<MenuLayoutItem | null>(null);
  const handleInitLayout = async () => {
    try {
      const result = await initLayout.mutateAsync(menuId);
      if (result.success)
        showToast.success({
          title: "Thành công khởi tạo layout",
          description: result.message,
        });
      else
        showToast.error({ title: "Thất bại", description: "Vui lòng thử lại" });
    } catch (error) {
      mapErrorToMessage(error);
    }
  };

  return (
    <MainContainer
      title={"Thiết lập Menu Layout"}
      links={[
        {
          label: "Thiết lập Menu",
          href: APP_ROUTES.ADMIN.MENUS.DETAIL(menuId),
        },
        { label: "Menu Layout" },
      ]}
    >
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handleInitLayout();
          }}
        >
          Khởi tạo layout cho menu
        </Button>
      </div>
      <section className="space-y-10">
        {layoutMenuItems?.data && (
          <>
            <MenuLayoutPreview
              items={layoutMenuItems.data}
              onSelect={(item) => setItemSelected(item)}
            />
            <div className="flex gap-10">
              <MenuLayoutItems
                items={layoutMenuItems?.data}
                onSelect={(item) => {
                  setItemSelected(item);
                }}
              />

              {itemSelected && <MenuLayoutItemEdit item={itemSelected} />}
            </div>
          </>
        )}
      </section>
    </MainContainer>
  );
}

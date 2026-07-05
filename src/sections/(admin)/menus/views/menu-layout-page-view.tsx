"use client";
import React, { useEffect, useState } from "react";
import { showToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/config/app-routes";
import { mapErrorToMessage } from "@/lib/error/app-error";
import {
  useGetMenuLayouts,
  useUpdateLayoutItem,
  useUpdateLayoutMenu,
} from "@/hooks/queries/use-menu";
import { MainContainer } from "@/components/common/page-layout";
import {
  MenuLayoutItemEdit,
  MenuLayoutItems,
  MenuLayoutPreview,
} from "../components";
import { MenuLayoutItem } from "@/types/menu";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { MenuLayoutItemEditValidation } from "@/schemas/validation/menu.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "@/components/form/Form";
import { FormField } from "@/components/form";

interface MenuLayoutPageViewProps {
  menuId: string;
}
export default function MenuLayoutPageView({
  menuId,
}: MenuLayoutPageViewProps) {
  const updateLayoutMenu = useUpdateLayoutMenu();
  const updateLayoutItem = useUpdateLayoutItem();
  const { data: layoutMenuItems } = useGetMenuLayouts(menuId);
  const [itemSelected, setItemSelected] = useState<MenuLayoutItem | null>(null);
  const editLayoutItemForm = useForm<MenuLayoutItemEditValidation>({
    resolver: zodResolver(MenuLayoutItemEditValidation),
    defaultValues: {
      menuId: menuId,
      id: itemSelected?.id,
      x: itemSelected?.x,
      y: itemSelected?.y,
      w: itemSelected?.w,
      h: itemSelected?.h,
      page: itemSelected?.page,
    },
  });

  const { handleSubmit, setValue } = editLayoutItemForm;

  const handleInitLayout = async () => {
    try {
      const result = await updateLayoutMenu.mutateAsync(menuId);
      if (result.success)
        showToast.success({
          title: "Thành công cập nhật layout",
          description: result.message,
        });
      else
        showToast.error({ title: "Thất bại", description: "Vui lòng thử lại" });
    } catch (error) {
      mapErrorToMessage(error);
    }
  };

  const onSubmit = async (data: MenuLayoutItemEditValidation) => {
    try {
      const result = await updateLayoutItem.mutateAsync(data);
      if (result.success) showToast.success({ title: "Cập nhật thành công" });
      else showToast.error({ title: "Thất bại" });
    } catch {}
  };

  useEffect(() => {
    if (itemSelected) {
      setValue("menuId", menuId);
      setValue("id", itemSelected.id);
      setValue("w", itemSelected.w);
      setValue("h", itemSelected.h);
      setValue("x", itemSelected.x);
      setValue("y", itemSelected.y);
      setValue("page", itemSelected.page);
    }
  }, [itemSelected]);

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
          disabled={updateLayoutMenu.isPending}
        >
          Update Menu Layout
        </Button>
      </div>
      <FormProvider {...editLayoutItemForm}>
        <section className="flex gap-10 space-y-10">
          {layoutMenuItems?.data && (
            <>
              <MenuLayoutPreview
                items={layoutMenuItems.data}
                onSelect={(item) => setItemSelected(item)}
              />
              <section className="flex-3 space-y-4">
                {itemSelected && (
                  <section className="flex-1  bg-neutral-50 rounded-xl h-fit p-3">
                    <div className="">
                      {itemSelected.menu_items.products.name}
                    </div>
                    <Form
                      className="grid !grid-cols-2 gap-y-5  h-fit"
                      onSubmit={handleSubmit(onSubmit, (err) => {
                        console.log("VALIDATION ERROR", err);
                      })}
                    >
                      <MenuLayoutItemEdit />

                      <FormField
                        field={{
                          name: "row",
                          label: "Hàng",
                          min: 1,
                          type: "number",
                          handleOnChange: (value: number) => {
                            const h = 110;
                            if (value !== 1) setValue("y", h * (value - 1) + 8);
                            else setValue("y", 0);
                            if (value % 2 === 0) setValue("x", 8);
                            else setValue("x", 0);
                          },
                        }}
                      />
                      <Button
                        disabled={updateLayoutItem.isPending}
                        type="submit"
                      >
                        {updateLayoutItem.isPending ? "Updating" : "Apply"}
                      </Button>
                    </Form>
                  </section>
                )}

                <MenuLayoutItems
                  items={layoutMenuItems?.data}
                  onSelect={(item) => {
                    setItemSelected(item);
                  }}
                />
              </section>
            </>
          )}
        </section>
      </FormProvider>
    </MainContainer>
  );
}

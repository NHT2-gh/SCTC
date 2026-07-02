import { ProductDetail } from "@/types/product";
import React from "react";
import { MenuItemEditForm } from "../components";
import { MainContainer } from "@/components/common/page-layout";
import { APP_ROUTES } from "@/config/app-routes";

export default function MenuItemDetailPageView({
  data,
}: {
  data: ProductDetail;
}) {
  return (
    <MainContainer
      title="Thiết lập thông tin sản phẩm"
      links={[
        {
          label: "Quản lý menu",
          href: APP_ROUTES.ADMIN.MENUS.DETAIL(data.info.menu_id),
        },
        { label: data.info.products.name },
      ]}
    >
      <MenuItemEditForm data={data} />
    </MainContainer>
  );
}

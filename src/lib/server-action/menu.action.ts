"use server";
import { menuService } from "@/services/menu.service";
import { ServerActionResponse } from "@/types/common";
import { MenuLayoutItem } from "@/types/menu";
import { mapErrorToMessage } from "../error/app-error";
import { ProductDetail } from "@/types/product";
import { getCurrentTable } from "../table/get-current-table";

export async function serverActionGetMenuLayoutPublic(): Promise<
  ServerActionResponse<MenuLayoutItem[]>
> {
  try {
    const { data, success } = await menuService.getMenuLayoutPublic();

    return { data: data || [], success, error: null };
  } catch (error) {
    return { data: [], success: false, error: mapErrorToMessage(error) };
  }
}

export async function serverActionGetMenuItemInfo(
  menuItemId: string,
): Promise<ServerActionResponse<ProductDetail | null>> {
  const info = await menuService.getMenuItem(menuItemId);

  if (!info.success || !info.data) {
    return {
      data: null,
      success: false,
      error: "Lỗi truy cập thông tin sản phẩm",
    };
  }

  const productOptions = await menuService.getProductOptions(
    menuItemId,
    info.data.product.product_type,
  );

  const tableInfo = await getCurrentTable();

  let isAllowOrder = true;

  if (!tableInfo?.tableId && info.data.product.is_only_allow_dinein) {
    isAllowOrder = false;
  } else if (!info.data.product.is_active) {
    isAllowOrder = false;
  }

  return {
    data: {
      info: info.data,
      options: {
        custom: productOptions.data.custom || [],
        fixed: productOptions.data.fixed || [],
      },
      isAllowOrder,
    },
    success: true,
    error: null,
  };
}

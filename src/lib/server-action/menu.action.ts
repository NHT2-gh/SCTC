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
  const [info, options] = await Promise.all([
    menuService.getMenuItem(menuItemId),
    menuService.getProductOptions(menuItemId),
  ]).catch(() => {
    return [null, null];
  });

  const currentTable = await getCurrentTable();
  let isAllowOrder = true;

  if (!info || !options) {
    return {
      data: null,
      success: false,
      error: "Lỗi truy cập thông tin sản phẩm",
    };
  }

  if (currentTable?.tableId !== null) {
    if (info.data.products.is_only_allow_dinein) {
      isAllowOrder = false;
    } else if (!info.data.products.is_active) {
      isAllowOrder = false;
    }
  }

  return {
    data: {
      info: info.data,
      options: options.data,
      is_allow_order: isAllowOrder,
    },
    success: true,
    error: null,
  };
}

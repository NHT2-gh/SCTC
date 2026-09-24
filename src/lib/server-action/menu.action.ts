"use server";
import { MenuLayoutItem } from "@/types/menu";
import { ProductDetail } from "@/types/product";
import { menuService } from "@/services/menu.service";
import { ServerActionResponse } from "@/types/common";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { getCurrentTable } from "@/lib/table/get-current-table";

export async function serverActionGetMenuLayoutPublic(): Promise<
  ServerActionResponse<MenuLayoutItem[]>
> {
  try {
    const { data, success } = await menuService.getMenuLayoutPublic();
    return { data: data || [], success, error: null };
  } catch (error) {
    throw mapErrorToMessage(error);
  }
}

export async function serverActionGetMenuItemInfo(
  menuItemId: string,
): Promise<ServerActionResponse<ProductDetail | null>> {
  try {
    const result = await menuService.getMenuItem(menuItemId);
    if (result.success) {
      const productOptions = await menuService.getProductOptions(
        menuItemId,
        result.data.product.product_type,
      );
      const tableInfo = await getCurrentTable();

      let isAllowOrder = true;

      if (!tableInfo?.tableId && result.data.product.is_only_allow_dinein) {
        isAllowOrder = false;
      } else if (!result.data.product.is_active) {
        isAllowOrder = false;
      }

      return {
        data: {
          info: result.data,
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
  } catch {
    return {
      data: null,
      success: false,
      error: "Lỗi truy cập thông tin sản phẩm",
    };
  }

  return {
    data: null,
    success: false,
    error: "Không thể truy cập menu",
  };
}

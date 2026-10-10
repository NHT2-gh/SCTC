"use server";
import { MenuLayoutItem } from "@/types/menu";
import { ProductDetail } from "@/types/product";
import { ErrorCode } from "@/lib/error/error-codes";
import { menuService } from "@/services/menu.service";
import { ServerActionResponse } from "@/types/common";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { getCurrentTable } from "@/lib/table/get-current-table";

export async function serverActionGetMenuLayoutPublic(): Promise<
  ServerActionResponse<MenuLayoutItem[]>
> {
  try {
    const { data, success } = await menuService.getMenuLayoutPublic();
    return {
      data: data || [],
      success,
      error: success
        ? null
        : {
            code: ErrorCode.FAILED,
            message: mapErrorToMessage(ErrorCode.FAILED),
          },
    };
  } catch (error: any) {
    return {
      data: [],
      success: false,
      error: { code: error.code, message: mapErrorToMessage(error) },
    };
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
  } catch (error: any) {
    return {
      data: null,
      success: false,
      error: { code: error.code, message: mapErrorToMessage(error) },
    };
  }

  return {
    data: null,
    success: false,
    error: {
      code: ErrorCode.FAILED,
      message: mapErrorToMessage(ErrorCode.FAILED),
    },
  };
}

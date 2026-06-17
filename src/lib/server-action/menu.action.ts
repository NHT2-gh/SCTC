import { menuService } from "@/services/menu.service";
import { ServerActionResponse } from "@/types/common";
import { MenuLayoutItem } from "@/types/menu";
import { mapErrorToMessage } from "../error/app-error";
import { ProductDetail } from "@/types/product";
import { OptionsAdapter } from "@/adapters/options.adapter";

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
    menuService.getMenuItemOptionsDetail(menuItemId),
  ]).catch(() => {
    return [null, null];
  });

  if (!info || !options) {
    return {
      data: null,
      success: false,
      error: "Lỗi truy cập thông tin sản phẩm",
    };
  }

  return {
    data: { info: info.data, options: OptionsAdapter(options.data) },
    success: true,
    error: null,
  };
}

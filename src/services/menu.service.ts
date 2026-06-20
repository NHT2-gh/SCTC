import { supabase } from "@/supabase/supabaseClients";
import {
  ItemOptionDetail,
  Menu,
  MenuItem,
  MenuItemOption,
  MenuLayoutItem,
} from "@/types/menu";
import { handlePostgresError } from "@/lib/error/postgres-error";
import {
  GetWithFilterParams,
  MutationResult,
  ResponseStandard,
} from "@/types/common";
import { MenuLayoutItemEditValidation } from "@/schemas/validation/menu.validation";
import { SelectedOption } from "@/types/cart";
import { FixedOptionAdapter, OptionsAdapter } from "@/adapters/options.adapter";

class MenuService {
  private baseTable: string;
  private menuItemsTable: string;
  private layoutMenuTable: string;
  private itemOptionsDetailTable: string;

  constructor() {
    this.baseTable = "menus";
    this.menuItemsTable = "menu_items";
    this.layoutMenuTable = "menu_layout_items";
    this.itemOptionsDetailTable = "item_options_detail";
  }

  async getAllMenus(
    params?: GetWithFilterParams,
  ): Promise<ResponseStandard<Menu[]>> {
    const { data, error } = await supabase.from(this.baseTable).select(`*`);

    if (error) handlePostgresError(error);

    return {
      success: true,
      data: data || [],
    };
  }

  async getMenuDetail(id: string): Promise<ResponseStandard<MenuItem[]>> {
    const query = supabase
      .from(this.menuItemsTable)
      .select(
        `
          *,
          products!inner(
            *
          ) 
        `,
      )
      .eq("menu_id", id);

    const { data: items, error } = await query;

    if (error) handlePostgresError(error);

    return {
      success: true,
      data: items || [],
    };
  }

  async addMenuItems(
    menuId: string,
    drinkIds: string[],
  ): Promise<MutationResult> {
    if (!menuId || !drinkIds) return { success: false };
    const itemsUpdate = drinkIds.map((id) => {
      return {
        drink_id: id,
        menu_id: menuId,
      };
    });

    if (!itemsUpdate) return { success: false };
    const query = supabase.from(this.menuItemsTable).insert(itemsUpdate);
    const { error } = await query;
    if (error) handlePostgresError(error);
    return {
      success: true,
    };
  }

  async getMenuLayoutItems(
    menuId: string,
  ): Promise<ResponseStandard<MenuLayoutItem[]>> {
    if (!menuId) return { success: false, data: [] };

    const query = supabase
      .from(this.layoutMenuTable)
      .select(
        `
        *,
        menu_items!inner(
            products!inner(
                    *
                )
        )
        `,
      )
      .eq("menu_id", menuId);

    const { data: menuLayoutItems, error } = await query;

    if (error) handlePostgresError(error);

    return {
      data: menuLayoutItems || [],
      success: true,
    };
  }

  async initMenuLayout(menuId: string): Promise<MutationResult> {
    const query = supabase.rpc("init_menu_layout", { p_menu_id: menuId });
    const { statusText, error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: true,
      message: statusText,
    };
  }

  async updateMenuLayoutItem(
    data: MenuLayoutItemEditValidation,
  ): Promise<MutationResult> {
    const query = supabase
      .from(this.layoutMenuTable)
      .update({
        x: data.x,
        y: data.y,
        w: data.w,
        h: data.h,
      })
      .eq("id", data.id);

    const { error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: true,
    };
  }

  // Public

  async getMenuLayoutPublic(): Promise<ResponseStandard<MenuLayoutItem[]>> {
    const query = supabase.from(this.layoutMenuTable).select(
      `
        *,
        menu_items!inner(
        *,
            products!inner(
                    *
                )
        )
        `,
    );

    const { data: menuLayoutItems, error } = await query;

    if (error) handlePostgresError(error);

    return {
      data: menuLayoutItems || [],
      success: true,
    };
  }

  async getMenuItemOptionsDetail(
    menuItemId: string,
  ): Promise<ResponseStandard<SelectedOption[]>> {
    const query = supabase
      .from(this.itemOptionsDetailTable)
      .select(
        `
        *,
        menu_items_options!inner(
            *,
            components!inner(
              *
            )
        )
        `,
      )
      .eq("menu_item_id", menuItemId);

    const { data: raw, error } = await query;

    if (error) handlePostgresError(error);
    if (raw) {
      return {
        success: true,
        data: OptionsAdapter(raw) || [],
      };
    } else {
      return {
        success: true,
        data: [],
      };
    }
  }

  async getMenuItem(menuItemId: string): Promise<ResponseStandard<MenuItem>> {
    const query = supabase
      .from(this.menuItemsTable)
      .select(
        `
            *,
            products!inner(
                *
            )
        `,
      )
      .eq("id", menuItemId)
      .single();

    const { data: menuItem, error } = await query;

    if (error) handlePostgresError(error);

    return {
      success: true,
      data: menuItem,
    };
  }

  async getFixedOptions(): Promise<ResponseStandard<SelectedOption[]>> {
    const query = supabase
      .from("menu_items_options")
      .select(`*`)
      .in("option_type", ["ice", "sweet"]);

    const { data: fixedOptions, error } = await query;

    if (error) handlePostgresError(error);

    try {
      FixedOptionAdapter(fixedOptions as MenuItemOption[]);
    } catch (error) {
      console.log(error);
    }

    return {
      success: true,
      data: FixedOptionAdapter(fixedOptions as MenuItemOption[]) || [],
    };
  }

  async getProductOptions(
    menuItemId: string,
  ): Promise<
    ResponseStandard<{ custom: SelectedOption[]; fixed: SelectedOption[] }>
  > {
    const [customOptions, fiexedOptions] = await Promise.all([
      this.getMenuItemOptionsDetail(menuItemId),
      this.getFixedOptions(),
    ]);

    return {
      success: true,
      data: {
        custom: customOptions.data || [],
        fixed: fiexedOptions.data || [],
      },
    };
  }
}

export const menuService = new MenuService();

import { supabase } from "@/supabase/supabaseClients";
import {
  ItemOptionDetail,
  Menu,
  MenuItem,
  MenuItemOption,
  MenuLayoutItem,
} from "@/types/menu";
import { handlePostgresError } from "@/lib/error/postgres-error";
import { GetParams, MutationResult, ResponseStandard } from "@/types/common";
import {
  MenuLayoutItemEditValidation,
  ProductInfoValidation,
  ProductOptionValidation,
} from "@/schemas/validation/menu.validation";
import { SelectedOption } from "@/types/cart";
import { FixedOptionAdapter, OptionsAdapter } from "@/adapters/options.adapter";
import { UpsertProductOptionValidation } from "@/schemas/validation/product-option.validation";
import {
  _product_setting,
  allOptionFixedType,
  fixedOptionType,
} from "@/_mocks/_setting/_product_detal_setting";
import { ProductType } from "@/types/product";

class MenuService {
  private baseTable: string;
  private menuItemsTable: string;
  private layoutMenuTable: string;
  private itemOptionsDetailTable: string;
  private menuItemsOptions: string;

  constructor() {
    this.baseTable = "menus";
    this.menuItemsTable = "menu_items";
    this.layoutMenuTable = "menu_layout_items";
    this.itemOptionsDetailTable = "item_options_detail";
    this.menuItemsOptions = "menu_items_options";
  }

  async getAllMenus(
    params?: GetParams<Menu>,
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
          product:products!inner(
            *
          ) 
        `,
      )
      .eq("menu_id", id)
      .order("product(product_type)", {
        ascending: true,
      });

    const { data: items, error } = await query;

    if (error) handlePostgresError(error);

    return {
      success: true,
      data: (items as unknown as MenuItem[]) || [],
    };
  }

  async addMenuItems(
    menuId: string,
    productIds: string[],
  ): Promise<MutationResult> {
    if (!menuId || !productIds) return { success: false };
    const itemsUpdate = productIds.map((id) => {
      return {
        product_id: id,
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

  async updateMenuLayout(menuId: string): Promise<MutationResult> {
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
        page: data.page,
      })
      .eq("id", data.id);

    const { error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: true,
    };
  }

  async updateProductInfo(
    data: Partial<ProductInfoValidation>,
  ): Promise<MutationResult> {
    const query = supabase
      .from("products")
      .update({
        name: data.name,
        selling_price: data.selling_price,
        description: data.description,
        image_url: data.image_url,
        is_active: data.is_active,
        product_type: data.product_type,
      })
      .eq("id", data.id);

    const { error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: true,
    };
  }

  async upsertProductOptions(
    data: Pick<
      ProductOptionValidation,
      "menuItemId" | "id" | "limit" | "option_id"
    >[],
  ): Promise<MutationResult> {
    const query = supabase.from(this.itemOptionsDetailTable).upsert(
      data.map((option) => ({
        id: option.id,
        option_id: option.option_id,
        menu_item_id: option.menuItemId,
        limit: option.limit,
      })),
    );

    const { error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: true,
    };
  }

  async deleteMenuItemOption(payload: {
    menuItemId: string;
    optionId: string[];
  }): Promise<MutationResult> {
    const query = supabase
      .from(this.itemOptionsDetailTable)
      .delete()
      .in("id", payload.optionId)
      .eq("menu_item_id", payload.menuItemId);

    const { error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: true,
    };
  }

  async getAllOptions(
    params?: GetParams<MenuItemOption>,
  ): Promise<ResponseStandard<MenuItemOption[]>> {
    const query = supabase.from(this.menuItemsOptions).select(
      `*,
      components(
        *
      ),
      ingredients(
        *
      )
      `,
    );

    if (params?.filters?.option_type === "fixed") {
      query.in("option_type", allOptionFixedType);
    } else {
      query.notIn("option_type", allOptionFixedType);
    }

    if (params?.searchText && params.searchText !== "/all") {
      query.ilike("option_name", `%${params.searchText}%`);
    }

    const { data: options, error } = await query;

    if (error) handlePostgresError(error);

    return {
      success: true,
      data: options || [],
    };
  }

  async upsertProductOption(
    data: UpsertProductOptionValidation,
  ): Promise<MutationResult> {
    const query = supabase.from(this.menuItemsOptions).upsert(data);

    const { error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: true,
    };
  }

  async removeMenuItem(
    productIds: string[],
    menuId: string,
  ): Promise<MutationResult> {
    const query = supabase
      .from(this.menuItemsTable)
      .delete()
      .in("product_id", productIds)
      .eq("menu_id", menuId);
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
          product:products!inner(
            *
          )
        )
        `,
    );

    const { data: menuLayoutItems, error } = await query;

    if (error) handlePostgresError(error);

    return {
      data: (menuLayoutItems as unknown as MenuLayoutItem[]) || [],
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
            components(
              *
            ),
            ingredients(
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
          product:products!inner(
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

  async getFixedOptions(
    productType?: ProductType,
  ): Promise<ResponseStandard<SelectedOption[]>> {
    const query = supabase.from("menu_items_options").select(`*`);

    if (productType) {
      query.in("option_type", fixedOptionType[productType]);
    } else {
      query.in("option_type", allOptionFixedType);
    }

    const { data: fixedOptions, error } = await query;

    if (error) handlePostgresError(error);

    return {
      success: true,
      data: FixedOptionAdapter(fixedOptions as MenuItemOption[]) || [],
    };
  }

  async getProductOptions(
    menuItemId: string,
    productType?: ProductType,
  ): Promise<
    ResponseStandard<{ custom: SelectedOption[]; fixed: SelectedOption[] }>
  > {
    const [customOptions, fiexedOptions] = await Promise.all([
      this.getMenuItemOptionsDetail(menuItemId),
      this.getFixedOptions(productType),
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

import { supabase } from "@/supabase/supabaseClients";
import { Menu, MenuItem, MenuLayoutItem, MenuType } from "@/types/menu";
import { handlePostgresError } from "@/lib/error/postgres-error";
import {
  GetWithFilterParams,
  MutationResult,
  ResponseStandard,
} from "@/types/common";
import { success } from "zod";

export class MenuService {
  private baseTable: string;
  private drinkMenuTable: string;
  private cocktailMenuTable: string;
  private foodMenuTable: string;
  private layoutMenuTable: string;

  constructor() {
    this.baseTable = "menus";
    this.drinkMenuTable = "menu_drinks";
    this.cocktailMenuTable = "cocktail_menus";
    this.foodMenuTable = "food_menus";
    this.layoutMenuTable = "menu_layout_items";
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
      .from(this.drinkMenuTable)
      .select(
        `*,
           drinks!inner(
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
    const query = supabase.from(this.drinkMenuTable).insert(itemsUpdate);
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
            drinks!inner(
            *
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

    console.log(menuId);

    if (error) handlePostgresError(error);
    return {
      success: true,
      message: statusText,
    };
  }
}

export const menuService = new MenuService();

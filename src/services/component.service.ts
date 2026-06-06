import { ErrorCode } from "@/lib/error/error-codes";
import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { ResponseStandard } from "@/types/common";
import { Component, ComponentRecipeItems } from "@/types/component";

class ComponentService {
  private tableName: string;
  private tableDetail: string;

  constructor() {
    this.tableName = "components";
    this.tableDetail = "component_recipe_items";
  }

  async getAllComponents(
    searchName?: string,
  ): Promise<ResponseStandard<Component[]>> {
    if (!searchName) {
      return {
        success: false,
        data: [],
      };
    }

    const query = supabase
      .from(this.tableName)
      .select(`*`)
      .ilike("name", `%${searchName}%`);

    const { data: components, error } = await query;

    if (error) handlePostgresError(error);

    return {
      success: true,
      data: components || [],
    };
  }

  async getComponentRecipeItems(
    id: string,
  ): Promise<ResponseStandard<ComponentRecipeItems[] | null>> {
    if (!id)
      return {
        success: false,
        data: null,
        message: ErrorCode["INVALID_INPUT"],
      };
    const query = supabase
      .from(this.tableDetail)
      .select(`*`)
      .eq("component_id", id);

    const { data: recipeItems, error } = await query;

    if (error) handlePostgresError(error);

    return {
      success: true,
      data: recipeItems,
    };
  }
}

export const componentService = new ComponentService();

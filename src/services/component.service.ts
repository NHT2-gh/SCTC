import { ErrorCode } from "@/lib/error/error-codes";
import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { MutationResult, ResponseStandard } from "@/types/common";
import { Component, ComponentRecipeItem } from "@/types/component";

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
  ): Promise<ResponseStandard<ComponentRecipeItem[] | null>> {
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

  async upsertComponentRecipeItems(
    data: ComponentRecipeItem[],
  ): Promise<MutationResult> {
    if (!data.length) {
      return {
        success: false,
        message: ErrorCode["INVALID_INPUT"],
      };
    }

    const { error } = await supabase.from(this.tableDetail).upsert(data, {
      onConflict: "id",
    });

    if (error) handlePostgresError(error);

    return {
      success: true,
    };
  }

  async deleteComponentRecipeItems(ids: string[]): Promise<MutationResult> {
    if (!ids.length) {
      return {
        success: false,
        message: ErrorCode["INVALID_INPUT"],
      };
    }

    const { error } = await supabase
      .from(this.tableDetail)
      .delete()
      .in("id", ids);

    if (error) handlePostgresError(error);

    return {
      success: true,
    };
  }
}

export const componentService = new ComponentService();

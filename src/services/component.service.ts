import { ErrorCode } from "@/lib/error/error-codes";
import { supabase } from "@/supabase/supabaseClients";
import { handlePostgresError } from "@/lib/error/postgres-error";
import { MutationResult, ResponseStandard } from "@/types/common";
import { Component, ComponentRecipeItem } from "@/types/component";
import { ComponentValidationSchema } from "@/schemas/validation/component.validation";

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
    const query = supabase.from(this.tableName).select(`*`);

    if (searchName) {
      query.ilike("name", `%${searchName}%`);
    }

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
    recipe_items: ComponentRecipeItem[],
  ): Promise<MutationResult> {
    if (!recipe_items.length) {
      return {
        success: false,
        message: ErrorCode["INVALID_INPUT"],
      };
    }

    const query = supabase.from(this.tableDetail).upsert(recipe_items, {
      onConflict: "id",
      ignoreDuplicates: false,
    });

    const { error } = await query;

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

  async addComponent(data: ComponentValidationSchema): Promise<MutationResult> {
    if (!data) {
      return {
        success: false,
        message: ErrorCode["INVALID_INPUT"],
      };
    }

    const { error } = await supabase
      .from(this.tableName)
      .insert(data as unknown as Component);

    if (error) handlePostgresError(error);

    return {
      success: true,
    };
  }

  async updateComponent(
    componentId: string,
    data: Partial<Component>,
  ): Promise<MutationResult> {
    if (!data) {
      return {
        success: false,
        message: ErrorCode["INVALID_INPUT"],
      };
    }

    const { error } = await supabase
      .from(this.tableName)
      .update(data as unknown as Component)
      .eq("id", componentId);

    if (error) handlePostgresError(error);

    return {
      success: true,
    };
  }
}

export const componentService = new ComponentService();

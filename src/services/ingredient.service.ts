import { supabase } from "@/supabase/supabaseClients";
import { handlePostgresError } from "@/lib/error/postgres-error";
import { Ingredient } from "@/types/ingredient";
import {
  GetWithFilterParams,
  MutationResult,
  ResponseStandard,
} from "@/types/common";
import { IngredientValidationSchema } from "@/schemas/validation/ingredient.validation";
import { errorMessageMap, mapErrorToMessage } from "@/lib/error/app-error";

class IngredientService {
  private tableName: string;

  constructor() {
    this.tableName = "ingredients";
  }

  async getAllIngredient(
    params?: GetWithFilterParams<Ingredient>,
  ): Promise<ResponseStandard<Ingredient[]>> {
    const query = supabase.from(this.tableName).select(
      `
    *
    `,
    );

    if (params?.searchText && params.searchText !== null) {
      query.or(`name.ilike.%${params.searchText}%`);
    }

    if (params?.page && params?.limit) {
      query.range(
        (params.page - 1) * params.limit,
        params.page * params.limit - 1,
      );
    }

    const { data, error } = await query.order("category_code", {
      ascending: true,
    });
    if (error) handlePostgresError(error);

    return {
      success: true,
      data: data || [],
    };
  }

  async addIngredient(
    data: IngredientValidationSchema,
  ): Promise<MutationResult> {
    if (!data) {
      return {
        success: false,
        message: errorMessageMap["INVALID_INPUT"],
      };
    }
    const query = supabase.from(this.tableName).insert(data);

    const { data: result, error } = await query.single();

    if (error) {
      handlePostgresError(error);
    }
    if (!result) {
      return {
        success: false,
        message: "Thêm nguyên liệu thất bại",
      };
    }
    return {
      success: true,
      message: "Thêm nguyên liệu thành công",
    };
  }

  async editIngredient(data: IngredientValidationSchema) {
    if (!data) {
      return {
        success: false,
        message: errorMessageMap["INVALID_INPUT"],
      };
    }
    const query = supabase.from(this.tableName).update(data).eq("id", data.id);

    const { data: result, error } = await query.single();

    if (error) {
      mapErrorToMessage(error);
    }
    if (!data) {
      return {
        success: false,
        message: "Sửa nguyên liệu thất bại",
      };
    }
    return {
      success: true,
      message: "Sửa nguyên liệu thành công",
    };
  }
}

export const ingredientService = new IngredientService();

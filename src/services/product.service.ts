import { handlePostgresError } from "@/lib/error/postgres-error";
import { ProductInfoValidation } from "@/schemas/validation/menu.validation";
import { ProductRecipeItemValidationSchema } from "@/schemas/validation/recipe.validation";
import { supabase } from "@/supabase/supabaseClients";
import {
  GetWithFilterParams,
  MutationResult,
  ResponseStandard,
} from "@/types/common";
import { Product } from "@/types/product";
import { ProductRecipeItem, ProductRecipeVersion } from "@/types/product";

class ProductService {
  private tableName: string;
  private productRecipesTableName: string;
  private productRecipeItemsTableName: string;
  constructor() {
    this.tableName = "products";
    this.productRecipesTableName = "product_recipe_versions";
    this.productRecipeItemsTableName = "product_recipe_items";
  }

  async getAllProduct(
    params?: GetWithFilterParams<Product>,
  ): Promise<ResponseStandard<Product[]>> {
    const query = supabase.from(this.tableName).select(`*`);

    if (params?.searchText === "/all") {
      console.log("ping");
      query;
    } else if (params?.searchText) {
      query.ilike("name", `%${params.searchText}%`);
    }

    const { data: drinks, error } = await query;
    if (error) handlePostgresError(error);
    return {
      success: true,
      data: drinks || [],
    };
  }

  async addProduct(data: ProductInfoValidation): Promise<MutationResult> {
    const query = supabase.from(this.tableName).insert(data);

    const { error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: true,
      message: "Add product successfully",
    };
  }

  async getProductRecipes(
    productId: string,
  ): Promise<ResponseStandard<ProductRecipeVersion[]>> {
    const query = supabase
      .from(this.productRecipesTableName)
      .select(
        `
              *,
              products(*)
            `,
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    const { data: recipes, error } = await query;

    if (error) handlePostgresError(error);

    return {
      success: true,
      data: recipes || [],
    };
  }

  async addProductRecipeVersion(
    data: ProductRecipeVersion,
  ): Promise<MutationResult> {
    const query = supabase.from(this.productRecipesTableName).insert(data);

    const { error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: true,
      message: "Add product recipe version successfully",
    };
  }

  async getProductRecipeDetail(
    recipeId: string,
  ): Promise<ResponseStandard<ProductRecipeItem[]>> {
    const query = supabase
      .from(this.productRecipeItemsTableName)
      .select(
        `
            *,
            components(*),
            ingredients(*)
            `,
      )
      .eq("recipe_version_id", recipeId);

    const { data, error } = await query;

    if (error) handlePostgresError(error);

    return {
      success: true,
      data: data || [],
    };
  }

  async upsertProductRecipeItem(
    data: ProductRecipeItemValidationSchema[],
    recipeId: string,
  ): Promise<MutationResult> {
    const query = supabase
      .from(this.productRecipeItemsTableName)
      .upsert(data)
      .eq("recipe_version_id", recipeId);

    const { error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: true,
      message: "Upsert product recipe item successfully",
    };
  }

  async deleteProductRecipeItem(ids: string[]): Promise<MutationResult> {
    const query = supabase
      .from(this.productRecipeItemsTableName)
      .delete()
      .in("id", ids);

    const { error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: true,
      message: "Delete product recipe item successfully",
    };
  }

  async calculateProductCost(id: string) {
    const query = supabase.rpc("recompute_product_cost");

    const { error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: true,
      message: "Calculate product cost successfully",
    };
  }

  async createNewRecipe(productId: string) {
    const query = supabase.from(this.productRecipesTableName).insert({
      product_id: productId,
    });

    const { error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: true,
      message: "Create new recipe successfully",
    };
  }

  // Public
  async getProductDetail(id: string): Promise<ResponseStandard<Product>> {
    const query = supabase
      .from(this.tableName)
      .select(`*`)
      .eq("id", id)
      .single();

    const { data, error } = await query;

    if (error) handlePostgresError(error);

    return {
      success: true,
      data: data,
    };
  }
}

export const productService = new ProductService();

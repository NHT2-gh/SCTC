import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { GetWithFilterParams, ResponseStandard } from "@/types/common";
import { Product } from "@/types/menu";

class ProductService {
  private tableName: string;

  constructor() {
    this.tableName = "products";
  }

  async getAllProduct(
    params?: GetWithFilterParams,
  ): Promise<ResponseStandard<Product[]>> {
    const query = supabase.from(this.tableName).select(`*`);

    if (params?.searchText === "/all") {
      query.limit(50);
    } else if (params?.searchText) {
      query.ilike("name", `%${params.searchText}%`).limit(30);
    }

    const { data: drinks, error } = await query;
    if (error) handlePostgresError(error);
    return {
      success: true,
      data: drinks || [],
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

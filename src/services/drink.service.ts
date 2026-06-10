import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { GetWithFilterParams, ResponseStandard } from "@/types/common";
import { Drink } from "@/types/menu";

class DrinkService {
  private tableName: string;

  constructor() {
    this.tableName = "drinks";
  }

  async getAllDrinks(
    params?: GetWithFilterParams,
  ): Promise<ResponseStandard<Drink[]>> {
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
}

export const drinkService = new DrinkService();

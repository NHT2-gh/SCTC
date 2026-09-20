import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { ResponseStandard } from "@/types/common";
import { StoreSetting } from "@/types/store";

class StoreService {
  private storeSatusTableName = "storeSatusTableName";
  constructor() {
    this.storeSatusTableName = "store_setting";
  }
  async getStoreStatus(): Promise<ResponseStandard<StoreSetting[]>> {
    const query = supabase
      .from(this.storeSatusTableName)
      .select("*")
      .eq("is_active", true)
      .order("id", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    const { data, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return {
      data: data || [],
      success: true,
    };
  }
}

export const storeService = new StoreService();

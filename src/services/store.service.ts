import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { ResponseStandard } from "@/types/common";
import { StoreStatus } from "@/types/store";

class StoreService {
  private storeSatusTableName;
  constructor() {
    this.storeSatusTableName = "history_store_status";
  }
  async getStoreStatus(): Promise<ResponseStandard<StoreStatus[]>> {
    const query = supabase
      .from(this.storeSatusTableName)
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    const { data, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return {
      data: data || [],
      success: true,
    };
  }

  async upsertStoreStatus(status: Partial<StoreStatus>) {
    const query = supabase.from(this.storeSatusTableName).upsert({
      id: status.id,
      is_active: status.is_active,
      time_end: status.time_end
        ? new Date(status.time_end).toISOString()
        : undefined,

      time_start: status.time_start
        ? new Date(status.time_start).toISOString()
        : undefined,
      status: status.status,
      updated_at: new Date(),
    });

    const { data, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return {
      data,
      success: true,
    };
  }
}

export const storeService = new StoreService();

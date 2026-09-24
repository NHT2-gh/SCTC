import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { ResponseStandard } from "@/types/common";
import { Table } from "@/types/store";

class OverviewService {
  private tableName: string;

  constructor() {
    this.tableName = "tables";
  }

  async getAvailableTables(): Promise<ResponseStandard<Table[]>> {
    const query = supabase
      .from(this.tableName)
      .select("*")
      .eq("is_active", true);

    const { data, error } = await query;
    if (error) handlePostgresError(error);
    return {
      success: true,
      data: data || [],
    };
  }
}

export const overviewService = new OverviewService();

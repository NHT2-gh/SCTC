import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { Announcement } from "@/types/announcement";
import { ResponseStandard } from "@/types/common";

class StoreAnnouncementService {
  public tableName: string;

  constructor() {
    this.tableName = "store_announcement";
  }

  async getStoreAnnouncement(): Promise<ResponseStandard<Announcement[]>> {
    const query = supabase.from(this.tableName).select(`*`);

    const { data: notis, error } = await query;

    if (error) handlePostgresError(error);

    return {
      data: notis || [],
      success: true,
    };
  }
}

export const storeAnnouncementService = new StoreAnnouncementService();

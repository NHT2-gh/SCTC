import { handlePostgresError } from "@/lib/error/postgres-error";
import { AddPromotionValidation } from "@/schemas/validation/promotion.validation";
import { supabase } from "@/supabase/supabaseClients";
import { MutationResult, ResponseStandard } from "@/types/common";
import { Promotion } from "@/types/promotions";

class PromotionService {
  private promotionTable: string;

  constructor() {
    this.promotionTable = "promotions";
  }

  async getAll(): Promise<ResponseStandard<Promotion[]>> {
    const { data, error } = await supabase
      .from(this.promotionTable)
      .select("*");
    if (error) handlePostgresError(error);
    return {
      success: true,
      data: data || [],
    };
  }

  async addPromotion(data: AddPromotionValidation): Promise<MutationResult> {
    const { error } = await supabase.from(this.promotionTable).insert(data);

    if (error) handlePostgresError(error);
    return {
      success: true,
    };
  }

  async updatePromotion(data: Promotion): Promise<MutationResult> {
    const { error } = await supabase
      .from(this.promotionTable)
      .update(data)
      .eq("id", data.id);
    if (error) handlePostgresError(error);
    return {
      success: true,
    };
  }
}
export const promotionService = new PromotionService();

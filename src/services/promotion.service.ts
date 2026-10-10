import { handlePostgresError } from "@/lib/error/postgres-error";
import { promotionValidation } from "@/schemas/validation/promotion.validation";
import { supabase } from "@/supabase/supabaseClients";
import { GetParams, MutationResult, ResponseStandard } from "@/types/common";
import {
  OrderDiscount,
  Promotion,
  PromotionForOrder,
  RequestApplyPromotion,
  RequestPromotionAllow,
} from "@/types/promotions";
import { orderService } from "./order.service";

class PromotionService {
  private promotionTable: string;
  private orderDiscountsTable: string;
  constructor() {
    this.promotionTable = "promotions";
    this.orderDiscountsTable = "order_discounts";
  }

  async getAll(
    params?: GetParams<Promotion>,
  ): Promise<ResponseStandard<Promotion[]>> {
    const query = supabase.from(this.promotionTable).select("*");

    if (params?.orderBy) {
      query.order(params.orderBy.columnName, {
        ascending: params.orderBy.asc,
      });
    }
    const { data, error } = await query;
    if (error) handlePostgresError(error);
    return {
      success: true,
      data: data || [],
    };
  }

  async getDetail(id?: string): Promise<ResponseStandard<Promotion>> {
    if (!id) {
      return {
        success: false,
        message: "Id is required",
        data: {} as Promotion,
      };
    }
    const query = supabase
      .from(this.promotionTable)
      .select("*")
      .eq("id", id)
      .single();
    const { data, error } = await query;
    if (error) handlePostgresError(error);
    return {
      success: true,
      data: data,
    };
  }

  async addPromotion(data: promotionValidation): Promise<MutationResult> {
    const { error } = await supabase.from(this.promotionTable).insert(data);

    if (error) handlePostgresError(error);
    return {
      success: true,
    };
  }

  async updatePromotion(data: promotionValidation): Promise<MutationResult> {
    const { error } = await supabase
      .from(this.promotionTable)
      .update({
        name: data.name,
        description: data.description,
        trigger: data.trigger,
        conditions: data.conditions,
        status: data.status,
        limit: data.limit,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        start_at: data.conditions.time_apply.date_range[0],
        end_at: data.conditions.time_apply.date_range[1],
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) handlePostgresError(error);
    return {
      success: true,
    };
  }

  async applyPromotion(data: RequestApplyPromotion[]): Promise<MutationResult> {
    const query = supabase
      .from(this.orderDiscountsTable)
      .upsert(
        data.map((p) => {
          return {
            id: p.id,
            order_id: p.order_id,
            promotion_id: p.promotion.id,
            promtion_code: p.promotion.coupon_codes,
            promotion_snapshot: JSON.stringify(p.promotion),
            discount_value: p.promotion.discount_value,
            reason: "Đủ điều kiện áp dụng khuyến mãi",
          };
        }),
      )
      .select("*");
    const { error } = await query;

    try {
      orderService.updateOrder;
    } catch {}
    if (error) handlePostgresError(error);
    return {
      success: true,
    };
  }

  async getPromotionAllow(
    resquest: RequestPromotionAllow,
  ): Promise<ResponseStandard<PromotionForOrder[]>> {
    const query = supabase.rpc("get_promotions_allow", resquest).select();
    const { data, error } = await query;
    if (error) handlePostgresError(error);

    return {
      success: true,
      data: data || [],
    };
  }

  async getOrderDiscount(
    orderId: string,
  ): Promise<ResponseStandard<OrderDiscount[]>> {
    const query = supabase
      .from(this.orderDiscountsTable)
      .select("*")
      .eq("order_id", orderId);

    const { data: promotions, error } = await query;

    if (error) handlePostgresError(error);

    return {
      success: true,
      data: promotions || [],
    };
  }
}
export const promotionService = new PromotionService();

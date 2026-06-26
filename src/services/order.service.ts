import { ErrorCode } from "@/lib/error/error-codes";
import { handlePostgresError } from "@/lib/error/postgres-error";
import { CheckoutInfo } from "@/store/checkout/config";
import { supabase } from "@/supabase/supabaseClients";
import { CartItem } from "@/types/cart";
import {
  GetWithFilterParams,
  MutationResult,
  ResponseStandard,
} from "@/types/common";
import { Order, OrderDetail, UpdateOrderDTO } from "@/types/order";

class OrderService {
  private baseTable: string;
  private orderItemTable: string;

  constructor() {
    this.baseTable = "orders";
    this.orderItemTable = "order_items";
  }

  async createOrder(
    cartitems: CartItem[],
    checkoutInfo: CheckoutInfo,
  ): Promise<
    ResponseStandard<{
      order_id: string;
      tracking_order: string;
    }>
  > {
    const query = supabase.rpc("create_order", {
      p_checkout: checkoutInfo,
      p_cart: cartitems,
    });

    const { data: newOrder, error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: newOrder ? true : false,
      data: {
        order_id: newOrder.order_id,
        tracking_order: newOrder.tracking_order,
      },
    };
  }

  async getOrderDetail(
    trackingCode: string,
  ): Promise<ResponseStandard<OrderDetail>> {
    const query = supabase.rpc("get_order_detail", {
      p_tracking_order: trackingCode,
    });

    const { data: orderDetail, error } = await query;

    if (error) handlePostgresError(error);

    if (!orderDetail)
      return {
        success: false,
        data: orderDetail,
        message: ErrorCode.NOT_FOUND,
      };
    return {
      success: true,
      data: orderDetail,
    };
  }

  async getAllOrder(
    params?: GetWithFilterParams,
  ): Promise<ResponseStandard<Order[]>> {
    const query = supabase
      .from(this.baseTable)
      .select("*")
      .order("created_at", { ascending: true });

    const { data: orders, error } = await query;

    if (error) handlePostgresError(error);

    return {
      success: true,
      data: orders || [],
    };
  }

  async updateOrderStatus(data: UpdateOrderDTO): Promise<MutationResult> {
    const query = supabase
      .from(this.baseTable)
      .update({
        status: data.status,
      })
      .eq("id", data.order_id);

    const { error } = await query;

    if (error) handlePostgresError(error);

    return {
      success: true,
    };
  }
}
export const orderService = new OrderService();

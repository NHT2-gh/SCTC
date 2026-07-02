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
import {
  CreateOrderDTO,
  Order,
  OrderDetail,
  UpdateOrderDTO,
} from "@/types/order";

class OrderService {
  private baseTable: string;

  constructor() {
    this.baseTable = "orders";
  }

  async createOrder(data: CreateOrderDTO): Promise<
    ResponseStandard<{
      order_id: string;
      tracking_order: string;
    }>
  > {
    const query = supabase.rpc("create_order", {
      p_order_type: data.order_type,
      p_checkout: data.checkoutInfo,
      p_cart: data.cartItems,
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
    const query = supabase.from(this.baseTable).select(
      `
      *,
      tables(
        id,
        name
      )
      `,
    );

    if (params?.filters) {
      const arrayParamFilters = Object.entries(params?.filters);
      arrayParamFilters.map(([key, value]) => {
        if (value) {
          query.eq(key, value as string);
        }
      });
    }

    const { data: orders, error } = await query.order("updated_at", {
      ascending: true,
    });

    console.log(orders);

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
      .eq("tracking_order", data.trackingCode)
      .select()
      .single();

    const { data: updatedOrder, error } = await query;

    if (error) handlePostgresError(error);

    if (!updatedOrder) {
      return {
        success: false,
        message: ErrorCode.NOT_FOUND,
      };
    }

    return {
      success: true,
    };
  }
}
export const orderService = new OrderService();

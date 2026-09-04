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
  OrderStatus,
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
    params?: GetWithFilterParams<Order>,
  ): Promise<ResponseStandard<Order[]>> {
    const query = supabase.from(this.baseTable).select(
      `
      *,
      tables(
        id,
        name
      )
      `,
      { count: "exact" },
    );

    if (params?.searchText) {
      query.or(
        `tracking_order.ilike.%${params.searchText}%,customer_name.ilike.%${params.searchText}%,customer_phone.ilike.%${params.searchText}%`,
      );
    }

    if (params?.filters) {
      const arrayParamFilters = Object.entries(params?.filters);
      arrayParamFilters.map(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            if (key === "created_at") {
              query.gte(key, `${value[0]}`).lte(key, `${value[1]}`);
            } else {
              query.in(key, value as string[]);
            }
          } else {
            query.eq(key, value as string);
          }
          if (key === "status") {
            if (value === OrderStatus.COMPLETED) {
              query.order("updated_at", {
                ascending: false,
              });
            }
          }
        }
      });
    }

    if (params?.page && params?.limit) {
      query.range(
        (params.page - 1) * params.limit,
        params.page * params.limit - 1,
      );
    }

    const {
      data: orders,
      error,
      count,
    } = await query.order("created_at", {
      ascending: false,
    });

    if (error) handlePostgresError(error);

    return {
      success: true,
      data: orders || [],
      pagination: {
        page: params?.page,
        limit: params?.limit,
        total: count ?? 0,
      },
    };
  }

  async updateOrder(data: UpdateOrderDTO): Promise<MutationResult> {
    if (!data.ids)
      return {
        success: false,
        message: ErrorCode.INVALID_INPUT,
      };

    const query = supabase
      .from(this.baseTable)
      .update({
        status: data.status,
      })
      .in("id", data.ids)
      .select();

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

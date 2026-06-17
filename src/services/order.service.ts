import { handlePostgresError } from "@/lib/error/postgres-error";
import { CheckoutInfo } from "@/store/checkout/config";
import { supabase } from "@/supabase/supabaseClients";
import { CartItem } from "@/types/cart";
import { MutationResult } from "@/types/common";

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
  ): Promise<MutationResult> {
    const query = supabase.rpc("create_order", {
      p_checkout: checkoutInfo,
      p_cart: cartitems,
    });

    const { data: id, error } = await query;

    if (error) handlePostgresError(error);
    return {
      success: id ? true : false,
    };
  }
}
export const orderService = new OrderService();

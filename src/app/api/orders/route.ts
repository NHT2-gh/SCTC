import { getCurrentTable } from "@/lib/table/get-current-table";
import { adminSupabase } from "@/supabase/supabaseAdmin";
import { CreateOrderDTO } from "@/types/order";

export async function POST(req: Request) {
  const body = await req.json();
  const currentTable = await getCurrentTable();

  const {
    cartItems,
    checkoutInfo,
    table_id: tableIdFromBody,
  } = body as CreateOrderDTO;

  const { data: newOrder, error } = await adminSupabase.rpc("create_order_v2", {
    p_table_id: currentTable?.tableId,
    p_order_type: currentTable?.tableId ? "dine_in" : "take_away",
    p_checkout: checkoutInfo,
    p_cart: cartItems,
  });

  if (error) {
    return new Response(error.message, {
      status: 500,
    });
  }

  return new Response(JSON.stringify(newOrder), {
    status: 201,
  });
}

import { getCurrentTable } from "@/lib/table/get-current-table";
import { adminSupabase } from "@/supabase/supabaseAdmin";
import { CreateOrderDTO, OrderType } from "@/types/order";

export async function POST(req: Request) {
  const body = await req.json();
  const currentTable = await getCurrentTable();

  const { cartItems, checkoutInfo } = body as CreateOrderDTO;

  const bodySchema = {
    p_table_id: currentTable?.tableId ? Number(currentTable.tableId) : null,
    p_order_type: currentTable?.tableId
      ? OrderType.dine_in
      : OrderType.take_away,
    p_checkout: checkoutInfo,
    p_cart: cartItems,
  };

  const { data: newOrder, error } = await adminSupabase.rpc(
    "create_order_v2",
    bodySchema,
  );

  if (error) {
    return new Response(error.message, {
      status: 500,
    });
  }

  return new Response(JSON.stringify(newOrder), {
    status: 201,
  });
}

import { Order } from "@/types/order";
import { supabase } from "../supabaseClients";

type SubscribeOrdersOptions = {
  onInsert?: (order: Order) => void;
  onUpdate?: (order: Order) => void;
};

export function subscribeOrders({
  onInsert,
  onUpdate,
}: SubscribeOrdersOptions) {
  const channel = supabase
    .channel("orders")

    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "orders",
      },
      (payload) => {
        onInsert?.(payload.new as Order);
      },
    )

    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "orders",
      },
      (payload) => {
        onUpdate?.(payload.new as Order);
      },
    )

    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

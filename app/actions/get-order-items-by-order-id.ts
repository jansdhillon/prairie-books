"use server";
import { createClient } from "@/utils/supabase/server";

const getOrderItemsByOrderId = async (orderId: string) => {
  const supabase = createClient();
  const { data: orders, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("id", orderId)

    console.log(orders);

  if (error) {
    console.error("Error fetching orders:", error.message);
  }

  if (!orders) {
    return null;
  }

  return orders;
};

export { getOrderItemsByOrderId };

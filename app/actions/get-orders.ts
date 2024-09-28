"use server";
import { createClient } from "@/utils/supabase/server";

const getOrdersByUserId = async (userId: string) => {
  const supabase = createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items(
        *,
        book:books(
          *
        )
      ),
      payment:payments(*)
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching orders:", error.message);
    return [];
  }

  return orders || [];
};

export { getOrdersByUserId };

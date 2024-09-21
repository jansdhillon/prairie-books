"use server";
import { createClient } from "@/utils/supabase/server";

const getOrdersByUserId = async (userId: string) => {
  const supabase = createClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching orders:", error.message);
  }

  if (!orders) {
    return [];
  }

  return orders;
};

export { getOrdersByUserId };

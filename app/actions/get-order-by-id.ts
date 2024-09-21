"use server";
import { createClient } from "@/utils/supabase/server";

const getOrderById = async (orderId: string) => {
  const supabase = createClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order:", error.message);
  }

  if (!order) {
    return null;
  }

  return order;
};

export { getOrderById };

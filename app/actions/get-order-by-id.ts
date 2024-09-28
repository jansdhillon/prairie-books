"use server";
import { createClient } from "@/utils/supabase/server";
import { getOrderItemsByOrderId } from "./get-order-items-by-order-id";
import { getPaymentById } from "./get-payment";

export const getOrderById = async (orderId: string) => {
  const supabase = createClient();

  const { data: orderItems, error } = await supabase
    .from("order_items")
    .select(`
      *,
      book:books(
        title,
        author
      )
    `)
    .eq("order_id", orderId);

  if (error) {
    console.error("Error fetching order items:", error.message);
    return { error };
  }

  return { data: { items: orderItems } };
};

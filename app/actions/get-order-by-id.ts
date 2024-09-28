"use server";
import { createClient } from "@/utils/supabase/server";
import { getOrderItemsByOrderId } from "./get-order-items-by-order-id";
import { getPaymentById } from "./get-payment";
import { getOrderById as getOrdersWithOrderItems } from "@/utils/supabase/queries";

export const getOrderById = async (orderId: string) => {
  const supabase = createClient();

  const { data: orderItems, error } = await getOrdersWithOrderItems(supabase, orderId);

  if (error) {
    console.error("Error fetching order items:", error.message);
    return { error };
  }

  return { data: orderItems, error };
};

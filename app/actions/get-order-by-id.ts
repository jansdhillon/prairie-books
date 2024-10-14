"use server";

import { getOrderItemsByOrderId } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

export const getOrderAction = async (orderId: string) => {
  const supabase = createClient();

  const { data: orderItems, error } = await getOrderItemsByOrderId(supabase, orderId);

  if (error) {
    console.error("Error fetching order items:", error.message);
    return { error };
  }

  return { data: orderItems, error };
};

"use server";

import { getOrderById, getOrderItemsByOrderId } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

export const getOrderAction = async (orderId: string) => {
  const supabase = createClient();

  const { data: order, error: orderErorr } = await getOrderById(supabase, orderId);

  if (orderErorr) {
    console.error("Error fetching order:", orderErorr.message);
    return { error: orderErorr };
  }

  const { data: orderItems, error } = await getOrderItemsByOrderId(supabase, orderId);

  if (error ) {
    console.error("Error fetching order items:", error.message);
    return { error };
  }

  return { order, orderItems, error };
};

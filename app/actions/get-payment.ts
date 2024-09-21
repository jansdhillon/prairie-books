"use server";
import { createClient } from "@/utils/supabase/server";

const getPaymentById = async (orderId: string) => {
  const supabase = createClient();
  const { data: payment, error } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (error) {
    console.error("Error fetching payment:", error.message);
  }



  if (!payment) {
    return null;
  }

  return payment;
};

export { getPaymentById };

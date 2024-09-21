"use server";
import { createClient } from "@/utils/supabase/server";
import { getOrderItemsByOrderId } from "./get-order-items-by-order-id";
import { getPaymentById } from "./get-payment";

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


  const orderItems = await getOrderItemsByOrderId(orderId);

  const payment = await getPaymentById(orderId);

  const orderWithItemsAndPayment = {
    ...order,
    items: orderItems,
    payment,
  };

  return orderWithItemsAndPayment;

};

export { getOrderById };

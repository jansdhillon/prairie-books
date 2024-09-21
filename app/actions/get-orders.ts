"use server";
import { createClient } from "@/utils/supabase/server";
import { getOrderItemsByOrderId } from "./get-order-items-by-order-id";

const getOrdersByUserId = async (userId: string) => {
  const supabase = createClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId);


  if (error) {
    console.error("Error fetching orders:", error.message);
  }

  if (!orders) {
    return [];
  }

  const ordersWithItems = await Promise.all(orders.map(async (order: any) => {
    const orderItems = await getOrderItemsByOrderId(order.id);



    return {
      ...order,
      items: orderItems,
    };
    }));



    const ordersWithItemsAndPayment = await Promise.all(ordersWithItems.map(async (order: any) => {
        const { data: payment, error: paymentError } = await supabase
            .from("payments")
            .select("*")
            .eq("order_id", order.id)
            .single();

        if (paymentError) {
            console.error("Error fetching payment:", paymentError.message);
        }

        return {
            ...order,
            payment,
        };
        }));


    return ordersWithItemsAndPayment;


};

export { getOrdersByUserId };
